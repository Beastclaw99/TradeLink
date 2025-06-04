
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Application } from '@/types';
import { useToast } from "@/components/ui/use-toast";

export const useApplications = (initialApplications: Application[], isLoading: boolean) => {
  const { toast } = useToast();
  const [localApplications, setLocalApplications] = useState<Application[]>(initialApplications);
  const [localIsLoading, setLocalIsLoading] = useState(isLoading);

  useEffect(() => {
    setLocalApplications(initialApplications);
    setLocalIsLoading(isLoading);
  }, [initialApplications, isLoading]);

  const updateLocalApplications = useCallback((applications: Application[]) => {
    setLocalApplications(applications);
  }, []);

  const fetchApplications = useCallback(async (userId: string) => {
    try {
      setLocalIsLoading(true);
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('professional_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const transformedApplications: Application[] = (data || [])
        .filter(app => app.project_id && app.status && app.professional_id)
        .map(app => ({
          id: app.id,
          project_id: app.project_id!,
          professional_id: app.professional_id!,
          status: app.status as Application['status'],
          created_at: app.created_at || new Date().toISOString(),
          updated_at: app.updated_at || new Date().toISOString(),
          cover_letter: app.cover_letter,
          bid_amount: app.bid_amount,
          proposal_message: app.proposal_message,
          availability: app.availability
        }));

      setLocalApplications(transformedApplications);
    } catch (error: any) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error",
        description: "Failed to fetch applications. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLocalIsLoading(false);
    }
  }, [toast]);

  const withdrawApplication = async (applicationId: string, userId: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: 'withdrawn' })
        .eq('id', applicationId)
        .eq('professional_id', userId);

      if (error) throw error;

      toast({
        title: "Application Withdrawn",
        description: "Your application has been successfully withdrawn."
      });

      // Update local state
      setLocalApplications(prev =>
        prev.map(app =>
          app.id === applicationId ? { ...app, status: 'withdrawn' as Application['status'] } : app
        )
      );
      
    } catch (error: any) {
      console.error('Error withdrawing application:', error);
      toast({
        title: "Error",
        description: "Failed to withdraw application. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string, projectStatus?: string) => {
    if (status === 'accepted' && projectStatus) {
      return getProjectStatusColor(projectStatus);
    }
    
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'withdrawn': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProjectStatusColor = (projectStatus: string) => {
    switch (projectStatus) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'assigned': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return {
    localApplications,
    localIsLoading,
    updateLocalApplications,
    fetchApplications,
    withdrawApplication,
    getStatusColor,
    getProjectStatusColor
  };
};
