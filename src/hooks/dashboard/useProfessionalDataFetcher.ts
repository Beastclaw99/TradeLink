import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/useToast";
import { Project } from '@/components/dashboard/types';
import { Application } from '@/components/dashboard/types';

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  project?: {
    id: string;
    title: string;
  };
  client: {
    id: string;
    full_name: string;
    profile_image: string | null;
  };
}

interface Payment {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  project: {
    id: string;
    title: string;
  };
}

interface ProfessionalData {
  profile: {
    id: string;
    full_name: string;
    bio: string | null;
    location: string | null;
    phone: string | null;
    hourly_rate: number | null;
    skills: string[] | null;
    profile_image: string | null;
    created_at: string;
    updated_at: string;
  };
  projects: Project[];
  applications: Application[];
  reviews: Review[];
  payments: Payment[];
}

export const useProfessionalDataFetcher = (professionalId: string) => {
  const { toast } = useToast();
  const [data, setData] = useState<ProfessionalData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('Fetching professional dashboard data for user:', professionalId);

      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', professionalId)
        .single();

      if (profileError) throw profileError;

      // Fetch projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('assigned_to', professionalId);

      if (projectsError) throw projectsError;

      // Fetch applications
      const { data: applicationsData, error: applicationsError } = await supabase
        .from('applications')
        .select(`
          *,
          project:projects (
            id,
            title,
            status,
            budget,
            created_at
          )
        `)
        .eq('professional_id', professionalId);

      if (applicationsError) throw applicationsError;

      // Fetch reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select(`
          *,
          project:projects (
            id,
            title
          ),
          client:profiles!reviews_client_id_fkey (
            id,
            full_name,
            profile_image
          )
        `)
        .eq('professional_id', professionalId);

      if (reviewsError) throw reviewsError;

      // Fetch payments
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select(`
          *,
          project:projects (
            id,
            title
          )
        `)
        .eq('professional_id', professionalId);

      if (paymentsError) throw paymentsError;

      setData({
        profile: profileData,
        projects: projectsData || [],
        applications: applicationsData || [],
        reviews: reviewsData || [],
        payments: paymentsData || [],
      });
    } catch (error) {
      console.error('Error fetching professional data:', error);
      setError('Failed to load professional data');
      toast({
        title: 'Error',
        description: 'Failed to load professional data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [professionalId]);

  return {
    data,
    isLoading,
    error,
    refreshData: fetchData,
  };
};
