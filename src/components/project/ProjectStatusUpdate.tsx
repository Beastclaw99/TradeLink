import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ProjectStatus } from '@/types/database';
import { isValidTransition } from '@/utils/projectStatusTransitions';
import { supabase } from '@/integrations/supabase/client';

interface ProjectStatusUpdateProps {
  projectId: string;
  projectTitle: string;
  currentStatus: ProjectStatus;
  clientId: string;
  professionalId: string;
  onStatusUpdate: () => void;
}

const ProjectStatusUpdate = ({
  projectId,
  projectTitle,
  currentStatus,
  clientId,
  professionalId,
  onStatusUpdate
}: ProjectStatusUpdateProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const getNextStatus = (currentStatus: ProjectStatus): ProjectStatus | undefined => {
    const validTransitions: Record<ProjectStatus, ProjectStatus[]> = {
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

    return validTransitions[currentStatus]?.[0];
  };

  const handleStatusUpdate = async () => {
    const nextStatus = getNextStatus(currentStatus);
    if (!nextStatus) {
      toast({
        title: 'Error',
        description: 'No valid next status available.',
        variant: 'destructive'
      });
      return;
    }

    if (!isValidTransition(currentStatus, nextStatus)) {
      toast({
        title: 'Error',
        description: 'Invalid status transition.',
        variant: 'destructive'
      });
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: nextStatus })
        .eq('id', projectId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Project status updated to ${nextStatus}.`
      });

      onStatusUpdate();
    } catch (error) {
      console.error('Error updating project status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update project status.',
        variant: 'destructive'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusButtonText = (currentStatus: ProjectStatus): string => {
    switch (currentStatus) {
      case 'draft':
        return 'Publish Project';
      case 'open':
        return 'Assign Professional';
      case 'assigned':
        return 'Start Work';
      case 'in_progress':
        return 'Submit Work';
      case 'work_submitted':
        return 'Review Work';
      case 'work_revision_requested':
        return 'Submit Revision';
      case 'work_approved':
        return 'Complete Project';
      default:
        return 'Update Status';
    }
  };

  return (
    <Button
      onClick={handleStatusUpdate}
      disabled={isUpdating || !getNextStatus(currentStatus)}
      className="w-full"
    >
      {isUpdating ? 'Updating...' : getStatusButtonText(currentStatus)}
    </Button>
  );
};

export default ProjectStatusUpdate; 