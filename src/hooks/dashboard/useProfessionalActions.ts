import { useToast } from '@/hooks/useToast';
import { supabase } from '@/integrations/supabase/client';

export const useProfessionalActions = (professionalId: string, fetchDashboardData: () => void) => {
  const { toast } = useToast();

  const markProjectComplete = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: 'completed' })
        .eq('id', projectId)
        .eq('assigned_to', professionalId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Project marked as completed',
      });

      fetchDashboardData();
    } catch (error) {
      console.error('Error marking project as complete:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark project as complete',
        variant: 'destructive',
      });
    }
  };

  const updateProjectStatus = async (projectId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status })
        .eq('id', projectId)
        .eq('assigned_to', professionalId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Project status updated successfully',
      });

      fetchDashboardData();
    } catch (error) {
      console.error('Error updating project status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update project status',
        variant: 'destructive',
      });
    }
  };

  const withdrawApplication = async (applicationId: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: 'withdrawn' })
        .eq('id', applicationId)
        .eq('professional_id', professionalId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Application withdrawn successfully',
      });

      fetchDashboardData();
    } catch (error) {
      console.error('Error withdrawing application:', error);
      toast({
        title: 'Error',
        description: 'Failed to withdraw application',
        variant: 'destructive',
      });
    }
  };

  return {
    markProjectComplete,
    updateProjectStatus,
    withdrawApplication,
  };
};
