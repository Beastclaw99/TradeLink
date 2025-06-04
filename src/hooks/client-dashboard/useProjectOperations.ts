
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import { Project } from '@/components/dashboard/types';

export const useProjectOperations = (userId: string, fetchDashboardData: () => Promise<void>) => {
  const { toast } = useToast();
  
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [editedProject, setEditedProject] = useState<{
    title: string;
    description: string;
    budget: string;
  } | null>(null);
  const [isProjectSubmitting, setIsProjectSubmitting] = useState(false);

  const handleEditInitiate = (project: Project) => {
    setEditProject(project);
    setEditedProject({
      title: project.title,
      description: project.description || '',
      budget: project.budget?.toString() || ''
    });
  };

  const handleEditCancel = () => {
    setEditProject(null);
    setEditedProject(null);
  };

  const handleUpdateProject = async (projectId: string, updates: Partial<Project>) => {
    try {
      setIsProjectSubmitting(true);

      const { error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', projectId)
        .eq('client_id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Project updated successfully"
      });

      setEditProject(null);
      setEditedProject(null);
      await fetchDashboardData();

    } catch (err: any) {
      console.error('Error updating project:', err);
      toast({
        title: "Error",
        description: "Failed to update project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProjectSubmitting(false);
    }
  };

  const handleDeleteInitiate = (projectId: string) => {
    setProjectToDelete(projectId);
  };

  const handleDeleteCancel = () => {
    setProjectToDelete(null);
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      setIsProjectSubmitting(true);

      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)
        .eq('client_id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Project deleted successfully"
      });

      setProjectToDelete(null);
      await fetchDashboardData();

    } catch (err: any) {
      console.error('Error deleting project:', err);
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProjectSubmitting(false);
    }
  };

  return {
    editProject,
    projectToDelete,
    editedProject,
    isProjectSubmitting,
    handleEditInitiate,
    handleEditCancel,
    handleUpdateProject,
    handleDeleteInitiate,
    handleDeleteCancel,
    handleDeleteProject
  };
};
