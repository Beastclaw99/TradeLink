
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Project, Application, Payment, Review, ApplicationProject } from '../components/dashboard/types';

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
        .in('status', ['assigned', 'in_progress', 'completed']);
        
      if (assignedProjectsError) {
        console.error('Assigned projects fetch error:', assignedProjectsError);
        throw assignedProjectsError;
      }
      
      console.log('Assigned projects data:', assignedProjectsData);
      
      // Combine open projects with assigned projects
      const allProjects = [...filteredProjects, ...(assignedProjectsData || [])];
      setProjects(allProjects);
      
      // Fetch applications made by the professional with better error handling and logging
      try {
        const { data: appsData, error: appsError } = await supabase
          .from('applications')
          .select(`
            id,
            created_at,
            status,
            bid_amount,
            cover_letter,
            professional_id,
            project_id,
            availability,
            proposal_message,
            updated_at,
            project:projects (
              id,
              title,
              status,
              budget,
              created_at
            )
          `)
          .eq('professional_id', userId)
          .order('created_at', { ascending: false });
        
        if (appsError) {
          console.error('Applications fetch error:', appsError);
          throw appsError;
        }
        console.log('Applications data:', appsData);
        
        // Transform the data to match the Application type
        const transformedApps: Application[] = (appsData || []).map(app => ({
          id: app.id,
          project_id: app.project_id,
          professional_id: app.professional_id,
          cover_letter: app.cover_letter,
          proposal_message: app.proposal_message || app.cover_letter || '',
          bid_amount: app.bid_amount,
          availability: app.availability,
          status: app.status,
          created_at: app.created_at,
          updated_at: app.updated_at || app.created_at,
          project: app.project ? {
            id: app.project.id,
            title: app.project.title,
            status: app.project.status,
            budget: app.project.budget,
            created_at: app.project.created_at
          } as ApplicationProject : undefined
        }));
        
        setApplications(transformedApps);
      } catch (error: any) {
        console.error('Error fetching applications:', error);
        // Don't throw here, continue with other data fetching
        toast({
          title: "Warning",
          description: "There was an issue loading your applications. Some data may be missing.",
          variant: "destructive"
        });
      }
      
      // Fetch payments for the professional
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select(`
          *,
          project:projects(title)
        `)
        .eq('professional_id', userId);
      
      if (paymentsError) {
        console.error('Payments fetch error:', paymentsError);
        throw paymentsError;
      }
      
      console.log('Payments data:', paymentsData);
      
      // Transform payments to include missing fields and ensure each payment has a created_at field
      const paymentsWithRequiredFields: Payment[] = (paymentsData || []).map(payment => ({
        id: payment.id,
        amount: payment.amount,
        status: payment.status,
        payment_method: payment.payment_method || null,
        transaction_id: payment.transaction_id || null,
        created_at: payment.created_at || new Date().toISOString(),
        paid_at: payment.paid_at,
        client_id: payment.client_id,
        professional_id: payment.professional_id,
        project_id: payment.project_id,
        project: payment.project
      }));
      
      setPayments(paymentsWithRequiredFields);
      
      // Fetch reviews for the professional
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('*')
        .eq('professional_id', userId);
      
      if (reviewsError) {
        console.error('Reviews fetch error:', reviewsError);
        throw reviewsError;
      }
      
      console.log('Reviews data:', reviewsData);
      
      // Transform reviews to match the Review type
      const transformedReviews: Review[] = (reviewsData || []).map(review => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        client_id: review.client_id,
        professional_id: review.professional_id,
        project_id: review.project_id,
        created_at: review.created_at,
        updated_at: review['updated at'] || review.created_at // Handle the space in column name
      }));
      
      setReviews(transformedReviews);
      
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
    markProjectComplete,
    calculateAverageRating,
    calculatePaymentTotals,
  };
};
