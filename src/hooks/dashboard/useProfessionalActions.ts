import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Milestone {
  id: string;
  project_id: string;
  title: string;
  description: string;
  status: string;
  due_date: string;
  created_at: string;
  updated_at: string;
}

interface Deliverable {
  id: string;
  project_id: string;
  title: string;
  description: string;
  status: string;
  due_date: string;
  created_at: string;
  updated_at: string;
}

export const useProfessionalActions = (userId: string, fetchDashboardData: () => void) => {
  const { toast } = useToast();

  const markProjectComplete = async (projectId: string) => {
    try {
      // First check if all milestones are completed
      const { data: milestones, error: milestonesError } = await supabase
        .from('project_milestones')
        .select('*')
        .eq('project_id', projectId);

      if (milestonesError) throw milestonesError;

      const allMilestonesCompleted = milestones?.every(
        (milestone: Milestone) => milestone.status === 'completed'
      );

      if (!allMilestonesCompleted) {
        toast({
          title: "Warning",
          description: "All milestones must be completed before marking the project as complete",
          variant: "warning"
        });
        return;
      }

      // Check if all deliverables are submitted
      const { data: deliverables, error: deliverablesError } = await supabase
        .from('project_deliverables')
        .select('*')
        .eq('project_id', projectId);

      if (deliverablesError) throw deliverablesError;

      const allDeliverablesSubmitted = deliverables?.every(
        (deliverable: Deliverable) => deliverable.status === 'submitted'
      );

      if (!allDeliverablesSubmitted) {
        toast({
          title: "Warning",
          description: "All deliverables must be submitted before marking the project as complete",
          variant: "warning"
        });
        return;
      }

      // Update project status
      const { error: projectError } = await supabase
        .from('projects')
        .update({
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);

      if (projectError) throw projectError;

      // Create project update
      const { error: updateError } = await supabase
        .from('project_updates')
        .insert({
          project_id: projectId,
          update_type: 'completion_note',
          content: 'Project marked as complete by professional',
          created_at: new Date().toISOString()
        });

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Project has been marked as complete",
      });

      // Refresh data
      await fetchDashboardData();
    } catch (error: any) {
      console.error('Error marking project complete:', error);
      toast({
        title: "Error",
        description: "Failed to mark project as complete. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
    markProjectComplete
  };
};
