import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Project, Application, Payment, Review } from '@/components/dashboard/types';
import { 
  transformProjects, 
  transformApplications, 
  transformPayments, 
  transformReviews 
} from './dashboard/dataTransformers';

export const useClientDashboard = (userId: string) => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching client dashboard data for user:', userId);
      
      // Fetch profile with all necessary fields
      const { data: userProfileData, error: userProfileError } = await supabase
        .from('profiles')
        .select(`
          id,
          first_name,
          last_name,
          account_type,
          rating,
          bio,
          phone,
          email,
          location,
          profile_visibility,
          show_email,
          show_phone,
          allow_messages,
          profile_image,
          verification_status,
          created_at,
          updated_at
        `)
        .eq('id', userId)
        .single();
      
      if (userProfileError) {
        console.error('Profile fetch error:', userProfileError);
        throw userProfileError;
      }
      
      if (!userProfileData) {
        throw new Error('Profile not found');
      }
      
      console.log('Profile data:', userProfileData);
      setProfile(userProfileData);
      
      // Fetch client's projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select(`
          *,
          professional:profiles!projects_assigned_to_fkey(
            id,
            first_name,
            last_name,
            rating,
            profile_image
          )
        `)
        .eq('client_id', userId);
      
      if (projectsError) {
        console.error('Projects fetch error:', projectsError);
        throw projectsError;
      }
      
      console.log('Projects data:', projectsData);
      setProjects(transformProjects(projectsData));
      
      // Fetch applications for client's projects
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
          ),
          professional:profiles!applications_professional_id_fkey(
            id,
            first_name,
            last_name,
            rating,
            profile_image
          )
        `)
        .in('project_id', projectsData?.map(p => p.id) || [])
        .order('created_at', { ascending: false });
      
      if (appsError) {
        console.error('Applications fetch error:', appsError);
        throw appsError;
      }
      
      console.log('Applications data:', appsData);
      setApplications(transformApplications(appsData));
      
      // Fetch payments
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select(`
          *,
          project:projects(title),
          professional:profiles!payments_professional_id_fkey(
            id,
            first_name,
            last_name
          )
        `)
        .eq('client_id', userId);
      
      if (paymentsError) {
        console.error('Payments fetch error:', paymentsError);
        throw paymentsError;
      }
      
      console.log('Payments data:', paymentsData);
      setPayments(transformPayments(paymentsData));
      
      // Fetch reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select(`
          *,
          professional:profiles!reviews_professional_id_fkey(
            id,
            first_name,
            last_name,
            profile_image
          )
        `)
        .eq('client_id', userId);
      
      if (reviewsError) {
        console.error('Reviews fetch error:', reviewsError);
        throw reviewsError;
      }
      
      console.log('Reviews data:', reviewsData);
      setReviews(transformReviews(reviewsData));
      
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

  useEffect(() => {
    if (userId) {
      fetchDashboardData();
    }
  }, [userId]);

  return {
    projects,
    applications,
    payments,
    reviews,
    profile,
    isLoading,
    error,
    fetchDashboardData,
    setProjects,
    setApplications,
    setPayments,
    setReviews,
    setProfile,
    setIsLoading,
    setError
  };
};
