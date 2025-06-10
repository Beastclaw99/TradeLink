import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Project } from '@/components/dashboard/types';
import { Milestone, convertMilestoneToDBMilestone } from '@/components/project/creation/types';
import { transformProjects } from './dashboard/dataTransformers';

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
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const fetchProjectDetails = async (projectId: string): Promise<Project> => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          professional:profiles!projects_assigned_to_fkey(
            id,
            first_name,
            last_name,
            rating,
            profile_image
          ),
          milestones:project_milestones(
            id,
            title,
            description,
            due_date,
            status,
            tasks:project_tasks(
              id,
              title,
              description,
              status,
              completed
            )
          ),
          deliverables:project_deliverables(
            id,
            title,
            description,
            status,
            file_url,
            submitted_at,
            approved_at
          )
        `)
        .eq('id', projectId)
        .single();

      if (error) {
        console.error('Error fetching project details:', error);
        throw new Error('Failed to fetch project details');
      }

      if (!data) {
        throw new Error('Project not found');
      }

      // Transform the project data
      const transformedProjects = transformProjects([data]);
      if (!transformedProjects.length) {
        throw new Error('Failed to transform project data');
      }

      return transformedProjects[0];
    } catch (error: any) {
      console.error('Error in fetchProjectDetails:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to fetch project details',
        variant: "destructive"
      });
      throw error;
    }
  };

  const handleAddMilestone = async (projectId: string, milestone: Omit<Milestone, 'id'>) => {
    try {
      const dbMilestone = convertMilestoneToDBMilestone(milestone as Milestone, projectId);
      const { data, error } = await supabase
        .from('project_milestones')
        .insert([dbMilestone])
        .select()
        .single();

      if (error) throw error;

      // Create deliverables for the milestone
      if (milestone.deliverables.length > 0) {
        const { error: deliverablesError } = await supabase
          .from('project_deliverables')
          .insert(
            milestone.deliverables.map(deliverable => ({
              description: deliverable.description,
              deliverable_type: deliverable.deliverable_type,
              content: deliverable.content || null,
              file_url: deliverable.deliverable_type === 'file' ? deliverable.content || '' : '',
              milestone_id: data.id,
              project_id: projectId,
              uploaded_by: userId
            }))
          );

        if (deliverablesError) throw deliverablesError;
      }

      toast({
        title: "Success",
        description: "Milestone added successfully."
      });

      // Refresh project data
      const updatedProject = await fetchProjectDetails(projectId);
      setSelectedProject(updatedProject);
      onUpdate();
    } catch (error) {
      console.error('Error adding milestone:', error);
      toast({
        title: "Error",
        description: "Failed to add milestone.",
        variant: "destructive"
      });
    }
  };

  const handleEditMilestone = async (projectId: string, milestoneId: string, updates: Partial<Milestone>) => {
    try {
      setIsSubmitting(true);

      const dbUpdates = convertMilestoneToDBMilestone(updates as Milestone, projectId);
      const { error } = await supabase
        .from('project_milestones')
        .update(dbUpdates)
        .eq('id', milestoneId);

      if (error) throw error;

      // Update deliverables if they were changed
      if (updates.deliverables) {
        // First delete existing deliverables
        const { error: deleteError } = await supabase
          .from('project_deliverables')
          .delete()
          .eq('milestone_id', milestoneId);

        if (deleteError) throw deleteError;

        // Then insert new deliverables
        if (updates.deliverables.length > 0) {
          const { error: deliverablesError } = await supabase
            .from('project_deliverables')
            .insert(
              updates.deliverables.map(deliverable => ({
                description: deliverable.description,
                deliverable_type: deliverable.deliverable_type,
                content: deliverable.content || null,
                file_url: deliverable.deliverable_type === 'file' ? deliverable.content || '' : '',
                milestone_id: milestoneId,
                project_id: projectId,
                uploaded_by: userId
              }))
            );

          if (deliverablesError) throw deliverablesError;
        }
      }

      toast({
        title: "Success",
        description: "Milestone updated successfully."
      });

      // Refresh project data
      const updatedProject = await fetchProjectDetails(projectId);
      setSelectedProject(updatedProject);
      onUpdate();
    } catch (error) {
      console.error('Error updating milestone:', error);
      toast({
        title: "Error",
        description: "Failed to update milestone.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMilestone = async (projectId: string, milestoneId: string) => {
    try {
      setIsSubmitting(true);

      // First delete associated deliverables
      const { error: deliverablesError } = await supabase
        .from('project_deliverables')
        .delete()
        .eq('milestone_id', milestoneId);

      if (deliverablesError) throw deliverablesError;

      // Then delete the milestone
      const { error } = await supabase
        .from('project_milestones')
        .delete()
        .eq('id', milestoneId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Milestone deleted successfully."
      });

      // Refresh project data
      const updatedProject = await fetchProjectDetails(projectId);
      setSelectedProject(updatedProject);
      onUpdate();
    } catch (error) {
      console.error('Error deleting milestone:', error);
      toast({
        title: "Error",
        description: "Failed to delete milestone.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
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
    handleDeleteProject,
    selectedProject,
    setSelectedProject,
    handleAddMilestone,
    handleEditMilestone,
    handleDeleteMilestone,
    fetchProjectDetails
  };
};
