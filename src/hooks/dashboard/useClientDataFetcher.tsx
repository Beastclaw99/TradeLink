import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Project, Application, Payment, Review, Profile } from '@/types/database';

export const useClientDataFetcher = (userId: string) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        throw new Error('Failed to load profile information');
      }

      setProfile(profileData);

      // Fetch projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select(`
          *,
          project_milestones (*),
          project_updates (*)
        `)
        .eq('client_id', userId)
        .order('created_at', { ascending: false });

      if (projectsError) {
        console.error('Error fetching projects:', projectsError);
        throw new Error('Failed to load projects');
      }

      setProjects(projectsData || []);

      // Fetch applications for the client's projects
      const projectIds = projectsData?.map(p => p.id) || [];
      const { data: applicationsData, error: applicationsError } = await supabase
        .from('applications')
        .select(`
          *,
          professionals:professional_id (
            id,
            email,
            first_name,
            last_name,
            profile_visibility,
            allow_messages
          )
        `)
        .in('project_id', projectIds)
        .order('created_at', { ascending: false });

      if (applicationsError) {
        console.error('Error fetching applications:', applicationsError);
        throw new Error('Failed to load applications');
      }

      setApplications(applicationsData || []);

      // Fetch payments
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .eq('client_id', userId)
        .order('created_at', { ascending: false });

      if (paymentsError) {
        console.error('Error fetching payments:', paymentsError);
        throw new Error('Failed to load payments');
      }

      setPayments(paymentsData || []);

      // Fetch reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select(`
          *,
          professionals:professional_id (
            id,
            email,
            first_name,
            last_name
          )
        `)
        .eq('client_id', userId)
        .order('created_at', { ascending: false });

      if (reviewsError) {
        console.error('Error fetching reviews:', reviewsError);
        throw new Error('Failed to load reviews');
      }

      setReviews(reviewsData || []);

    } catch (error: any) {
      console.error('Error in fetchDashboardData:', error);
      setError(error.message || 'An error occurred while loading dashboard data');
      toast({
        title: "Error",
        description: error.message || 'Failed to load dashboard data',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
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
    fetchDashboardData
  };
}; 