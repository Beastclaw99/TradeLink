import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { notificationService } from '@/services/notificationService';
import { ProjectStatus } from '@/types/database';
import { isValidTransition, validateTransitionRequirements } from '@/utils/projectStatusTransitions';

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
    const validTransitions = {
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

  const updateStatus = async () => {
    const newStatus = getNextStatus(currentStatus as ProjectStatus);
    if (!newStatus) return;

    setIsUpdating(true);
    try {
      // Get current project data
      const { data: project, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (fetchError) throw fetchError;

      // Validate transition
      const validation = validateTransitionRequirements(
        currentStatus as ProjectStatus,
        newStatus,
        project
      );

      if (!validation.isValid) {
        toast({
          title: 'Cannot Update Status',
          description: `Missing required fields: ${validation.missingFields.join(', ')}`,
          variant: 'destructive'
        });
        return;
      }

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