
import { useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { notificationService } from '@/services/notificationService';

export const useApplicationNotifications = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    console.log('Setting up application notifications for user:', user.id);

    // Listen for application status changes
    const channel = supabase
      .channel('application-status-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'applications',
          filter: `professional_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Application status change detected:', payload);
          
          const { new: newRecord, old: oldRecord } = payload;
          
          // Only show notification if status actually changed
          if (newRecord.status !== oldRecord.status) {
            handleApplicationStatusChange(newRecord.status, newRecord.id, newRecord.project_id);
          }
        }
      )
      .subscribe((status) => {
        console.log('Application notifications subscription status:', status);
      });

    return () => {
      console.log('Cleaning up application notifications');
      supabase.removeChannel(channel);
    };
  }, [user, toast]);

  const handleApplicationStatusChange = async (newStatus: string, applicationId: string, projectId: string) => {
    try {
      console.log('Handling application status change:', { newStatus, applicationId, projectId });
      
      // Get project details for the notification
      const { data: applicationData, error: applicationError } = await supabase
        .from('applications')
        .select(`
          id,
          project:projects(title, id)
        `)
        .eq('id', applicationId)
        .single();

      if (applicationError) {
        console.error('Error fetching application data:', applicationError);
        return;
      }

      const projectTitle = applicationData?.project?.title || 'Unknown Project';

      // Show appropriate toast notification
      switch (newStatus) {
        case 'accepted':
          toast({
            title: "🎉 Application Accepted!",
            description: `Your application for "${projectTitle}" has been accepted. You can now start working on the project.`,
            duration: 8000,
          });
          break;
        
        case 'rejected':
          toast({
            title: "Application Update",
            description: `Your application for "${projectTitle}" was not selected. Keep applying to other projects!`,
            variant: "destructive",
            duration: 6000,
          });
          break;
        
        default:
          toast({
            title: "Application Status Updated",
            description: `Your application for "${projectTitle}" status has been updated to ${newStatus}.`,
            duration: 5000,
          });
      }

      // Create persistent notification in database
      const notificationData = {
        user_id: user?.id,
        type: (newStatus === 'accepted' ? 'success' : newStatus === 'rejected' ? 'warning' : 'info') as 'info' | 'success' | 'warning' | 'error',
        title: getNotificationTitle(newStatus),
        message: `Your application for "${projectTitle}" ${getStatusMessage(newStatus)}`,
        action_url: newStatus === 'accepted' ? '/dashboard' : undefined,
        action_label: newStatus === 'accepted' ? 'View Project' : undefined
      };

      await notificationService.createNotification(notificationData);
      console.log('Notification created successfully');

    } catch (error) {
      console.error('Error handling application status change:', error);
    }
  };

  const getNotificationTitle = (status: string) => {
    switch (status) {
      case 'accepted': return 'Application Accepted!';
      case 'rejected': return 'Application Update';
      default: return 'Application Status Changed';
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'accepted': return 'has been accepted. Congratulations!';
      case 'rejected': return 'was not selected this time.';
      default: return `status has been updated to ${status}.`;
    }
  };
};
