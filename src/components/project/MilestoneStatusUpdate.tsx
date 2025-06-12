import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { notificationService } from '@/services/notificationService';
import { MilestoneStatus } from '@/types/database';

interface MilestoneStatusUpdateProps {
  projectId: string;
  projectTitle: string;
  milestoneId: string;
  milestoneTitle: string;
  currentStatus: MilestoneStatus;
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

  const getNextStatus = (currentStatus: MilestoneStatus): MilestoneStatus | null => {
    const statusFlow: Record<MilestoneStatus, MilestoneStatus> = {
      not_started: 'in_progress',
      in_progress: 'completed',
      completed: 'completed',
      overdue: 'in_progress',
      on_hold: 'in_progress'
    };
    return statusFlow[currentStatus] || null;
  };

  const updateStatus = async () => {
    const newStatus = getNextStatus(currentStatus);
    if (!newStatus) return;

    // If trying to mark as completed, validate all tasks are completed
    if (newStatus === 'completed') {
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
        return;
      }
      const taskIds = milestone?.task_ids || [];
      if (taskIds.length > 0) {
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
          return;
        }
        const incompleteTasks = tasks?.filter(task => !task.completed) || [];
        if (incompleteTasks.length > 0) {
          toast({
            title: 'Cannot Complete Milestone',
            description: 'All tasks must be completed before marking this milestone as completed.',
            variant: 'destructive'
          });
          return;
        }
      }
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
        const { data: milestone } = await supabase
          .from('project_milestones')
          .select('due_date')
          .eq('id', milestoneId)
          .single();

        if (milestone?.due_date && new Date(milestone.due_date) < new Date()) {
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
    };

    checkOverdue();
  }, [currentStatus, milestoneId, projectId, projectTitle, milestoneTitle, clientId, professionalId]);

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

export default MilestoneStatusUpdate; 