import { supabase } from '@/integrations/supabase/client';
import { notificationService } from './notificationService';
import { DisputeCategory, DisputeStatus, Dispute as DBDispute } from '@/types/database';

export interface ExtendedDispute extends DBDispute {
  initiator?: {
    first_name?: string;
    last_name?: string;
  };
  respondent?: {
    first_name?: string;
    last_name?: string;
  };
  project?: {
    title?: string;
  };
  mediator?: {
    first_name?: string;
    last_name?: string;
  };
}

export interface DisputeDocument {
  id: string;
  dispute_id: string;
  file_id: string;
  uploaded_by: string;
  description?: string;
  created_at: string;
}

// Re-export the database Dispute type
export type { DBDispute as Dispute };

export interface DisputeMessage {
  id: string;
  dispute_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export interface DisputeStatusHistory {
  id: string;
  dispute_id: string;
  old_status: DisputeStatus;
  new_status: DisputeStatus;
  changed_by: string;
  reason?: string;
  created_at: string;
}

export const disputeService = {
  // Create a new dispute
  async createDispute(disputeData: Omit<DBDispute, 'id' | 'created_at' | 'updated_at'>): Promise<DBDispute> {
    const { data, error } = await supabase
      .from('disputes')
      .insert(disputeData)
      .select()
      .single();

    if (error) throw error;

    // Create notification for the respondent
    await notificationService.createNotification({
      user_id: data.respondent_id,
      title: 'New Dispute Filed',
      message: `A dispute has been filed against project: ${data.title}`,
      type: 'warning'
    });

    return data as DBDispute;
  },

  // Get dispute by ID
  async getDispute(disputeId: string): Promise<DBDispute | null> {
    const { data, error } = await supabase
      .from('disputes')
      .select()
      .eq('id', disputeId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data as DBDispute;
  },

  // Get disputes for a user
  async getUserDisputes(userId: string): Promise<DBDispute[]> {
    const { data, error } = await supabase
      .from('disputes')
      .select()
      .or(`initiator_id.eq.${userId},respondent_id.eq.${userId}`);

    if (error) throw error;
    return (data || []) as DBDispute[];
  },

  // Get disputes for a project
  async getProjectDisputes(projectId: string): Promise<DBDispute[]> {
    const { data, error } = await supabase
      .from('disputes')
      .select()
      .eq('project_id', projectId);

    if (error) throw error;
    return (data || []) as DBDispute[];
  },

  // Update dispute status
  async updateDisputeStatus(disputeId: string, status: DisputeStatus, resolution?: string): Promise<DBDispute> {
    const updateData: any = { status };
    if (resolution) {
      updateData.resolution = resolution;
      updateData.resolved_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('disputes')
      .update(updateData)
      .eq('id', disputeId)
      .select()
      .single();

    if (error) throw error;

    // Create status change notification
    await notificationService.createNotification({
      user_id: data.initiator_id,
      title: 'Dispute Status Updated',
      message: `The status of dispute "${data.title}" has been updated to ${status}`,
      type: 'info'
    });

    await notificationService.createNotification({
      user_id: data.respondent_id,
      title: 'Dispute Status Updated',
      message: `The status of dispute "${data.title}" has been updated to ${status}`,
      type: 'info'
    });

    return data as DBDispute;
  },

  // Add message to dispute
  async addDisputeMessage(disputeId: string, content: string, isInternal: boolean = false): Promise<DisputeMessage> {
    const { data, error } = await supabase
      .from('dispute_messages')
      .insert({
        dispute_id: disputeId,
        sender_id: (await supabase.auth.getUser()).data.user?.id,
        content,
        is_internal: isInternal
      })
      .select()
      .single();

    if (error) throw error;
    return data as DisputeMessage;
  },

  // Add message (alias)
  async addMessage(disputeId: string, content: string): Promise<DisputeMessage> {
    return this.addDisputeMessage(disputeId, content);
  },

  // Get dispute messages
  async getDisputeMessages(disputeId: string): Promise<DisputeMessage[]> {
    const { data, error } = await supabase
      .from('dispute_messages')
      .select('*')
      .eq('dispute_id', disputeId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data || []) as DisputeMessage[];
  },

  // Add document to dispute
  async addDisputeDocument(disputeId: string, fileId: string, description?: string): Promise<DisputeDocument> {
    const { data, error } = await supabase
      .from('dispute_documents')
      .insert({
        dispute_id: disputeId,
        file_id: fileId,
        uploaded_by: (await supabase.auth.getUser()).data.user?.id,
        description
      })
      .select()
      .single();

    if (error) throw error;
    return data as DisputeDocument;
  },

  // Add document (alias)
  async addDocument(disputeId: string, fileId: string, description?: string): Promise<DisputeDocument> {
    return this.addDisputeDocument(disputeId, fileId, description);
  },

  // Get dispute documents
  async getDisputeDocuments(disputeId: string): Promise<DisputeDocument[]> {
    const { data, error } = await supabase
      .from('dispute_documents')
      .select('*')
      .eq('dispute_id', disputeId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as DisputeDocument[];
  },

  // Get status history
  async getStatusHistory(disputeId: string): Promise<DisputeStatusHistory[]> {
    const { data, error } = await supabase
      .from('dispute_status_history')
      .select('*')
      .eq('dispute_id', disputeId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as DisputeStatusHistory[];
  },

  // Add resolution
  async addResolution(disputeId: string, resolution: string): Promise<DBDispute> {
    return this.updateDisputeStatus(disputeId, 'resolved', resolution);
  }
};
