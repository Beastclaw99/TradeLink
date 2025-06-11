import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { notificationService } from '@/services/notificationService';
import { ProjectStatus } from '@/types/projectUpdates';

interface ProjectStatusUpdateProps {
  projectId: string;
  projectTitle: string;
  currentStatus: string;
  clientId: string;
  professionalId: string;
  onStatusUpdate: (newStatus: string) => void;
}

const ProjectStatusUpdate: React.FC<ProjectStatusUpdateProps> = ({
  projectId,
  projectTitle,
  currentStatus,
  clientId,
  professionalId,
  onStatusUpdate
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const getNextStatus = (currentStatus: ProjectStatus): ProjectStatus | undefined => {
    const statusFlow: Record<ProjectStatus, ProjectStatus> = {
      draft: 'open',
      open: 'assigned',
      assigned: 'in_progress',
      in_progress: 'work_submitted',
      work_submitted: 'work_revision_requested',
      work_revision_requested: 'work_approved',
      work_approved: 'completed',
      completed: 'archived',
      archived: 'archived',
      cancelled: 'cancelled',
      disputed: 'disputed'
    };
    return statusFlow[currentStatus];
  };

  const updateStatus = async () => {
    const newStatus = getNextStatus(currentStatus as ProjectStatus);
    if (!newStatus) return;

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: newStatus })
        .eq('id', projectId);

      if (error) throw error;

      // Create status change notification
      await notificationService.createStatusChangeNotification(
        projectId,
        projectTitle,
        currentStatus,
        newStatus,
        clientId,
        professionalId
      );

      onStatusUpdate(newStatus);
      toast({
        title: 'Status Updated',
        description: `Project status has been updated to ${newStatus.replace('_', ' ')}.`
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update project status.',
        variant: 'destructive'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const nextStatus = getNextStatus(currentStatus as ProjectStatus);
  if (!nextStatus) return null;

  return (
    <Button
      onClick={updateStatus}
      disabled={isUpdating}
      className="w-full"
    >
      {isUpdating ? 'Updating...' : `Mark as ${nextStatus.replace('_', ' ')}`}
    </Button>
  );
};

export default ProjectStatusUpdate; 