import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Milestone } from '@/components/project/creation/types';
import { ProjectStatus } from '@/types/projectUpdates';
import { useProjectStatus } from '@/hooks/useProjectStatus';

interface MilestoneStatusUpdateProps {
  milestone: Milestone;
  projectId: string;
  onStatusUpdate: (milestoneId: string, newStatus: Milestone['status']) => void;
  isClient: boolean;
  projectStatus: ProjectStatus;
}

export default function MilestoneStatusUpdate({ 
  milestone, 
  projectId, 
  onStatusUpdate,
  isClient,
  projectStatus
}: MilestoneStatusUpdateProps) {
  const { toast } = useToast();
  const [userId, setUserId] = useState<string>('');
  const { updateProjectStatus } = useProjectStatus(projectId, userId);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    getUser();
  }, []);

  const handleStatusUpdate = async (newStatus: Milestone['status']) => {
    try {
      // Update milestone status
      const { error: milestoneError } = await supabase
        .from('project_milestones')
        .update({ 
          status: newStatus,
          is_complete: newStatus === 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', milestone.id);

      if (milestoneError) throw milestoneError;

      // Get all milestones for the project
      const { data: allMilestones, error: milestonesError } = await supabase
        .from('project_milestones')
        .select('*')
        .eq('project_id', projectId);

      if (milestonesError) throw milestonesError;

      // Check if all milestones are completed and have deliverables
      const allCompleted = allMilestones?.every(m => m.status === 'completed');
      
      // Check deliverables for each milestone
      const deliverablesPromises = allMilestones?.map(async (m) => {
        const { data: deliverables } = await supabase
          .from('project_deliverables')
          .select('id')
          .eq('milestone_id', m.id);
        return deliverables && deliverables.length > 0;
      }) || [];

      const deliverablesResults = await Promise.all(deliverablesPromises);
      const allHaveDeliverables = deliverablesResults.every(hasDeliverables => hasDeliverables);

      // Update project status based on milestone status
      if (newStatus === 'completed' && allCompleted && allHaveDeliverables) {
        // If all milestones are completed and have deliverables, update project status
        if (projectStatus === 'in_progress') {
          await updateProjectStatus('work_submitted', {
            milestone_id: milestone.id,
            milestone_title: milestone.title
          });
        }
      } else if (newStatus === 'in_progress' && projectStatus === 'assigned') {
        // If starting work on a milestone, update project status to in_progress
        await updateProjectStatus('in_progress', {
          milestone_id: milestone.id,
          milestone_title: milestone.title
        });
      }

      onStatusUpdate(milestone.id!, newStatus);

      toast({
        title: "Success",
        description: `Milestone status updated to ${newStatus}`
      });
    } catch (error) {
      console.error('Error updating milestone status:', error);
      toast({
        title: "Error",
        description: "Failed to update milestone status",
        variant: "destructive"
      });
    }
  };

  const getNextStatus = (currentStatus: Milestone['status']): Milestone['status'] => {
    switch (currentStatus) {
      case 'not_started':
        return 'in_progress';
      case 'in_progress':
        return 'completed';
      case 'completed':
        return 'not_started';
      default:
        return 'not_started';
    }
  };

  const getStatusButtonText = (status: Milestone['status']): string => {
    switch (status) {
      case 'not_started':
        return 'Start Work';
      case 'in_progress':
        return 'Mark as Completed';
      case 'completed':
        return 'Reset Status';
      default:
        return 'Update Status';
    }
  };

  const isButtonDisabled = () => {
    if (isClient) return true;
    if (projectStatus === 'cancelled' || projectStatus === 'archived') return true;
    if (milestone.status === 'completed' && projectStatus === 'work_approved') return true;
    return false;
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={milestone.status === 'completed' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleStatusUpdate(getNextStatus(milestone.status))}
        disabled={isButtonDisabled()}
      >
        {getStatusButtonText(milestone.status)}
      </Button>
    </div>
  );
} 