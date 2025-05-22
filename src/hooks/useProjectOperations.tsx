
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Project } from '@/components/dashboard/types';

export const useProjectOperations = (userId: string, onUpdate: () => void) => {
  const { toast } = useToast();
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [editedProject, setEditedProject] = useState({
    title: '',
    description: '',
    budget: ''
  });
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    budget: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      
      const { data, error } = await supabase
        .from('projects')
        .insert([
          {
            title: newProject.title,
            description: newProject.description,
            budget: parseFloat(newProject.budget),
            client_id: userId,
            status: 'open'
          }
        ])
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Project Created",
        description: "Your new project has been created successfully!"
      });
      
      // Reset form fields
      setNewProject({
        title: '',
        description: '',
        budget: ''
      });
      
      // Refresh projects data
      onUpdate();
      
    } catch (error: any) {
      console.error('Error creating project:', error);
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
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
    setEditedProject({
      title: '',
      description: '',
      budget: ''
    });
  };
  
  const handleUpdateProject = async (project: Project) => {
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('projects')
        .update({
          title: editedProject.title,
          description: editedProject.description,
          budget: parseFloat(editedProject.budget),
        })
        .eq('id', project.id)
        .eq('client_id', userId);
      
      if (error) throw error;
      
      toast({
        title: "Project Updated",
        description: "Your project has been updated successfully!"
      });
      
      // Refresh projects data
      onUpdate();
      
      // Reset edit state
      setEditProject(null);
      setEditedProject({
        title: '',
        description: '',
        budget: ''
      });
      
    } catch (error: any) {
      console.error('Error updating project:', error);
      toast({
        title: "Error",
        description: "Failed to update project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
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
      setIsSubmitting(true);
      
      // First check if the project has any applications
      const { data: apps, error: appsError } = await supabase
        .from('applications')
        .select('id')
        .eq('project_id', projectId);
      
      if (appsError) throw appsError;
      
      // If there are applications, delete them first
      if (apps && apps.length > 0) {
        const { error: deleteAppsError } = await supabase
          .from('applications')
          .delete()
          .eq('project_id', projectId);
        
        if (deleteAppsError) throw deleteAppsError;
      }
      
      // Now delete the project
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)
        .eq('client_id', userId);
      
      if (error) throw error;
      
      toast({
        title: "Project Deleted",
        description: "Your project has been deleted successfully!"
      });
      
      // Refresh projects data
      onUpdate();
      
      // Reset delete state
      setProjectToDelete(null);
      
    } catch (error: any) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    editProject,
    projectToDelete,
    editedProject,
    newProject,
    isSubmitting,
    setEditedProject,
    setNewProject,
    handleCreateProject,
    handleEditInitiate,
    handleEditCancel,
    handleUpdateProject,
    handleDeleteInitiate,
    handleDeleteCancel,
    handleDeleteProject
  };
};
