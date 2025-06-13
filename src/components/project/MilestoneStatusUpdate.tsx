import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { notificationService } from '@/services/notificationService';
import { MilestoneStatus } from '@/types/database';
import { formatDateToLocale } from '@/utils/dateUtils';

interface MilestoneStatusUpdateProps {
  projectId: string;
  projectTitle: string;
  milestoneId: string;
  milestoneTitle: string;
  currentStatus: MilestoneStatus | null;
  clientId: string;
  professionalId: string;
  onStatusUpdate: (newStatus: MilestoneStatus) => void;
}

const MilestoneStatusUpdate: React.FC<MilestoneStatusUpdateProps> = ({
  projectId,
  projectTitle,
  milestoneId,
  milestoneTitle,
  currentStatus,
  clientId,
  professionalId,
  onStatusUpdate
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const getNextStatus = (currentStatus: MilestoneStatus | null): MilestoneStatus | null => {
    if (!currentStatus) return null;

    const statusFlow: Record<MilestoneStatus, MilestoneStatus> = {
      not_started: 'in_progress',
      in_progress: 'completed',
      completed: 'completed',
      overdue: 'in_progress',
      on_hold: 'in_progress'
    };
    return statusFlow[currentStatus] || null;
  };

  const validateTasksCompletion = async (): Promise<boolean> => {
    try {
      const { data: milestone, error } = await supabase
        .from('project_milestones')
        .select('task_ids')
        .eq('id', milestoneId)
        .single();

      if (error) {
        toast({
          title: 'Error',
          description: 'Could not fetch milestone tasks.',
          variant: 'destructive'
        });
        return false;
      }

      const taskIds = milestone?.task_ids || [];
      if (taskIds.length === 0) return true;

      const { data: tasks, error: tasksError } = await supabase
        .from('project_tasks')
        .select('id, title, completed')
        .in('id', taskIds);

      if (tasksError) {
        toast({
          title: 'Error',
          description: 'Could not fetch task status.',
          variant: 'destructive'
        });
        return false;
      }

      const incompleteTasks = tasks?.filter(task => !task.completed) || [];
      if (incompleteTasks.length > 0) {
        toast({
          title: 'Cannot Complete Milestone',
          description: 'All tasks must be completed before marking this milestone as completed.',
          variant: 'destructive'
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error validating tasks:', error);
      toast({
        title: 'Error',
        description: 'Failed to validate task completion.',
        variant: 'destructive'
      });
      return false;
    }
  };

  const updateStatus = async () => {
    if (!currentStatus) return;

    const newStatus = getNextStatus(currentStatus);
    if (!newStatus) return;

    // If trying to mark as completed, validate all tasks are completed
    if (newStatus === 'completed') {
      const canComplete = await validateTasksCompletion();
      if (!canComplete) return;
    }

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('project_milestones')
        .update({ status: newStatus })
        .eq('id', milestoneId);

      if (error) throw error;

      // Create milestone notification
      await notificationService.createMilestoneNotification(
        projectId,
        projectTitle,
        milestoneTitle,
        newStatus,
        clientId,
        professionalId
      );

      onStatusUpdate(newStatus);
      toast({
        title: 'Status Updated',
        description: `Milestone status has been updated to ${newStatus.replace('_', ' ')}.`
      });
    } catch (error) {
      console.error('Error updating milestone status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update milestone status.',
        variant: 'destructive'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Check for overdue milestones
  useEffect(() => {
    const checkOverdue = async () => {
      if (currentStatus === 'in_progress') {
        try {
          const { data: milestone, error } = await supabase
            .from('project_milestones')
            .select('due_date')
            .eq('id', milestoneId)
            .single();

          if (error) {
            console.error('Error fetching milestone due date:', error);
            return;
          }

          if (milestone?.due_date) {
            const dueDate = new Date(milestone.due_date);
            const now = new Date();
            if (dueDate < now) {
              // Create overdue notification
              await notificationService.createMilestoneNotification(
                projectId,
                projectTitle,
                milestoneTitle,
                'overdue',
                clientId,
                professionalId
              );
            }
          }
        } catch (error) {
          console.error('Error checking overdue status:', error);
        }
      }
    };

    checkOverdue();
  }, [currentStatus, milestoneId, projectId, projectTitle, milestoneTitle, clientId, professionalId]);

  const nextStatus = getNextStatus(currentStatus);
  if (!nextStatus || !currentStatus) return null;

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

export default MilestoneStatusUpdate; 