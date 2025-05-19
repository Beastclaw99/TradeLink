
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Project, Application, Review } from './types';
import { ProfileData } from '@/components/profile/types';
import ProjectsTab from './client/ProjectsTab';
import ApplicationsTab from './client/ApplicationsTab';
import CreateProjectTab from './client/CreateProjectTab';
import PaymentsTab from './client/PaymentsTab';
import ProfileTab from './client/ProfileTab';

interface ClientDashboardProps {
  userId: string;
  initialTab?: string;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ userId, initialTab }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [projectToReview, setProjectToReview] = useState<Project | null>(null);
  const [reviewData, setReviewData] = useState({ rating: 0, comment: '' });
  
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    budget: ''
  });
  
  const [editedProject, setEditedProject] = useState({
    title: '',
    description: '',
    budget: ''
  });

  useEffect(() => {
    fetchProjects();
    fetchProfileData();
  }, [userId]);

  const fetchProfileData = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      setProfileData(data);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      
      // Fetch projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('client_id', userId)
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;
      setProjects(projectsData || []);
      
      // Fetch applications for all projects
      if (projectsData && projectsData.length > 0) {
        const projectIds = projectsData.map(project => project.id);
        
        const { data: applicationsData, error: applicationsError } = await supabase
          .from('applications')
          .select(`
            *,
            professional:profiles(first_name, last_name)
          `)
          .in('project_id', projectIds);
          
        if (applicationsError) throw applicationsError;
        setApplications(applicationsData || []);
        
        // Fetch reviews for completed projects
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('*')
          .in('project_id', projectIds);
          
        if (reviewsError) throw reviewsError;
        setReviews(reviewsData || []);
      }
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load your projects. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newProject.title || !newProject.description || !newProject.budget) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const { data, error } = await supabase
        .from('projects')
        .insert({
          title: newProject.title,
          description: newProject.description,
          budget: parseFloat(newProject.budget),
          status: 'open',
          client_id: userId
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Project Created",
        description: "Your new project has been posted successfully!"
      });
      
      // Reset form
      setNewProject({
        title: '',
        description: '',
        budget: ''
      });
      
      // Refresh projects list
      fetchProjects();
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
    // Only allow editing if project is still open
    if (project.status !== 'open') {
      toast({
        title: "Cannot Edit",
        description: "Projects that are assigned or completed cannot be edited.",
        variant: "destructive"
      });
      return;
    }
    
    setEditProject(project);
    setEditedProject({
      title: project.title,
      description: project.description || '',
      budget: project.budget ? project.budget.toString() : ''
    });
  };
  
  const handleEditCancel = () => {
    setEditProject(null);
  };
  
  const handleUpdateProject = async (project: Project) => {
    if (!editedProject.title || !editedProject.description || !editedProject.budget) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    // Double check that project is still in 'open' status
    if (project.status !== 'open') {
      toast({
        title: "Cannot Edit",
        description: "This project has changed status and can no longer be edited.",
        variant: "destructive"
      });
      setEditProject(null);
      return;
    }
    
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
        .eq('status', 'open');
      
      if (error) throw error;
      
      toast({
        title: "Project Updated",
        description: "Your project has been updated successfully!"
      });
      
      setEditProject(null);
      fetchProjects();
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
    // Check if project can be deleted
    const project = projects.find(p => p.id === projectId);
    if (project && project.status !== 'open') {
      toast({
        title: "Cannot Delete",
        description: "Projects that are assigned or completed cannot be deleted.",
        variant: "destructive"
      });
      return;
    }
    
    setProjectToDelete(projectId);
  };
  
  const handleDeleteCancel = () => {
    setProjectToDelete(null);
  };
  
  const handleDeleteProject = async (projectId: string) => {
    try {
      setIsSubmitting(true);
      
      // Double-check that project is still in 'open' status
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('status')
        .eq('id', projectId)
        .single();
        
      if (projectError) throw projectError;
      
      if (projectData.status !== 'open') {
        toast({
          title: "Cannot Delete",
          description: "This project has changed status and can no longer be deleted.",
          variant: "destructive"
        });
        setProjectToDelete(null);
        return;
      }
      
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)
        .eq('status', 'open');
      
      if (error) throw error;
      
      toast({
        title: "Project Deleted",
        description: "Your project has been deleted successfully!"
      });
      
      setProjectToDelete(null);
      fetchProjects();
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

  const handleApplicationUpdate = async (applicationId: string, newStatus: string, projectId: string, professionalId: string) => {
    try {
      // First, update the application status
      const { error: appUpdateError } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', applicationId);
      
      if (appUpdateError) throw appUpdateError;
      
      // If accepting, also update project status and assigned_to
      if (newStatus === 'accepted') {
        const { error: projectUpdateError } = await supabase
          .from('projects')
          .update({ 
            status: 'assigned',
            assigned_to: professionalId
          })
          .eq('id', projectId);
        
        if (projectUpdateError) throw projectUpdateError;
        
        // Reject all other applications for this project
        const { error: rejectError } = await supabase
          .from('applications')
          .update({ status: 'rejected' })
          .eq('project_id', projectId)
          .neq('id', applicationId);
          
        if (rejectError) throw rejectError;
      }
      
      toast({
        title: "Application Updated",
        description: newStatus === 'accepted' 
          ? "Professional has been assigned to this project." 
          : "Application has been rejected."
      });
      
      // Refresh data
      fetchProjects();
    } catch (error: any) {
      console.error('Error updating application:', error);
      toast({
        title: "Error",
        description: "Failed to update application status.",
        variant: "destructive"
      });
    }
  };

  const markProjectAsPaid = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: 'paid' })
        .eq('id', projectId);
      
      if (error) throw error;
      
      toast({
        title: "Payment Recorded",
        description: "The project has been marked as paid"
      });
      
      // Refresh data
      fetchProjects();
    } catch (error: any) {
      console.error('Error marking project as paid:', error);
      toast({
        title: "Error",
        description: "Failed to update payment status.",
        variant: "destructive"
      });
    }
  };
  
  const handleReviewInitiate = (project: Project) => {
    // Check if project is completed and doesn't have a review yet
    if (project.status !== 'completed') {
      toast({
        title: "Cannot Review Yet",
        description: "You can only review completed projects.",
        variant: "destructive"
      });
      return;
    }
    
    // Check if review already exists
    const existingReview = reviews.find(r => r.project_id === project.id);
    if (existingReview) {
      toast({
        title: "Review Exists",
        description: "You have already submitted a review for this project.",
        variant: "destructive"
      });
      return;
    }
    
    setProjectToReview(project);
    setReviewData({ rating: 0, comment: '' });
  };
  
  const handleReviewCancel = () => {
    setProjectToReview(null);
  };
  
  const handleReviewSubmit = async () => {
    if (!projectToReview || reviewData.rating === 0) {
      toast({
        title: "Missing Information",
        description: "Please provide a rating before submitting.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Get the professional_id for the project
      const { data: applicationData, error: applicationError } = await supabase
        .from('applications')
        .select('professional_id')
        .eq('project_id', projectToReview.id)
        .eq('status', 'accepted')
        .single();
        
      if (applicationError) throw applicationError;
      
      const professional_id = applicationData.professional_id;
      
      // Create the review
      const { error: reviewError } = await supabase
        .from('reviews')
        .insert({
          project_id: projectToReview.id,
          client_id: userId,
          professional_id: professional_id,
          rating: reviewData.rating,
          comment: reviewData.comment,
        });
        
      if (reviewError) throw reviewError;
      
      // Update project status to indicate it's been reviewed
      const { error: projectError } = await supabase
        .from('projects')
        .update({ status: 'archived' })
        .eq('id', projectToReview.id);
        
      if (projectError) throw projectError;
      
      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback!"
      });
      
      setProjectToReview(null);
      fetchProjects();
    } catch (error: any) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Shared props for all tabs
  const sharedProps = {
    isLoading,
    projects,
    applications,
    reviews,
    profileData,
    userId,
    navigate,
    handleApplicationUpdate,
    handleDeleteInitiate,
    handleDeleteCancel,
    handleDeleteProject,
    handleEditInitiate,
    handleEditCancel,
    handleUpdateProject,
    editProject,
    projectToDelete,
    editedProject,
    setEditedProject,
    isSubmitting,
    handleReviewInitiate,
    handleReviewCancel,
    handleReviewSubmit,
    projectToReview,
    reviewData,
    setReviewData,
    markProjectAsPaid,
    newProject,
    setNewProject,
    handleCreateProject
  };

  return (
    <Tabs defaultValue={initialTab || "projects"}>
      <TabsList className="mb-6">
        <TabsTrigger value="projects">Your Projects</TabsTrigger>
        <TabsTrigger value="create">Create Project</TabsTrigger>
        <TabsTrigger value="applications">Applications</TabsTrigger>
        <TabsTrigger value="payments">Payments</TabsTrigger>
        <TabsTrigger value="profile">Profile</TabsTrigger>
      </TabsList>
      
      <TabsContent value="projects">
        <ProjectsTab {...sharedProps} />
      </TabsContent>
      
      <TabsContent value="create">
        <CreateProjectTab {...sharedProps} />
      </TabsContent>
      
      <TabsContent value="applications">
        <ApplicationsTab {...sharedProps} />
      </TabsContent>
      
      <TabsContent value="payments">
        <PaymentsTab {...sharedProps} />
      </TabsContent>
      
      <TabsContent value="profile">
        <ProfileTab {...sharedProps} />
      </TabsContent>
    </Tabs>
  );
};

export default ClientDashboard;
