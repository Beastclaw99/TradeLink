
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import { Project, Application, Payment, Review } from '@/components/dashboard/types';
import { useDataTransforms } from './useDataTransforms';

export const useDataFetching = (userId: string) => {
  const { toast } = useToast();
  const { transformProjects, transformApplications, transformPayments, transformReviews } = useDataTransforms();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDashboardData = async () => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      setError(null);

      // Fetch projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select(`
          *,
          client:profiles!projects_client_id_fkey(first_name, last_name)
        `)
        .eq('client_id', userId)
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;
      setProjects(transformProjects(projectsData));

      // Fetch applications for client's projects
      const { data: applicationsData, error: applicationsError } = await supabase
        .from('applications')
        .select(`
          *,
          project:projects!inner(id, title, status, budget, created_at, client_id),
          professional:profiles!applications_professional_id_fkey(first_name, last_name, rating, skills)
        `)
        .eq('project.client_id', userId)
        .order('created_at', { ascending: false });

      if (applicationsError) throw applicationsError;
      setApplications(transformApplications(applicationsData));

      // Fetch payments
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select(`
          *,
          project:projects(title),
          professional:profiles!payments_professional_id_fkey(first_name, last_name)
        `)
        .eq('client_id', userId)
        .order('created_at', { ascending: false });

      if (paymentsError) throw paymentsError;
      setPayments(transformPayments(paymentsData));

      // Fetch reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('*')
        .eq('client_id', userId)
        .order('created_at', { ascending: false });

      if (reviewsError) throw reviewsError;
      setReviews(transformReviews(reviewsData));

      // Fetch profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      setProfileData(profile);

    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err);
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    projects,
    applications,
    payments,
    reviews,
    profileData,
    isLoading,
    error,
    fetchDashboardData
  };
};
