import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Database } from '@/integrations/supabase/types';

type Application = Database['public']['Tables']['applications']['Row'];
type Milestone = Database['public']['Tables']['project_milestones']['Row'];
type Task = Database['public']['Tables']['project_tasks']['Row'];

export const useClientActions = (userId: string, onSuccess?: () => void) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleApplicationUpdate = async (applicationId: string, status: Application['status']) => {
    try {
      setIsProcessing(true);

      // Get the application details first
      const { data: application, error: fetchError } = await supabase
        .from('applications')
        .select('project_id, professional_id')
        .eq('id', applicationId)
        .single();

      if (fetchError) throw fetchError;
      if (!application) throw new Error('Application not found');

      // Verify the project belongs to the client
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('id')
        .eq('id', application.project_id)
        .eq('client_id', userId)
        .single();

      if (projectError) throw projectError;
      if (!project) throw new Error('Project not found or unauthorized');

      // Update application status
      const { error: updateError } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', applicationId);

      if (updateError) throw updateError;

      // Add project update
      const { data: professional } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', application.professional_id)
        .single();

      if (professional) {
        await supabase
          .from('project_updates')
          .insert([{
            project_id: application.project_id,
            update_type: 'application_updated',
            message: `Application ${status} for ${professional.first_name} ${professional.last_name}`,
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
        .from('project_milestones')
        .update({ 
          status,
          is_complete: status === 'completed'
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
        .from('project_milestones')
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
        .from('project_tasks')
        .update({ 
          status,
          completed: status === 'completed',
          completion_date: status === 'completed' ? new Date().toISOString() : null
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
        .from('project_tasks')
        .select('project_id, milestone_id, title')
        .eq('id', taskId)
        .single();

      if (task) {
        await supabase
          .from('project_updates')
          .insert([{
            project_id: task.project_id,
            update_type: 'task_complete',
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