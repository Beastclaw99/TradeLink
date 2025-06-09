
import { supabase } from '@/integrations/supabase/client';

interface NotificationData {
  user_id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  action_url?: string;
  action_label?: string;
  metadata?: any;
}

export const notificationService = {
  // Create a notification
  async createNotification(data: NotificationData) {
    try {
      console.log('Creating notification:', data);
      
      const { error } = await supabase
        .from('notifications')
        .insert([{
          ...data,
          created_at: new Date().toISOString()
        }]);

      if (error) {
        console.error('Error creating notification:', error);
        throw error;
      }
      
      console.log('Notification created successfully');
    } catch (error) {
      console.error('Error in createNotification:', error);
    }
  },

  // Create status change notification
  async createStatusChangeNotification(
    projectId: string,
    projectTitle: string,
    oldStatus: string,
    newStatus: string,
    clientId: string,
    professionalId: string,
    metadata?: any
  ) {
    const statusMessages: Record<string, { title: string; message: string }> = {
      assigned: {
        title: 'Project Assigned',
        message: `Project "${projectTitle}" has been assigned to a professional.`
      },
      in_progress: {
        title: 'Work Started',
        message: `Work has started on project "${projectTitle}".`
      },
      work_submitted: {
        title: 'Work Submitted',
        message: `Work has been submitted for review on project "${projectTitle}".`
      },
      work_revision_requested: {
        title: 'Revision Requested',
        message: `Revision has been requested for project "${projectTitle}".`
      },
      work_approved: {
        title: 'Work Approved',
        message: `Work has been approved for project "${projectTitle}".`
      },
      completed: {
        title: 'Project Completed',
        message: `Project "${projectTitle}" has been completed and is ready for payment.`
      },
      paid: {
        title: 'Payment Received',
        message: `Payment has been received for project "${projectTitle}".`
      },
      archived: {
        title: 'Project Archived',
        message: `Project "${projectTitle}" has been archived.`
      },
      cancelled: {
        title: 'Project Cancelled',
        message: `Project "${projectTitle}" has been cancelled.`
      },
      disputed: {
        title: 'Project Disputed',
        message: `A dispute has been raised for project "${projectTitle}".`
      }
    };

    const statusInfo = statusMessages[newStatus];
    if (!statusInfo) return;

    // Notify client
    await this.createNotification({
      user_id: clientId,
      type: 'info',
      title: statusInfo.title,
      message: statusInfo.message,
      action_url: `/projects/${projectId}`,
      action_label: 'View Project'
    });

    // Notify professional
    await this.createNotification({
      user_id: professionalId,
      type: 'info',
      title: statusInfo.title,
      message: statusInfo.message,
      action_url: `/projects/${projectId}`,
      action_label: 'View Project'
    });
  },

  // Create milestone completion notification
  async createMilestoneNotification(
    projectId: string,
    projectTitle: string,
    milestoneTitle: string,
    milestoneStatus: string,
    clientId: string,
    professionalId: string
  ) {
    const statusMessages: Record<string, { title: string; message: string }> = {
      in_progress: {
        title: 'Milestone Started',
        message: `Work has started on milestone "${milestoneTitle}" for project "${projectTitle}".`
      },
      completed: {
        title: 'Milestone Completed',
        message: `Milestone "${milestoneTitle}" has been completed for project "${projectTitle}".`
      },
      overdue: {
        title: 'Milestone Overdue',
        message: `Milestone "${milestoneTitle}" is overdue for project "${projectTitle}".`
      }
    };

    const statusInfo = statusMessages[milestoneStatus];
    if (!statusInfo) return;

    // Notify client
    await this.createNotification({
      user_id: clientId,
      type: milestoneStatus === 'overdue' ? 'warning' : 'info',
      title: statusInfo.title,
      message: statusInfo.message,
      action_url: `/projects/${projectId}`,
      action_label: 'View Project'
    });

    // Notify professional
    await this.createNotification({
      user_id: professionalId,
      type: milestoneStatus === 'overdue' ? 'warning' : 'info',
      title: statusInfo.title,
      message: statusInfo.message,
      action_url: `/projects/${projectId}`,
      action_label: 'View Project'
    });
  },

  // Create deliverable submission notification
  async createDeliverableNotification(
    projectId: string,
    projectTitle: string,
    milestoneTitle: string,
    clientId: string,
    professionalId: string,
    isSubmission: boolean
  ) {
    const title = isSubmission ? 'Deliverable Submitted' : 'Deliverable Reviewed';
    const message = isSubmission
      ? `A deliverable has been submitted for milestone "${milestoneTitle}" in project "${projectTitle}".`
      : `A deliverable has been reviewed for milestone "${milestoneTitle}" in project "${projectTitle}".`;

    // Notify client
    await this.createNotification({
      user_id: clientId,
      type: 'info',
      title,
      message,
      action_url: `/projects/${projectId}`,
      action_label: 'View Project'
    });

    // Notify professional
    await this.createNotification({
      user_id: professionalId,
      type: 'info',
      title,
      message,
      action_url: `/projects/${projectId}`,
      action_label: 'View Project'
    });
  }
};
