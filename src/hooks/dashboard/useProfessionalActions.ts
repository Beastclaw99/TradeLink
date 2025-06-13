import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Database } from '@/integrations/supabase/types';

type Milestone = Database['public']['Tables']['project_milestones']['Row'];
type Deliverable = Database['public']['Tables']['project_deliverables']['Row'];
type ProjectStatus = Database['public']['Enums']['project_status_enum'];
type DeliverableStatus = Database['public']['Enums']['deliverable_status'];
type MilestoneStatus = Database['public']['Enums']['milestone_status'];

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
        (milestone) => milestone.status === 'completed' as MilestoneStatus
      );

      if (!allMilestonesCompleted) {
        toast({
          title: "Warning",
          description: "All milestones must be completed before marking the project as complete",
          variant: "destructive"
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
        (deliverable) => deliverable.status === 'approved' as DeliverableStatus
      );

      if (!allDeliverablesSubmitted) {
        toast({
          title: "Warning",
          description: "All deliverables must be approved before marking the project as complete",
          variant: "destructive"
        });
        return;
      }

      // Update project status
      const { error: projectError } = await supabase
        .from('projects')
        .update({
          status: 'completed' as ProjectStatus,
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
          message: 'Project marked as complete by professional',
          user_id: userId,
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
