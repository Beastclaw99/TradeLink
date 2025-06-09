import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/useToast';
import { Application } from '@/components/dashboard/types';

interface UseApplicationsProps {
  professionalId?: string;
}

interface ApplicationWithProject extends Application {
  project: {
    id: string;
    title: string;
    status: string;
    budget: number;
    created_at: string;
    client: {
      id: string;
      full_name: string;
      profile_image: string | null;
    };
  };
}

export const useApplications = ({ professionalId }: UseApplicationsProps) => {
  const { toast } = useToast();
  const [applications, setApplications] = useState<ApplicationWithProject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!professionalId) return;
    fetchApplications();
  }, [professionalId]);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          project:projects (
            *,
            client:profiles!projects_client_id_fkey (
              id,
              full_name,
              profile_image
            )
          )
        `)
        .eq('professional_id', professionalId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setError('Failed to load applications');
      toast({
        title: 'Error',
        description: 'Failed to load applications',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const withdrawApplication = async (applicationId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { error } = await supabase
        .from('applications')
        .update({ status: 'withdrawn' })
        .eq('id', applicationId)
        .eq('professional_id', professionalId);

      if (error) throw error;

      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status: 'withdrawn' } : app
        )
      );

      toast({
        title: 'Success',
        description: 'Application withdrawn successfully',
      });
    } catch (error) {
      console.error('Error withdrawing application:', error);
      setError('Failed to withdraw application');
      toast({
        title: 'Error',
        description: 'Failed to withdraw application',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    applications,
    isLoading,
    error,
    withdrawApplication,
    refreshApplications: fetchApplications,
  };
};
