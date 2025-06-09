
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useProfessionalActions = (userId: string, fetchDashboardData: () => void) => {
  const { toast } = useToast();

  const markProjectComplete = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: 'completed' })
        .eq('id', projectId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Project marked as completed successfully!"
      });

      fetchDashboardData();
    } catch (error: any) {
      console.error('Error marking project complete:', error);
      toast({
        title: "Error",
        description: "Failed to mark project as completed",
        variant: "destructive"
      });
    }
  };

  return {
    markProjectComplete
  };
};
