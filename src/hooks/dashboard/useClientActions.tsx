import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Application } from '@/types/database';

export const useClientActions = (userId: string, onSuccess?: () => void) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleApplicationUpdate = async (applicationId: string, status: 'accepted' | 'rejected' | 'pending') => {
    try {
      setIsProcessing(true);

      // Update application status
      const { error: updateError } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', applicationId)
        .eq('project_id', (await supabase
          .from('projects')
          .select('id')
          .eq('client_id', userId)
          .single()
        ).data?.id);

      if (updateError) {
        throw updateError;
      }

      // Add project update
      const { data: application } = await supabase
        .from('applications')
        .select('project_id, professionals:professional_id (first_name, last_name)')
        .eq('id', applicationId)
        .single();

      if (application) {
        await supabase
          .from('project_updates')
          .insert([{
            project_id: application.project_id,
            update_type: 'application_updated',
            message: `Application ${status} for ${application.professionals.first_name} ${application.professionals.last_name}`,
            user_id: userId
          }]);
      }

      toast({
        title: "Success",
        description: `Application ${status} successfully`
      });

      // Refresh dashboard data
      onSuccess?.();
    } catch (error: any) {
      console.error('Error updating application:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to update application',
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    handleApplicationUpdate
  };
}; 