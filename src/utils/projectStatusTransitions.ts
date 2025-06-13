import { Database } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

type ProjectStatus = Database['public']['Enums']['project_status_enum'];

// Define valid status transitions
export const VALID_TRANSITIONS: Record<ProjectStatus, ProjectStatus[]> = {
  draft: ['open', 'archived'],
  open: ['assigned', 'archived', 'cancelled'],
  assigned: ['in_progress', 'archived', 'cancelled'],
  in_progress: ['work_submitted', 'archived', 'cancelled'],
  work_submitted: ['work_revision_requested', 'work_approved', 'archived', 'cancelled'],
  work_revision_requested: ['work_submitted', 'archived', 'cancelled'],
  work_approved: ['completed', 'archived', 'cancelled'],
  completed: ['archived'],
  archived: [],
  cancelled: [],
  disputed: ['archived', 'cancelled']
};

// Define required conditions for each status transition
export const TRANSITION_REQUIREMENTS: Record<ProjectStatus, {
  requiredFields: string[];
  requiredRelations: string[];
}> = {
  draft: {
    requiredFields: ['title', 'description'],
    requiredRelations: []
  },
  open: {
    requiredFields: ['title', 'description', 'budget', 'timeline'],
    requiredRelations: []
  },
  assigned: {
    requiredFields: ['title', 'description', 'budget', 'timeline'],
    requiredRelations: ['professional_id']
  },
  in_progress: {
    requiredFields: ['title', 'description', 'budget', 'timeline'],
    requiredRelations: ['professional_id']
  },
  work_submitted: {
    requiredFields: ['title', 'description', 'budget', 'timeline'],
    requiredRelations: ['professional_id']
  },
  work_revision_requested: {
    requiredFields: ['title', 'description', 'budget', 'timeline'],
    requiredRelations: ['professional_id']
  },
  work_approved: {
    requiredFields: ['title', 'description', 'budget', 'timeline'],
    requiredRelations: ['professional_id']
  },
  completed: {
    requiredFields: ['title', 'description', 'budget', 'timeline'],
    requiredRelations: ['professional_id']
  },
  archived: {
    requiredFields: [],
    requiredRelations: []
  },
  cancelled: {
    requiredFields: [],
    requiredRelations: []
  },
  disputed: {
    requiredFields: ['title', 'description', 'budget', 'timeline'],
    requiredRelations: ['professional_id']
  }
};

// Validate if a status transition is allowed
export function isValidTransition(
  currentStatus: ProjectStatus,
  newStatus: ProjectStatus
): boolean {
  return VALID_TRANSITIONS[currentStatus]?.includes(newStatus) ?? false;
}

export function validateTransitionRequirements(
  currentStatus: ProjectStatus,
  newStatus: ProjectStatus,
  project: any
): { isValid: boolean; missingFields: string[] } {
  const requirements = TRANSITION_REQUIREMENTS[newStatus];
  if (!requirements) {
    return { isValid: false, missingFields: ['Invalid status'] };
  }

  const missingFields: string[] = [];

  // Check required fields
  for (const field of requirements.requiredFields) {
    if (!project[field]) {
      missingFields.push(field);
    }
  }

  // Check required relations
  for (const relation of requirements.requiredRelations) {
    if (!project[relation]) {
      missingFields.push(relation);
    }
  }

  return {
    isValid: missingFields.length === 0,
    missingFields
  };
}

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
    const validation = validateTransitionRequirements(
      project.status as ProjectStatus,
      newStatus,
      project
    );

    if (!validation.isValid) {
      return {
        success: false,
        message: `Missing required fields: ${validation.missingFields.join(', ')}`
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