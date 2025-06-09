import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { notificationService } from '@/services/notificationService';
import { ProjectStatus } from '@/types/projectUpdates';
import { VALID_TRANSITIONS } from '@/utils/projectStatusTransitions';

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
    const validTransitions = VALID_TRANSITIONS[currentStatus];
    if (!validTransitions || validTransitions.length === 0) return null;
    
    // Get the first valid transition that's not 'cancelled'
    return validTransitions.find(status => status !== 'cancelled') || null;
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