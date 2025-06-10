import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { notificationService } from '@/services/notificationService';

export const useClientActions = (userId: string, fetchDashboardData: () => Promise<void>) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApplicationUpdate = async (
    applicationId: string,
    newStatus: string,
    projectId: string,
    professionalId: string
  ) => {
    try {
      setIsProcessing(true);

      // Update application status
      const { error: updateError } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', applicationId);

      if (updateError) throw updateError;

      // If accepting the application, update project status and assigned professional
      if (newStatus === 'accepted') {
        const { error: projectError } = await supabase
          .from('projects')
          .update({
            status: 'in_progress',
            assigned_to: professionalId
          })
          .eq('id', projectId);

        if (projectError) throw projectError;

        // Create notification for professional
        await notificationService.createNotification({
          user_id: professionalId,
          type: 'success',
          title: 'Application Accepted',
          message: 'Your application has been accepted! The project is now in progress.',
          action_url: `/projects/${projectId}`,
          action_label: 'View Project'
        });
      } else if (newStatus === 'rejected') {
        // Create notification for professional
        await notificationService.createNotification({
          user_id: professionalId,
          type: 'info',
          title: 'Application Status Update',
          message: 'Your application has been rejected.',
          action_url: `/projects/${projectId}`,
          action_label: 'View Project'
        });
      }

      toast({
        title: "Success",
        description: `Application ${newStatus} successfully.`
      });

      // Refresh dashboard data
      await fetchDashboardData();

    } catch (error: any) {
      console.error('Error updating application:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to update application status',
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    handleApplicationUpdate
  };
}; 