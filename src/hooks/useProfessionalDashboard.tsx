import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Project, Application, Payment, Review } from '@/types';

export const useProfessionalDashboard = (userId: string) => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [editedProject, setEditedProject] = useState<Partial<Project> | null>(null);
  const [isProjectSubmitting, setIsProjectSubmitting] = useState(false);
  const [projectToReview, setProjectToReview] = useState<string | null>(null);
  const [reviewData, setReviewData] = useState<Partial<Review> | null>(null);
  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching professional dashboard data for user:', userId);
      
      // First get the professional's profile to get their skills
      const { data: userProfileData, error: userProfileError } = await supabase
        .from('profiles')
        .select('skills, first_name, last_name, created_at')
        .eq('id', userId)
        .single();
      
      if (userProfileError) {
        console.error('Profile fetch error:', userProfileError);
        throw userProfileError;
      }
      
      console.log('Profile data:', userProfileData);
      
      // Set skills array or default to empty array
      const userSkills = userProfileData?.skills || [];
      setSkills(userSkills);
      setProfile(userProfileData);
      
      // Fetch projects that match skills (if skills are available) and are open
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select(`
          *,
          client:profiles!projects_client_id_fkey(first_name, last_name)
        `)
        .eq('status', 'open');
      
      if (projectsError) {
        console.error('Projects fetch error:', projectsError);
        throw projectsError;
      }
      
      console.log('Projects data:', projectsData);
      
      // Filter projects by skills if skills are available
      let filteredProjects = projectsData || [];
      if (userSkills.length > 0) {
        // Add null checks and safe type handling
        filteredProjects = projectsData.filter((project: any) => {
          if (!project) return false;
          
          const projTags = project.tags || [];
          const projectTitle = project.title || '';
          const projectDescription = project.description || '';
          
          return userSkills.some((skill: string) => {
            if (!skill) return false;
            
            const skillLower = skill.toLowerCase();
            return (
              projTags.includes(skill) || 
              projectTitle.toLowerCase().includes(skillLower) ||
              projectDescription.toLowerCase().includes(skillLower)
            );
          });
        });
      }
      
      // Fetch assigned projects (status = "assigned", "in_progress", "completed" and assigned_to = userId)
      const { data: assignedProjectsData, error: assignedProjectsError } = await supabase
        .from('projects')
        .select(`
          *,
          client:profiles!projects_client_id_fkey(first_name, last_name)
        `)
        .eq('assigned_to', userId)
        .in('status', ['assigned', 'in-progress', 'completed']);
        
      if (assignedProjectsError) {
        console.error('Assigned projects fetch error:', assignedProjectsError);
        throw assignedProjectsError;
      }
      
      console.log('Assigned projects data:', assignedProjectsData);
      
      // Transform and combine open projects with assigned projects
      const validStatuses = ['open', 'applied', 'assigned', 'in-progress', 'submitted', 'revision', 'completed', 'paid', 'archived', 'disputed'] as const;
      
      const transformProjects = (projects: any[]): Project[] => {
        return projects.map(project => ({
          ...project,
          status: validStatuses.includes(project.status) ? project.status : 'open',
          updated_at: project.updated_at || project.created_at
        }));
      };
      
      const allProjects = [...transformProjects(filteredProjects), ...transformProjects(assignedProjectsData || [])];
      setProjects(allProjects);
      
      // Fetch applications made by the professional with better error handling and logging
      fetchApplications();
      
      // Fetch payments for the professional
      fetchPayments();
      
      // Fetch reviews for the professional
      fetchReviews();
      
    } catch (error: any) {
      console.error('Dashboard data fetch error:', error);
      setError(error.message || 'Failed to load dashboard data');
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchApplications = useCallback(async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          project:projects(*)
        `)
        .eq('professional_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedApplications = (data || [])
        .filter(app => app.project_id && app.status && app.professional_id)
        .map(app => ({
          ...app,
          project_id: app.project_id!,
          professional_id: app.professional_id!,
          status: (app.status as Application['status']) || 'pending',
          created_at: app.created_at || new Date().toISOString(),
          updated_at: app.updated_at || new Date().toISOString()
        }));

      setApplications(transformedApplications);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setError('Failed to fetch applications');
    }
  }, [userId]);

  const fetchPayments = useCallback(async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          project:projects(title)
        `)
        .eq('professional_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedPayments = (data || [])
        .filter(payment => payment.status && payment.project_id && payment.professional_id)
        .map(payment => ({
          ...payment,
          project_id: payment.project_id!,
          professional_id: payment.professional_id!,
          client_id: payment.client_id!,
          status: (payment.status as Payment['status']) || 'pending',
          created_at: payment.created_at || new Date().toISOString(),
          paid_at: payment.paid_at
        }));

      setPayments(transformedPayments);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setError('Failed to fetch payments');
    }
  }, [userId]);

  const fetchReviews = useCallback(async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('professional_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedReviews = (data || [])
        .filter(review => review.project_id && review.professional_id && review.client_id)
        .map(review => ({
          ...review,
          project_id: review.project_id!,
          professional_id: review.professional_id!,
          client_id: review.client_id!,
          updated_at: review['updated at'] || review.created_at || new Date().toISOString()
        }));

      setReviews(transformedReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to fetch reviews');
    }
  }, [userId]);

  // Mark project as complete function
  const markProjectComplete = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: 'completed' })
        .eq('id', projectId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Project marked as completed successfully!"
      });

      // Refresh the data
      fetchDashboardData();
    } catch (error: any) {
      console.error('Error marking project complete:', error);
      toast({
        title: "Error",
        description: "Failed to mark project as completed",
        variant: "destructive"
      });
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();
  }, [userId]);

  // Utility functions
  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    return (total / reviews.length).toFixed(1);
  };

  const calculatePaymentTotals = () => {
    const received = payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);
    
    const pending = payments
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0);
    
    return { received, pending };
  };

  const handleEditInitiate = (project: Project) => {
    setEditProject(project);
    setEditedProject({
      title: project.title,
      description: project.description,
      budget: project.budget
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
        .eq('id', projectId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Project updated successfully!"
      });

      handleEditCancel();
      fetchDashboardData();
    } catch (error: any) {
      console.error('Error updating project:', error);
      toast({
        title: "Error",
        description: "Failed to update project",
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
        .eq('id', projectId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Project deleted successfully!"
      });

      handleDeleteCancel();
      fetchDashboardData();
    } catch (error: any) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive"
      });
    } finally {
      setIsProjectSubmitting(false);
    }
  };

  const handleReviewInitiate = (projectId: string) => {
    setProjectToReview(projectId);
    setReviewData({
      project_id: projectId,
      professional_id: userId,
      rating: 0,
      comment: ''
    });
  };

  const handleReviewCancel = () => {
    setProjectToReview(null);
    setReviewData(null);
  };

  const handleReviewSubmit = async (review: Partial<Review>) => {
    try {
      setIsReviewSubmitting(true);
      const { error } = await supabase
        .from('reviews')
        .insert([review]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Review submitted successfully!"
      });

      handleReviewCancel();
      fetchDashboardData();
    } catch (error: any) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive"
      });
    } finally {
      setIsReviewSubmitting(false);
    }
  };

  const handleApplicationUpdate = async (applicationId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Application status updated successfully!"
      });

      fetchDashboardData();
    } catch (error: any) {
      console.error('Error updating application:', error);
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive"
      });
    }
  };

  return {
    projects,
    applications,
    payments,
    reviews,
    skills,
    profile,
    isLoading,
    error,
    fetchDashboardData,
    calculateAverageRating,
    calculatePaymentTotals,
    editProject,
    projectToDelete,
    editedProject,
    isProjectSubmitting,
    handleEditInitiate,
    handleEditCancel,
    handleUpdateProject,
    handleDeleteInitiate,
    handleDeleteCancel,
    handleDeleteProject,
    projectToReview,
    reviewData,
    isReviewSubmitting,
    handleReviewInitiate,
    handleReviewCancel,
    handleReviewSubmit,
    handleApplicationUpdate,
    markProjectComplete
  };
};
