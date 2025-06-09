import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { notificationService } from '@/services/notificationService';
import { ProjectStatus } from '@/types/projectUpdates';
import { validateStatusTransition, handleStatusTransition } from '@/utils/projectStatusTransitions';

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

  // Get the next valid status based on current status
  const getNextStatus = (currentStatus: ProjectStatus): ProjectStatus | undefined => {
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

    const validTransitions = VALID_TRANSITIONS[currentStatus];
    if (!validTransitions || validTransitions.length === 0) return undefined;
    
    // For simplicity in the UI, we'll take the first valid transition
    return validTransitions[0];
  };

  const updateStatus = async () => {
    const newStatus = getNextStatus(currentStatus);
    if (!newStatus) {
      toast({
        title: 'Invalid Status Change',
        description: 'No valid status transitions available.',
        variant: 'destructive'
      });
      return;
    }

    setIsUpdating(true);
    try {
      // Use the shared status transition handler with professionalId
      const result = await handleStatusTransition(
        projectId,
        newStatus,
        professionalId // Using professionalId instead of userId
      );

      if (!result.success) {
        throw new Error(result.message);
      }

      // Create status change notification
      try {
        await notificationService.createStatusChangeNotification(
          projectId,
          projectTitle,
          currentStatus,
          newStatus,
          clientId,
          professionalId
        );
      } catch (notificationError) {
        console.error('Error creating status notification:', notificationError);
        // Don't throw here, as the status was updated successfully
        toast({
          title: 'Warning',
          description: 'Status updated but failed to send notification.',
          variant: 'default'
        });
      }

      onStatusUpdate(newStatus);
      toast({
        title: 'Status Updated',
        description: `Project status has been updated to ${newStatus.replace('_', ' ')}.`
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update project status.',
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