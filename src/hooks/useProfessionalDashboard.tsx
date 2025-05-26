import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Project, Application, Payment, Review } from '../components/dashboard/types';

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
      
      setProjects(filteredProjects);
      
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
            project:projects (
              id,
              title,
              status,
              budget
            )
          `)
          .eq('professional_id', userId)
          .order('created_at', { ascending: false });
        
        if (appsError) {
          console.error('Applications fetch error:', appsError);
          throw appsError;
        }
        console.log('Applications data:', appsData);
        // Transform the data to match the Application type by adding missing fields
        const transformedApps = (appsData || []).map(app => ({
          ...app,
          proposal_message: app.cover_letter || '', // Map cover_letter to proposal_message
          updated_at: app.created_at // Use created_at as updated_at if not present
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
      
      // Fetch assigned projects (status = "assigned" and assigned_to = userId)
      const { data: assignedProjectsData, error: assignedProjectsError } = await supabase
        .from('projects')
        .select(`
          *,
          client:profiles!projects_client_id_fkey(first_name, last_name)
        `)
        .eq('assigned_to', userId)
        .eq('status', 'assigned');
        
      if (assignedProjectsError) {
        console.error('Assigned projects fetch error:', assignedProjectsError);
        throw assignedProjectsError;
      }
      
      console.log('Assigned projects data:', assignedProjectsData);
      
      // Add assigned projects to the professional's view
      if (assignedProjectsData && assignedProjectsData.length > 0) {
        setProjects(prev => [...prev, ...assignedProjectsData]);
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
      
      // Ensure each payment has a created_at field
      const paymentsWithDates = (paymentsData || []).map(payment => ({
        ...payment,
        created_at: payment.created_at || new Date().toISOString()
      }));
      
      setPayments(paymentsWithDates);
      
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
      setReviews(reviewsData || []);
      
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
    calculateAverageRating,
    calculatePaymentTotals,
  };
};
