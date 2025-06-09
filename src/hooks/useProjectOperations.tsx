import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/components/dashboard/types';

export const useProjectOperations = (clientId: string, onUpdate: () => void) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
            client_id: clientId,
            status: 'open',
            created_at: new Date().toISOString()
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
          updated_at: new Date().toISOString()
        })
        .eq('id', project.id)
        .eq('client_id', clientId);
      
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
        .eq('client_id', clientId);
      
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

  const createProject = async (projectData: Partial<Project>) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('projects')
        .insert({
          ...projectData,
          client_id: clientId,
          status: 'open',
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: 'Project Created',
        description: 'Your project has been created successfully.'
      });

      onUpdate();
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: 'Error',
        description: 'Failed to create project. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateProject = async (projectId: string, updates: Partial<Project>) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('projects')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId)
        .eq('client_id', clientId);

      if (error) throw error;

      toast({
        title: 'Project Updated',
        description: 'Your project has been updated successfully.'
      });

      onUpdate();
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: 'Error',
        description: 'Failed to update project. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)
        .eq('client_id', clientId);

      if (error) throw error;

      toast({
        title: 'Project Deleted',
        description: 'Your project has been deleted successfully.'
      });

      onUpdate();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete project. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    isSubmitting,
    editProject,
    projectToDelete,
    editedProject,
    newProject,
    setEditProject,
    setEditedProject,
    setNewProject,
    handleCreateProject,
    handleEditInitiate,
    handleEditCancel,
    handleUpdateProject,
    handleDeleteInitiate,
    handleDeleteCancel,
    handleDeleteProject,
    createProject,
    updateProject,
    deleteProject
  };
};
