
import { supabase } from '@/integrations/supabase/client';
import { notificationService } from './notificationService';

export type ProjectStatus = 
  | 'open' 
  | 'assigned' 
  | 'in_progress' 
  | 'work_submitted' 
  | 'work_revision_requested' 
  | 'work_approved' 
  | 'completed' 
  | 'paid' 
  | 'archived' 
  | 'cancelled';

interface StatusTransitionResult {
  success: boolean;
  message: string;
  newStatus?: ProjectStatus;
}

export const projectLifecycleService = {
  // Valid status transitions
  getValidTransitions: (currentStatus: ProjectStatus): ProjectStatus[] => {
    const transitions: Record<ProjectStatus, ProjectStatus[]> = {
      open: ['assigned', 'cancelled'],
      assigned: ['in_progress', 'cancelled'],
      in_progress: ['work_submitted', 'cancelled'],
      work_submitted: ['work_revision_requested', 'work_approved', 'cancelled'],
      work_revision_requested: ['work_submitted', 'cancelled'],
      work_approved: ['completed', 'cancelled'],
      completed: ['paid', 'archived'],
      paid: ['archived'],
      archived: [],
      cancelled: []
    };
    
    return transitions[currentStatus] || [];
  },

  // Update project status with validation and history tracking
  async updateProjectStatus(
    projectId: string,
    newStatus: ProjectStatus,
    reason?: string,
    metadata?: any
  ): Promise<StatusTransitionResult> {
    try {
      // Get current project status
      const { data: project, error: fetchError } = await supabase
        .from('projects')
        .select('status, title, client_id, professional_id')
        .eq('id', projectId)
        .single();

      if (fetchError) throw fetchError;

      const currentStatus = project.status as ProjectStatus;
      const validTransitions = this.getValidTransitions(currentStatus);

      // Validate transition
      if (!validTransitions.includes(newStatus)) {
        return {
          success: false,
          message: `Invalid status transition from ${currentStatus} to ${newStatus}`
        };
      }

      // Update project status
      const { error: updateError } = await supabase
        .from('projects')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);

      if (updateError) throw updateError;

      // Create history record
      await this.createHistoryRecord(projectId, 'status_change', {
        previous_status: currentStatus,
        new_status: newStatus,
        reason,
        ...metadata
      });

      // Send notifications
      if (project.client_id && project.professional_id) {
        await this.sendStatusChangeNotifications(
          projectId,
          project.title,
          currentStatus,
          newStatus,
          project.client_id,
          project.professional_id
        );
      }

      return {
        success: true,
        message: `Status updated to ${newStatus}`,
        newStatus
      };

    } catch (error: any) {
      console.error('Error updating project status:', error);
      return {
        success: false,
        message: error.message || 'Failed to update project status'
      };
    }
  },

  // Create history record
  async createHistoryRecord(
    projectId: string,
    historyType: string,
    historyData: any
  ): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase
        .from('project_history')
        .insert({
          project_id: projectId,
          history_type: historyType,
          history_data: historyData,
          created_by: user?.id
        });
    } catch (error) {
      console.error('Error creating history record:', error);
    }
  },

  // Send status change notifications
  async sendStatusChangeNotifications(
    projectId: string,
    projectTitle: string,
    previousStatus: ProjectStatus,
    newStatus: ProjectStatus,
    clientId: string,
    professionalId: string
  ): Promise<void> {
    try {
      const message = `Project "${projectTitle}" status changed from ${previousStatus} to ${newStatus}`;
      
      // Notify client
      await notificationService.createNotification({
        user_id: clientId,
        type: 'info',
        title: 'Project Status Updated',
        message
      });

      // Notify professional
      await notificationService.createNotification({
        user_id: professionalId,
        type: 'info',
        title: 'Project Status Updated',
        message
      });
    } catch (error) {
      console.error('Error sending notifications:', error);
    }
  },

  // Archive project
  async archiveProject(
    projectId: string,
    reason: string,
    notes?: string
  ): Promise<StatusTransitionResult> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Create archive record
      const { error: archiveError } = await supabase
        .from('project_archives')
        .insert({
          project_id: projectId,
          archive_reason: reason,
          archive_notes: notes,
          archived_by: user?.id
        });

      if (archiveError) throw archiveError;

      // Update project status
      const result = await this.updateProjectStatus(projectId, 'archived', reason);
      
      return result;
    } catch (error: any) {
      console.error('Error archiving project:', error);
      return {
        success: false,
        message: error.message || 'Failed to archive project'
      };
    }
  },

  // Complete project with validation
  async completeProject(projectId: string): Promise<StatusTransitionResult> {
    try {
      // Check if all milestones are completed
      const { data: milestones, error: milestonesError } = await supabase
        .from('project_milestones')
        .select('status')
        .eq('project_id', projectId);

      if (milestonesError) throw milestonesError;

      const incompleteMilestones = milestones?.filter(m => m.status !== 'completed') || [];
      
      if (incompleteMilestones.length > 0) {
        return {
          success: false,
          message: `Cannot complete project: ${incompleteMilestones.length} milestone(s) are not completed`
        };
      }

      return await this.updateProjectStatus(projectId, 'completed', 'All milestones completed');
    } catch (error: any) {
      console.error('Error completing project:', error);
      return {
        success: false,
        message: error.message || 'Failed to complete project'
      };
    }
  },

  // Get project lifecycle status
  async getProjectLifecycleStatus(projectId: string) {
    try {
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('status, created_at, updated_at')
        .eq('id', projectId)
        .single();

      if (projectError) throw projectError;

      const { data: milestones, error: milestonesError } = await supabase
        .from('project_milestones')
        .select('status, due_date')
        .eq('project_id', projectId);

      if (milestonesError) throw milestonesError;

      const completedMilestones = milestones?.filter(m => m.status === 'completed').length || 0;
      const totalMilestones = milestones?.length || 0;
      const overdueMilestones = milestones?.filter(m => 
        m.due_date && new Date(m.due_date) < new Date() && m.status !== 'completed'
      ).length || 0;

      return {
        status: project.status,
        progress: totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0,
        milestonesCompleted: completedMilestones,
        totalMilestones,
        overdueMilestones,
        validTransitions: this.getValidTransitions(project.status as ProjectStatus),
        createdAt: project.created_at,
        updatedAt: project.updated_at
      };
    } catch (error) {
      console.error('Error getting project lifecycle status:', error);
      return null;
    }
  }
};
