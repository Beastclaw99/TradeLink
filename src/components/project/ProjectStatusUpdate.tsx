import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { notificationService } from '@/services/notificationService';
import { ProjectStatus } from '@/types/projectUpdates';
import { handleStatusTransition } from '@/utils/projectStatusTransitions';

interface ProjectStatusUpdateProps {
  projectId: string;
  projectTitle: string;
  currentStatus: ProjectStatus;
  clientId: string;
  professionalId: string;
  onStatusUpdate: (newStatus: ProjectStatus) => void;
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

  const getNextStatus = (currentStatus: ProjectStatus): ProjectStatus | null => {
    // Get the next valid status based on current status
    switch (currentStatus) {
      case 'open':
        return 'assigned';
      case 'assigned':
        return 'in_progress';
      case 'in_progress':
        return 'work_submitted';
      case 'work_submitted':
        return 'work_approved';
      case 'work_revision_requested':
        return 'work_submitted';
      case 'work_approved':
        return 'completed';
      case 'completed':
        return 'paid';
      case 'paid':
        return 'archived';
      default:
        return null;
    }
  };

  const updateStatus = async () => {
    const newStatus = getNextStatus(currentStatus);
    if (!newStatus) {
      toast({
        title: 'Error',
        description: 'No valid status transition available.',
        variant: 'destructive'
      });
      return;
    }

    setIsUpdating(true);
    try {
      const result = await handleStatusTransition(
        projectId,
        newStatus,
        professionalId
      );

      if (result.success) {
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
          description: result.message
        });
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Failed to update project status',
          variant: 'destructive'
        });
      }
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

  const nextStatus = getNextStatus(currentStatus);
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