
import { supabase } from '@/integrations/supabase/client';
import { notificationService } from './notificationService';

export interface Dispute {
  id: string;
  project_id: string;
  work_version_id: string;
  initiator_id: string;
  respondent_id: string;
  status: 'open' | 'under_review' | 'resolved' | 'closed';
  type: 'quality' | 'timeline' | 'payment' | 'other';
  title: string;
  description: string;
  resolution: string | null;
  resolved_at: string | null;
  resolved_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface DisputeDocument {
  id: string;
  dispute_id: string;
  file_id: string;
  uploaded_by: string;
  description: string | null;
  created_at: string;
}

export interface DisputeMessage {
  id: string;
  dispute_id: string;
  sender_id: string;
  content: string;
  is_internal: boolean;
  created_at: string;
}

export interface DisputeStatusHistory {
  id: string;
  dispute_id: string;
  status: Dispute['status'];
  changed_by: string;
  reason: string | null;
  created_at: string;
}

export const disputeService = {
  // Create a new dispute
  async createDispute(
    projectId: string,
    workVersionId: string,
    respondentId: string,
    type: Dispute['type'],
    title: string,
    description: string
  ): Promise<Dispute> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data: dispute, error } = await supabase
      .from('disputes')
      .insert({
        project_id: projectId,
        work_version_id: workVersionId,
        initiator_id: user.user.id,
        respondent_id: respondentId,
        status: 'open',
        type,
        title,
        description
      })
      .select()
      .single();

    if (error) throw error;

    // Create initial status history
    await this.addStatusHistory(dispute.id, 'open', 'Dispute created');

    // Notify respondent
    await notificationService.createNotification({
      user_id: respondentId,
      type: 'warning',
      title: 'New Dispute Created',
      message: `A new dispute has been created: ${title}`,
      metadata: {
        dispute_id: dispute.id,
        project_id: projectId
      }
    });

    return dispute as Dispute;
  },

  // Get dispute details
  async getDispute(id: string): Promise<Dispute> {
    const { data, error } = await supabase
      .from('disputes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Dispute;
  },

  // Get disputes for a project
  async getProjectDisputes(projectId: string): Promise<Dispute[]> {
    const { data, error } = await supabase
      .from('disputes')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Dispute[];
  },

  // Update dispute status
  async updateDisputeStatus(
    id: string,
    status: Dispute['status'],
    reason: string
  ): Promise<Dispute> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data: dispute, error } = await supabase
      .from('disputes')
      .update({
        status,
        ...(status === 'resolved' && {
          resolved_at: new Date().toISOString(),
          resolved_by: user.user.id
        })
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Add status history
    await this.addStatusHistory(id, status, reason);

    // Notify relevant users
    const notificationData = {
      title: `Dispute ${status}`,
      message: `Dispute "${dispute.title}" has been ${status}`,
      metadata: {
        dispute_id: id,
        project_id: dispute.project_id
      }
    };

    await Promise.all([
      notificationService.createNotification({
        ...notificationData,
        user_id: dispute.initiator_id,
        type: 'info'
      }),
      notificationService.createNotification({
        ...notificationData,
        user_id: dispute.respondent_id,
        type: 'info'
      })
    ]);

    return dispute as Dispute;
  },

  // Add resolution to dispute
  async addResolution(
    id: string,
    resolution: string
  ): Promise<Dispute> {
    const { data: dispute, error } = await supabase
      .from('disputes')
      .update({
        resolution,
        status: 'resolved',
        resolved_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Add status history
    await this.addStatusHistory(id, 'resolved', 'Resolution added');

    // Notify users
    const notificationData = {
      title: 'Dispute Resolved',
      message: `Dispute "${dispute.title}" has been resolved`,
      metadata: {
        dispute_id: id,
        project_id: dispute.project_id
      }
    };

    await Promise.all([
      notificationService.createNotification({
        ...notificationData,
        user_id: dispute.initiator_id,
        type: 'success'
      }),
      notificationService.createNotification({
        ...notificationData,
        user_id: dispute.respondent_id,
        type: 'success'
      })
    ]);

    return dispute as Dispute;
  },

  // Add document to dispute
  async addDocument(
    disputeId: string,
    fileId: string,
    description: string | null = null
  ): Promise<DisputeDocument> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('dispute_documents')
      .insert({
        dispute_id: disputeId,
        file_id: fileId,
        uploaded_by: user.user.id,
        description
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get dispute documents
  async getDisputeDocuments(disputeId: string): Promise<DisputeDocument[]> {
    const { data, error } = await supabase
      .from('dispute_documents')
      .select('*')
      .eq('dispute_id', disputeId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Add message to dispute
  async addMessage(
    disputeId: string,
    content: string,
    isInternal: boolean = false
  ): Promise<DisputeMessage> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('dispute_messages')
      .insert({
        dispute_id: disputeId,
        sender_id: user.user.id,
        content,
        is_internal: isInternal
      })
      .select()
      .single();

    if (error) throw error;

    // Notify other party
    const { data: dispute } = await supabase
      .from('disputes')
      .select('initiator_id, respondent_id')
      .eq('id', disputeId)
      .single();

    const recipientId = dispute.initiator_id === user.user.id
      ? dispute.respondent_id
      : dispute.initiator_id;

    await notificationService.createNotification({
      user_id: recipientId,
      type: 'info',
      title: 'New Dispute Message',
      message: 'You have received a new message in a dispute',
      metadata: {
        dispute_id: disputeId
      }
    });

    return data;
  },

  // Get dispute messages
  async getDisputeMessages(disputeId: string): Promise<DisputeMessage[]> {
    const { data, error } = await supabase
      .from('dispute_messages')
      .select('*')
      .eq('dispute_id', disputeId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Add status history
  async addStatusHistory(
    disputeId: string,
    status: Dispute['status'],
    reason: string | null = null
  ): Promise<DisputeStatusHistory> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('dispute_status_history')
      .insert({
        dispute_id: disputeId,
        status,
        changed_by: user.user.id,
        reason
      })
      .select()
      .single();

    if (error) throw error;
    return data as DisputeStatusHistory;
  },

  // Get status history
  async getStatusHistory(disputeId: string): Promise<DisputeStatusHistory[]> {
    const { data, error } = await supabase
      .from('dispute_status_history')
      .select('*')
      .eq('dispute_id', disputeId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data as DisputeStatusHistory[];
  }
};
