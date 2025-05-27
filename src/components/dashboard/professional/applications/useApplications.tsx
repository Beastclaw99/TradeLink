
import { useState, useEffect } from 'react';
import { Application } from '../../types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";

/**
 * Custom hook to manage applications state and fetch applications if needed
 * @param applications Initial applications from props
 * @param isLoading Initial loading state from props
 * @param userId Optional user ID to fetch applications for
 * @returns Object with local applications state and helpers
 */
export const useApplications = (
  applications: Application[],
  isLoading: boolean,
  userId?: string
) => {
  const { toast } = useToast();
  const [localApplications, setLocalApplications] = useState<Application[]>(applications);
  const [localIsLoading, setLocalIsLoading] = useState(isLoading);
  
  // Handle applications update from props
  useEffect(() => {
    setLocalApplications(applications);
  }, [applications]);
  
  // Handle loading state update from props
  useEffect(() => {
    setLocalIsLoading(isLoading);
  }, [isLoading]);
  
  // Fetch applications directly if parent component doesn't provide them
  useEffect(() => {
    const fetchApplications = async () => {
      if (!userId) return;
      
      if (applications.length === 0 && !isLoading) {
        try {
          setLocalIsLoading(true);
          
          const { data, error } = await supabase
            .from('applications')
            .select(`
              *,
              project:projects(id, title, status, budget, created_at)
            `)
            .eq('professional_id', userId);
          
          if (error) throw error;
          
          console.log('Fetched applications:', data);
          
          // Transform applications to match the Application type
          const transformedApplications: Application[] = (data || []).map(app => ({
            id: app.id,
            project_id: app.project_id,
            professional_id: app.professional_id,
            cover_letter: app.cover_letter,
            proposal_message: app.proposal_message,
            bid_amount: app.bid_amount,
            availability: app.availability,
            status: app.status,
            created_at: app.created_at,
            updated_at: app.updated_at,
            project: app.project ? {
              id: app.project.id,
              title: app.project.title,
              status: app.project.status,
              budget: app.project.budget,
              created_at: app.project.created_at
            } : undefined
          }));
          
          setLocalApplications(transformedApplications);
        } catch (error: any) {
          console.error('Error fetching applications:', error);
          toast({
            title: "Error",
            description: "Failed to load application data. Please try again later.",
            variant: "destructive"
          });
        } finally {
          setLocalIsLoading(false);
        }
      }
    };
    
    fetchApplications();
  }, [userId, applications, isLoading, toast]);
  
  const updateLocalApplications = (newApplications: Application[]) => {
    setLocalApplications(newApplications);
  };
  
  return {
    localApplications,
    localIsLoading,
    updateLocalApplications
  };
};
