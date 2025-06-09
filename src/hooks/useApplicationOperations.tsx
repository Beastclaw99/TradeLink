
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useApplicationOperations = (userId: string, onUpdate: () => void) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApplicationUpdate = async (
    applicationId: string, 
    newStatus: string, 
    projectId: string, 
    professionalId: string
  ) => {
    try {
      setIsProcessing(true);
      
      // Start a transaction
      if (newStatus === 'accepted') {
        // If accepting, update project to assigned
        const { error: projectError } = await supabase
          .from('projects')
          .update({
            status: 'assigned',
            assigned_to: professionalId
          })
          .eq('id', projectId)
          .eq('client_id', userId);
        
        if (projectError) throw projectError;
        
        // Reject all other applications for this project
        const { error: rejectError } = await supabase
          .from('applications')
          .update({ status: 'rejected' })
          .eq('project_id', projectId)
          .neq('id', applicationId);
        
        if (rejectError) throw rejectError;
      }
      
      // Update the specific application status
      const { error: appError } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', applicationId);
      
      if (appError) throw appError;
      
      toast({
        title: `Application ${newStatus === 'accepted' ? 'Accepted' : 'Rejected'}`,
        description: newStatus === 'accepted' 
          ? "The professional has been assigned to your project."
          : "The application has been rejected."
      });
      
      // Refresh data
      onUpdate();
      
    } catch (error: any) {
      console.error('Error updating application:', error);
      toast({
        title: "Error",
        description: "Failed to update application. Please try again.",
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
