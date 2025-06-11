import { ProjectStatus } from '@/types/projectUpdates';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

// Define valid status transitions
const VALID_TRANSITIONS: Record<ProjectStatus, ProjectStatus[]> = {
  draft: ['open', 'cancelled'],
  open: ['assigned', 'cancelled'],
  assigned: ['in_progress', 'cancelled'],
  in_progress: ['work_submitted', 'cancelled'],
  work_submitted: ['work_revision_requested', 'work_approved', 'cancelled'],
  work_revision_requested: ['work_submitted', 'cancelled'],
  work_approved: ['completed', 'cancelled'],
  completed: ['archived'],
  archived: [],
  cancelled: [],
  disputed: ['cancelled', 'in_progress']
};

// Define required conditions for each status transition
const TRANSITION_REQUIREMENTS: Record<ProjectStatus, {
  requiredFields: string[];
  requiredConditions: (project: any) => boolean;
}> = {
  draft: {
    requiredFields: ['title', 'description'],
    requiredConditions: (project) => true
  },
  open: {
    requiredFields: ['title', 'description', 'budget', 'category'],
    requiredConditions: (project) => {
      return project.budget > 0 && !!project.category;
    }
  },
  assigned: {
    requiredFields: ['assigned_to', 'professional_id', 'contract_template_id'],
    requiredConditions: (project) => {
      return !!project.assigned_to && 
             !!project.professional_id && 
             !!project.contract_template_id;
    }
  },
  in_progress: {
    requiredFields: ['project_start_time'],
    requiredConditions: (project) => {
      return !!project.project_start_time && 
             project.milestones?.length > 0;
    }
  },
  work_submitted: {
    requiredFields: [],
    requiredConditions: (project) => {
      // Check if all milestones have deliverables
      return project.milestones?.every((milestone: any) => 
        milestone.deliverables?.length > 0
      ) ?? false;
    }
  },
  work_revision_requested: {
    requiredFields: ['revision_notes'],
    requiredConditions: (project) => {
      return !!project.revision_notes;
    }
  },
  work_approved: {
    requiredFields: [],
    requiredConditions: (project) => {
      // Check if all milestones are completed
      return project.milestones?.every((milestone: any) => 
        milestone.status === 'completed'
      ) ?? false;
    }
  },
  completed: {
    requiredFields: [],
    requiredConditions: (project) => {
      // Check if all milestones are completed
      return project.milestones?.every((milestone: any) => 
        milestone.status === 'completed'
      ) ?? false;
    }
  },
  archived: {
    requiredFields: ['reviews'],
    requiredConditions: (project) => {
      // Check if project is completed
      if (project.status !== 'completed') return false;

      // Check if both reviews exist in the project data
      if (!project.reviews || !Array.isArray(project.reviews)) return false;

      const hasClientReview = project.reviews.some((review: any) => 
        review.client_id === project.client_id
      );
      const hasProfessionalReview = project.reviews.some((review: any) => 
        review.professional_id === project.professional_id
      );

      return hasClientReview && hasProfessionalReview;
    }
  },
  cancelled: {
    requiredFields: ['cancellation_reason'],
    requiredConditions: (project) => {
      return !!project.cancellation_reason;
    }
  },
  disputed: {
    requiredFields: ['dispute_reason'],
    requiredConditions: (project) => {
      return !!project.dispute_reason;
    }
  }
};

// Validate if a status transition is allowed
export const validateStatusTransition = (
  currentStatus: ProjectStatus,
  newStatus: ProjectStatus,
  project: any
): { isValid: boolean; message?: string } => {
  // Check if transition is in valid transitions
  if (!VALID_TRANSITIONS[currentStatus]?.includes(newStatus)) {
    return {
      isValid: false,
      message: `Cannot transition from ${currentStatus} to ${newStatus}`
    };
  }

  // Check required fields and conditions
  const requirements = TRANSITION_REQUIREMENTS[newStatus];
  if (!requirements) {
    return { isValid: true };
  }

  // Check required fields
  const missingFields = requirements.requiredFields.filter(
    field => !project[field]
  );
  if (missingFields.length > 0) {
    return {
      isValid: false,
      message: `Missing required fields: ${missingFields.join(', ')}`
    };
  }

  // Check required conditions
  if (!requirements.requiredConditions(project)) {
    return {
      isValid: false,
      message: 'Project does not meet required conditions for this status'
    };
  }

  return { isValid: true };
};

// Handle status transition with validation and updates
export const handleStatusTransition = async (
  projectId: string,
  newStatus: ProjectStatus,
  userId: string,
  metadata?: any
): Promise<{ success: boolean; message?: string }> => {
  try {
    // Get current project data with reviews
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select(`
        *,
        milestones(*),
        reviews(*)
      `)
      .eq('id', projectId)
      .single();

    if (fetchError) throw fetchError;

    // Validate transition
    const validation = validateStatusTransition(
      project.status as ProjectStatus,
      newStatus,
      project
    );

    if (!validation.isValid) {
      return {
        success: false,
        message: validation.message
      };
    }

    // Start transaction
    const { error: updateError } = await supabase
      .from('projects')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
        ...metadata
      })
      .eq('id', projectId);

    if (updateError) throw updateError;

    // Create status update record
    const { error: updateRecordError } = await supabase
      .from('project_updates')
      .insert({
        project_id: projectId,
        update_type: 'status_change',
        status_update: newStatus,
        professional_id: userId,
        metadata: {
          previous_status: project.status,
          ...metadata
        }
      });

    if (updateRecordError) throw updateRecordError;

    return {
      success: true,
      message: `Project status updated to ${newStatus}`
    };

  } catch (error: any) {
    console.error('Error updating project status:', error);
    return {
      success: false,
      message: error.message || 'Failed to update project status'
    };
  }
}; 