import { ProjectStatus } from '@/types/projectUpdates';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

// Define valid status transitions
const VALID_TRANSITIONS: Record<ProjectStatus, ProjectStatus[]> = {
  open: ['assigned', 'cancelled'],
  assigned: ['in_progress', 'cancelled'],
  in_progress: ['work_submitted', 'cancelled'],
  work_submitted: ['work_revision_requested', 'work_approved', 'cancelled'],
  work_revision_requested: ['work_submitted', 'cancelled'],
  work_approved: ['completed', 'cancelled'],
  completed: ['paid', 'cancelled'],
  paid: ['archived'],
  archived: [],
  cancelled: [],
  disputed: ['cancelled', 'in_progress']
};

// Define required conditions for each status transition
const TRANSITION_REQUIREMENTS: Record<ProjectStatus, {
  requiredFields: string[];
  requiredConditions: (project: any) => boolean;
}> = {
  open: {
    requiredFields: ['title', 'description', 'budget'],
    requiredConditions: (project) => true
  },
  assigned: {
    requiredFields: ['assigned_to', 'professional_id'],
    requiredConditions: (project) => !!project.assigned_to && !!project.professional_id
  },
  in_progress: {
    requiredFields: ['project_start_time'],
    requiredConditions: (project) => !!project.project_start_time
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
    requiredConditions: (project) => !!project.revision_notes
  },
  work_approved: {
    requiredFields: [],
    requiredConditions: (project) => true
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
  paid: {
    requiredFields: ['payment_id', 'payment_status'],
    requiredConditions: (project) => {
      // Check if payment exists and is completed
      return !!project.payment_id && 
             project.payment_status === 'completed' &&
             project.status === 'completed';
    }
  },
  archived: {
    requiredFields: [],
    requiredConditions: (project) => project.status === 'paid'
  },
  cancelled: {
    requiredFields: ['cancellation_reason'],
    requiredConditions: (project) => !!project.cancellation_reason
  },
  disputed: {
    requiredFields: ['dispute_reason'],
    requiredConditions: (project) => !!project.dispute_reason
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
    // Get current project data
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('*, milestones(*)')
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