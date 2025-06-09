import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Project, Application } from '@/components/dashboard/types';
import { useProfessionalDataFetcher } from './dashboard/useProfessionalDataFetcher';
import { useProfessionalActions } from './dashboard/useProfessionalActions';
import { calculateAverageRating, calculatePaymentTotals } from './dashboard/calculationUtils';

export const useProfessionalDashboard = (professionalId: string) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [profile, setProfile] = useState<any>(null);

  const {
    fetchProfessionalData,
    fetchProjects,
    fetchApplications
  } = useProfessionalDataFetcher(professionalId);

  const { markProjectComplete } = useProfessionalActions(professionalId, () => {
    fetchDashboardData();
  });

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      await fetchProfessionalData();
      await fetchProjects();
      await fetchApplications();
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [professionalId]);

  return {
    isLoading,
    projects,
    applications,
    profile,
    fetchDashboardData,
    fetchProjects,
    fetchApplications,
    markProjectComplete,
    calculateAverageRating: () => calculateAverageRating(reviews),
    calculatePaymentTotals: () => calculatePaymentTotals(payments),
  };
};
