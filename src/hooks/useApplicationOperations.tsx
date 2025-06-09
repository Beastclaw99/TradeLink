import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Application } from '@/components/dashboard/types';

export const useApplicationOperations = (clientId: string, onUpdate: () => void) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleApplicationReview = async (applicationId: string, status: 'accepted' | 'rejected', feedback?: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('applications')
        .update({
          status,
          feedback,
          reviewed_at: new Date().toISOString(),
          client_id: clientId
        })
        .eq('id', applicationId)
        .eq('client_id', clientId);

      if (error) throw error;

      toast({
        title: 'Application Updated',
        description: `Application has been ${status}.`
      });

      onUpdate();
    } catch (error) {
      console.error('Error updating application:', error);
      toast({
        title: 'Error',
        description: 'Failed to update application status.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: 'Error',
        description: 'Failed to load applications.',
        variant: 'destructive'
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleApplicationReview,
    fetchApplications
  };
};
