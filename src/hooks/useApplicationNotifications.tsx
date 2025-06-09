
import { useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';

export const useApplicationNotifications = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

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
            handleApplicationStatusChange(newRecord.status, newRecord.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast]);

  const handleApplicationStatusChange = async (newStatus: string, applicationId: string) => {
    try {
      // Get project details for the notification
      const { data: applicationData } = await supabase
        .from('applications')
        .select(`
          id,
          project:projects(title)
        `)
        .eq('id', applicationId)
        .single();

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
      await supabase
        .from('notifications')
        .insert({
          user_id: user?.id,
          type: newStatus === 'accepted' ? 'success' : newStatus === 'rejected' ? 'warning' : 'info',
          title: getNotificationTitle(newStatus),
          message: `Your application for "${projectTitle}" ${getStatusMessage(newStatus)}`,
          action_url: newStatus === 'accepted' ? '/dashboard' : undefined,
          action_label: newStatus === 'accepted' ? 'View Project' : undefined
        });

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
