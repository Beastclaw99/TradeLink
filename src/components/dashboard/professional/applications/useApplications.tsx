import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Application } from '@/types';
import { useToast } from "@/components/ui/use-toast";

export const useApplications = (userId: string) => {
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchApplications = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('professional_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setApplications(data || []);
    } catch (error: any) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error",
        description: "Failed to fetch applications. Please try again.",
        variant: "destructive"
      });
    }
  }, [userId, toast]);

  const withdrawApplication = async (applicationId: string) => {
    try {
      setIsSubmitting(true);
      
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

      // Refresh applications
      await fetchApplications();
      
    } catch (error: any) {
      console.error('Error withdrawing application:', error);
      toast({
        title: "Error",
        description: "Failed to withdraw application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
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
    applications,
    isSubmitting,
    fetchApplications,
    withdrawApplication,
    getStatusColor,
    getProjectStatusColor
  };
};
