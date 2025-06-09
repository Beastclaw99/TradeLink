import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ProjectStatus } from '@/types/projectUpdates';

interface UseProjectCompletionProps {
  projectId: string;
  onStatusUpdate?: (newStatus: ProjectStatus) => void;
}

export const useProjectCompletion = ({ projectId, onStatusUpdate }: UseProjectCompletionProps) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const { toast } = useToast();

  const validateCompletionRequirements = async () => {
    try {
      // Check if all required checklist items are completed
      const { data: checklist, error: checklistError } = await supabase
        .from('project_completion_checklist')
        .select('*')
        .eq('project_id', projectId)
        .eq('is_required', true);

      if (checklistError) throw checklistError;

      const allRequiredCompleted = checklist?.every(item => item.is_completed);
      if (!allRequiredCompleted) {
        return {
          isValid: false,
          message: 'All required completion checklist items must be completed.'
        };
      }

      // Check if all milestones are completed
      const { data: milestones, error: milestonesError } = await supabase
        .from('project_milestones')
        .select('*')
        .eq('project_id', projectId);

      if (milestonesError) throw milestonesError;

      const allMilestonesCompleted = milestones?.every(
        milestone => milestone.status === 'completed'
      );
      if (!allMilestonesCompleted) {
        return {
          isValid: false,
          message: 'All milestones must be completed.'
        };
      }

      // Check if all deliverables are approved
      const { data: deliverables, error: deliverablesError } = await supabase
        .from('project_deliverables')
        .select('*')
        .eq('project_id', projectId);

      if (deliverablesError) throw deliverablesError;

      const allDeliverablesApproved = deliverables?.every(
        deliverable => deliverable.status === 'approved'
      );
      if (!allDeliverablesApproved) {
        return {
          isValid: false,
          message: 'All deliverables must be approved.'
        };
      }

      return { isValid: true };
    } catch (error: any) {
      console.error('Error validating completion requirements:', error);
      return {
        isValid: false,
        message: 'Error validating completion requirements.'
      };
    }
  };

  const completeProject = async () => {
    setIsCompleting(true);
    try {
      // Validate completion requirements
      const validation = await validateCompletionRequirements();
      if (!validation.isValid) {
        toast({
          title: 'Cannot Complete Project',
          description: validation.message,
          variant: 'destructive'
        });
        return;
      }

      // Update project status to completed
      const { error: updateError } = await supabase
        .from('projects')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', projectId);

      if (updateError) throw updateError;

      // Create project history record
      const { error: historyError } = await supabase
        .from('project_history')
        .insert({
          project_id: projectId,
          history_type: 'status_change',
          history_data: {
            previous_status: 'work_approved',
            new_status: 'completed',
            reason: 'Project completed successfully'
          }
        });

      if (historyError) throw historyError;

      toast({
        title: 'Success',
        description: 'Project has been marked as completed.'
      });

      if (onStatusUpdate) {
        onStatusUpdate('completed');
      }
    } catch (error: any) {
      console.error('Error completing project:', error);
      toast({
        title: 'Error',
        description: 'Failed to complete project.',
        variant: 'destructive'
      });
    } finally {
      setIsCompleting(false);
    }
  };

  const archiveProject = async (reason: string, notes?: string) => {
    try {
      // Create archive record
      const { error: archiveError } = await supabase
        .from('project_archives')
        .insert({
          project_id: projectId,
          archive_reason: reason,
          archive_notes: notes,
          archived_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (archiveError) throw archiveError;

      // Update project status to archived
      const { error: updateError } = await supabase
        .from('projects')
        .update({ status: 'archived' })
        .eq('id', projectId);

      if (updateError) throw updateError;

      // Create project history record
      const { error: historyError } = await supabase
        .from('project_history')
        .insert({
          project_id: projectId,
          history_type: 'archive',
          history_data: {
            reason,
            notes,
            archived_at: new Date().toISOString()
          }
        });

      if (historyError) throw historyError;

      toast({
        title: 'Success',
        description: 'Project has been archived successfully.'
      });

      if (onStatusUpdate) {
        onStatusUpdate('archived');
      }
    } catch (error: any) {
      console.error('Error archiving project:', error);
      toast({
        title: 'Error',
        description: 'Failed to archive project.',
        variant: 'destructive'
      });
    }
  };

  return {
    isCompleting,
    completeProject,
    archiveProject,
    validateCompletionRequirements
  };
}; 