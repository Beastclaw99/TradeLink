import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Application, Milestone, Task } from '@/types/database';

export const useClientActions = (userId: string, onSuccess?: () => void) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleApplicationUpdate = async (applicationId: string, status: Application['status']) => {
    try {
      setIsProcessing(true);

      // Update application status
      const { error: updateError } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', applicationId)
        .eq('project_id', (await supabase
          .from('projects')
          .select('id')
          .eq('client_id', userId)
          .single()
        ).data?.id);

      if (updateError) {
        throw updateError;
      }

      // Add project update
      const { data: application } = await supabase
        .from('applications')
        .select('project_id, professionals:professional_id (first_name, last_name)')
        .eq('id', applicationId)
        .single();

      if (application) {
        await supabase
          .from('project_updates')
          .insert([{
            project_id: application.project_id,
            update_type: 'application_updated',
            message: `Application ${status} for ${application.professionals.first_name} ${application.professionals.last_name}`,
            user_id: userId
          }]);
      }

      toast({
        title: "Success",
        description: `Application ${status} successfully`
      });

      // Refresh dashboard data
      onSuccess?.();
    } catch (error: any) {
      console.error('Error updating application:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to update application',
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMilestoneUpdate = async (milestoneId: string, status: Milestone['status']) => {
    try {
      setIsProcessing(true);

      // Update milestone status
      const { error: updateError } = await supabase
        .from('milestones')
        .update({ 
          status,
          completed_at: status === 'completed' ? new Date().toISOString() : null
        })
        .eq('id', milestoneId)
        .eq('project_id', (await supabase
          .from('projects')
          .select('id')
          .eq('client_id', userId)
          .single()
        ).data?.id);

      if (updateError) {
        throw updateError;
      }

      // Add project update
      const { data: milestone } = await supabase
        .from('milestones')
        .select('project_id, title')
        .eq('id', milestoneId)
        .single();

      if (milestone) {
        await supabase
          .from('project_updates')
          .insert([{
            project_id: milestone.project_id,
            update_type: 'milestone_complete',
            message: `Milestone "${milestone.title}" ${status}`,
            user_id: userId
          }]);
      }

      toast({
        title: "Success",
        description: `Milestone ${status} successfully`
      });

      // Refresh dashboard data
      onSuccess?.();
    } catch (error: any) {
      console.error('Error updating milestone:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to update milestone',
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTaskUpdate = async (taskId: string, status: Task['status']) => {
    try {
      setIsProcessing(true);

      // Update task status
      const { error: updateError } = await supabase
        .from('tasks')
        .update({ 
          status,
          completed_at: status === 'completed' ? new Date().toISOString() : null
        })
        .eq('id', taskId)
        .eq('project_id', (await supabase
          .from('projects')
          .select('id')
          .eq('client_id', userId)
          .single()
        ).data?.id);

      if (updateError) {
        throw updateError;
      }

      // Add project update
      const { data: task } = await supabase
        .from('tasks')
        .select('project_id, milestone_id, title')
        .eq('id', taskId)
        .single();

      if (task) {
        await supabase
          .from('project_updates')
          .insert([{
            project_id: task.project_id,
            update_type: 'milestone_complete',
            message: `Task "${task.title}" ${status}`,
            user_id: userId,
            metadata: { milestone_id: task.milestone_id }
          }]);
      }

      toast({
        title: "Success",
        description: `Task ${status} successfully`
      });

      // Refresh dashboard data
      onSuccess?.();
    } catch (error: any) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to update task',
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    handleApplicationUpdate,
    handleMilestoneUpdate,
    handleTaskUpdate
  };
}; 