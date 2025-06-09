import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Project } from '@/types/project';

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
            status: 'open',
            payment_required: true,
            payment_status: 'pending'
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

  const handleEditProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProject) return;

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
        .eq('id', editProject.id);
      
      if (error) throw error;
      
      toast({
        title: "Project Updated",
        description: "Your project has been updated successfully!"
      });
      
      // Reset form and state
      setEditedProject({
        title: '',
        description: '',
        budget: ''
      });
      setEditProject(null);
      
      // Refresh projects data
      onUpdate();
      
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

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;

    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('projects')
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', projectToDelete);
      
      if (error) throw error;
      
      toast({
        title: "Project Cancelled",
        description: "Your project has been cancelled successfully!"
      });
      
      // Reset state
      setProjectToDelete(null);
      
      // Refresh projects data
      onUpdate();
      
    } catch (error: any) {
      console.error('Error cancelling project:', error);
      toast({
        title: "Error",
        description: "Failed to cancel project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    editProject,
    setEditProject,
    projectToDelete,
    setProjectToDelete,
    editedProject,
    setEditedProject,
    newProject,
    setNewProject,
    isSubmitting,
    handleCreateProject,
    handleEditProject,
    handleDeleteProject
  };
};
