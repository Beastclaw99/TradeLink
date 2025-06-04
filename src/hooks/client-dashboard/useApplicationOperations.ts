
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Application, Project } from '@/types';
import { useToast } from "@/components/ui/use-toast";

export const useApplicationOperations = (fetchDashboardData: () => Promise<void>) => {
  const { toast } = useToast();
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleViewApplication = (application: Application, project: Project) => {
    setSelectedApplication(application);
    setSelectedProject(project);
  };

  const handleCloseDialog = () => {
    setSelectedApplication(null);
    setSelectedProject(null);
  };

  const handleApplicationUpdate = async (
    applicationId: string,
    newStatus: string,
    projectId: string,
    professionalId: string
  ) => {
    try {
      setIsSubmitting(true);
      
      // Update application status
      const { error: applicationError } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', applicationId);
      
      if (applicationError) throw applicationError;
      
      // If application was accepted, update project status
      if (newStatus === 'accepted') {
        const { error: projectError } = await supabase
          .from('projects')
          .update({ status: 'assigned', assigned_to: professionalId })
          .eq('id', projectId);
        
        if (projectError) throw projectError;
        
        // Update other applications to rejected
        const { error: rejectError } = await supabase
          .from('applications')
          .update({ status: 'rejected' })
          .eq('project_id', projectId)
          .neq('id', applicationId);
        
        if (rejectError) throw rejectError;
      }
      
      toast({
        title: `Application ${newStatus === 'accepted' ? 'Accepted' : 'Rejected'}`,
        description: newStatus === 'accepted' 
          ? "The professional has been assigned to your project."
          : "The application has been rejected."
      });
      
      // Refresh data
      await fetchDashboardData();
      
    } catch (error: any) {
      console.error('Error updating application:', error);
      toast({
        title: "Error",
        description: "Failed to update application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAcceptApplication = async () => {
    if (!selectedApplication) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: 'accepted' })
        .eq('id', selectedApplication.id);

      if (error) throw error;

      // Update project status to in-progress
      const { error: projectError } = await supabase
        .from('projects')
        .update({ status: 'in-progress' })
        .eq('id', selectedApplication.project_id);

      if (projectError) throw projectError;

      toast({
        title: "Application Accepted",
        description: "The application has been accepted and the project status has been updated.",
      });

      handleCloseDialog();
      await fetchDashboardData();
    } catch (error) {
      console.error('Error accepting application:', error);
      toast({
        title: "Error",
        description: "Failed to accept the application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectApplication = async () => {
    if (!selectedApplication) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: 'rejected' })
        .eq('id', selectedApplication.id);

      if (error) throw error;

      toast({
        title: "Application Rejected",
        description: "The application has been rejected successfully.",
      });

      handleCloseDialog();
      await fetchDashboardData();
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast({
        title: "Error",
        description: "Failed to reject the application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    selectedApplication,
    selectedProject,
    isSubmitting,
    handleViewApplication,
    handleCloseDialog,
    handleAcceptApplication,
    handleRejectApplication,
    handleApplicationUpdate
  };
};
