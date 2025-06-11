import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { notificationService } from '@/services/notificationService';
import { Project } from '@/components/dashboard/types';

export const useClientActions = (userId: string, fetchDashboardData: () => void) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProjectSubmitting, setIsProjectSubmitting] = useState(false);
  const [editedProject, setEditedProject] = useState<Project | null>(null);

  const handleApplicationUpdate = async (
    applicationId: string,
    newStatus: string,
    projectId: string,
    professionalId: string
  ) => {
    try {
      setIsProcessing(true);

      // First check if project is still open
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('status, title, client_id')
        .eq('id', projectId)
        .single();

      if (projectError) throw projectError;

      if (projectData.status !== 'open') {
        toast({
          title: "Error",
          description: "This project is no longer accepting applications",
          variant: "destructive"
        });
        return;
      }

      // Update application status
      const { error: applicationError } = await supabase
        .from('applications')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', applicationId);

      if (applicationError) throw applicationError;

      // If application is accepted, update project status and assign professional
      if (newStatus === 'accepted') {
        const { error: projectUpdateError } = await supabase
          .from('projects')
          .update({
            status: 'in_progress',
            professional_id: professionalId,
            updated_at: new Date().toISOString()
          })
          .eq('id', projectId);

        if (projectUpdateError) throw projectUpdateError;

        // Create project update
        const { error: updateError } = await supabase
          .from('project_updates')
          .insert({
            project_id: projectId,
            update_type: 'status_change',
            content: 'Project assigned to professional',
            created_at: new Date().toISOString()
          });

        if (updateError) throw updateError;
      }

      // Create notification for professional
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: professionalId,
          type: newStatus === 'accepted' ? 'success' : 'info',
          title: newStatus === 'accepted' ? 'Application Accepted' : 'Application Status Updated',
          message: newStatus === 'accepted' 
            ? `Your application for "${projectData.title}" has been accepted!` 
            : `Your application for "${projectData.title}" has been ${newStatus}.`,
          action_url: `/projects/${projectId}`,
          action_label: 'View Project',
          created_at: new Date().toISOString()
        });

      if (notificationError) throw notificationError;

      toast({
        title: "Success",
        description: `Application has been ${newStatus}`,
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
      setIsProcessing(false);
    }
  };

  const handleUpdateProject = async (projectData: Project) => {
    try {
      setIsProjectSubmitting(true);

      // First check if project exists and is editable
      const { data: existingProject, error: projectError } = await supabase
        .from('projects')
        .select('status, professional_id')
        .eq('id', projectData.id)
        .single();

      if (projectError) throw projectError;

      if (!existingProject) {
        toast({
          title: "Error",
          description: "Project not found",
          variant: "destructive"
        });
        return;
      }

      if (existingProject.status === 'completed' || existingProject.status === 'cancelled') {
        toast({
          title: "Error",
          description: "Cannot edit a completed or cancelled project",
          variant: "destructive"
        });
        return;
      }

      if (existingProject.professional_id && projectData.status === 'open') {
        toast({
          title: "Error",
          description: "Cannot reopen a project that has been assigned to a professional",
          variant: "destructive"
        });
        return;
      }

      // Update project
      const { error: updateError } = await supabase
        .from('projects')
        .update({
          title: projectData.title,
          description: projectData.description,
          category: projectData.category,
          budget: projectData.budget,
          expected_timeline: projectData.expected_timeline,
          location: projectData.location,
          urgency: projectData.urgency,
          requirements: projectData.requirements,
          recommended_skills: projectData.recommended_skills,
          status: projectData.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectData.id);

      if (updateError) throw updateError;

      // Create project update
      const { error: updateHistoryError } = await supabase
        .from('project_updates')
        .insert({
          project_id: projectData.id,
          update_type: 'project_update',
          content: 'Project details updated',
          created_at: new Date().toISOString()
        });

      if (updateHistoryError) throw updateHistoryError;

      toast({
        title: "Success",
        description: "Project has been updated successfully",
      });

      // Refresh data
      await fetchDashboardData();
      setEditedProject(null);
    } catch (error: any) {
      console.error('Error updating project:', error);
      toast({
        title: "Error",
        description: "Failed to update project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProjectSubmitting(false);
    }
  };

  return {
    isProcessing,
    handleApplicationUpdate,
    handleUpdateProject
  };
}; 