
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ApplicationProject {
  id: string;
  title: string;
  status: string | null;
  budget: number | null;
  created_at: string | null;
}

interface ApplicationData {
  id: string;
  project_id: string;
  professional_id: string;
  cover_letter: string | null;
  proposal_message: string | null;
  bid_amount: number | null;
  availability: string | null;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn' | null;
  created_at: string;
  updated_at: string;
  project: ApplicationProject | null;
}

export const useApplications = (professionalId: string) => {
  const { toast } = useToast();
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('applications')
        .select(`
          id,
          project_id,
          professional_id,
          cover_letter,
          proposal_message,
          bid_amount,
          availability,
          status,
          created_at,
          updated_at,
          project:projects (
            id,
            title,
            status,
            budget,
            created_at
          )
        `)
        .eq('professional_id', professionalId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to match expected interface
      const transformedApplications: ApplicationData[] = (data || []).map(app => ({
        id: app.id,
        project_id: app.project_id || '',
        professional_id: app.professional_id || '',
        cover_letter: app.cover_letter,
        proposal_message: app.proposal_message,
        bid_amount: app.bid_amount,
        availability: app.availability,
        status: app.status as 'pending' | 'accepted' | 'rejected' | 'withdrawn' | null,
        created_at: app.created_at || new Date().toISOString(),
        updated_at: app.updated_at || new Date().toISOString(),
        project: app.project ? {
          id: app.project.id,
          title: app.project.title || '',
          status: app.project.status,
          budget: app.project.budget,
          created_at: app.project.created_at
        } : null
      }));

      setApplications(transformedApplications);
    } catch (error: any) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error",
        description: "Failed to fetch applications",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const withdrawApplication = async (applicationId: string) => {
    try {
      setIsWithdrawing(true);
      const { error } = await supabase
        .from('applications')
        .update({ 
          status: 'withdrawn',
          updated_at: new Date().toISOString()
        })
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: "Application Withdrawn",
        description: "Your application has been successfully withdrawn.",
      });

      // Refresh applications
      await fetchApplications();
    } catch (error: any) {
      console.error('Error withdrawing application:', error);
      toast({
        title: "Error",
        description: "Failed to withdraw application",
        variant: "destructive"
      });
    } finally {
      setIsWithdrawing(false);
    }
  };

  useEffect(() => {
    if (professionalId) {
      fetchApplications();
    }
  }, [professionalId]);

  return {
    applications,
    isLoading,
    isWithdrawing,
    fetchApplications,
    withdrawApplication
  };
};
