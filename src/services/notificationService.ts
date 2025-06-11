import { supabase } from '@/integrations/supabase/client';

interface Notification {
  id: string;
  user_id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  action_url?: string;
  action_label?: string;
  read: boolean;
  created_at: string;
  updated_at: string;
  metadata?: {
    project_id?: string;
    professional_id?: string;
    client_id?: string;
    application_id?: string;
    milestone_id?: string;
    deliverable_id?: string;
    payment_id?: string;
    review_id?: string;
    [key: string]: any;
  };
}

export const notificationService = {
  // Create a new notification
  async createNotification(notification: Omit<Notification, 'id' | 'read' | 'created_at' | 'updated_at'>) {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          ...notification,
          read: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error: any) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  // Mark notification as read
  async markAsRead(notificationId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({
          read: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', notificationId);

      if (error) throw error;
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Mark all notifications as read
  async markAllAsRead(userId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({
          read: true,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;
    } catch (error: any) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  // Delete notification
  async deleteNotification(notificationId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;
    } catch (error: any) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  // Get unread notifications count
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;
      return count || 0;
    } catch (error: any) {
      console.error('Error getting unread notifications count:', error);
      throw error;
    }
  },

  // Get notifications for user
  async getNotifications(userId: string, limit = 50, offset = 0): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error getting notifications:', error);
      throw error;
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
        message: `Project "${projectTitle}" has been completed.`
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