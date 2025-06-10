
import { supabase } from '@/integrations/supabase/client';
import { notificationService } from './notificationService';

export interface Dispute {
  id: string;
  project_id: string;
  initiator_id: string;
  respondent_id: string;
  title: string;
  description: string;
  type: 'quality' | 'timeline' | 'payment' | 'communication' | 'scope' | 'other';
  status: 'open' | 'in_review' | 'resolved' | 'escalated' | 'closed';
  work_version_id?: string;
  resolution?: string;
  resolved_by?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface DisputeMessage {
  id: string;
  dispute_id: string;
  sender_id: string;
  content: string;
  is_internal: boolean;
  created_at: string;
}

export interface DisputeDocument {
  id: string;
  dispute_id: string;
  file_id: string;
  uploaded_by: string;
  description?: string;
  created_at: string;
}

export interface DisputeStatusHistory {
  id: string;
  dispute_id: string;
  status: Dispute['status'];
  changed_by: string;
  reason?: string;
  created_at: string;
}

export const disputeService = {
  // Create a new dispute
  async createDispute(disputeData: Omit<Dispute, 'id' | 'created_at' | 'updated_at'>): Promise<Dispute> {
    const { data, error } = await supabase
      .from('disputes')
      .insert({
        ...disputeData,
        work_version_id: disputeData.work_version_id || null
      })
      .select()
      .single();

    if (error) throw error;

    // Create notification for respondent
    await notificationService.createNotification({
      user_id: disputeData.respondent_id,
      title: 'New Dispute Filed',
      message: `A dispute has been filed against project: ${disputeData.title}`,
      type: 'info'
    });

    return data as Dispute;
  },

  // Get dispute by ID
  async getDispute(disputeId: string): Promise<Dispute | null> {
    const { data, error } = await supabase
      .from('disputes')
      .select('*')
      .eq('id', disputeId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data as Dispute;
  },

  // Get disputes for a user
  async getUserDisputes(userId: string): Promise<Dispute[]> {
    const { data, error } = await supabase
      .from('disputes')
      .select('*')
      .or(`initiator_id.eq.${userId},respondent_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as Dispute[];
  },

  // Get disputes for a project
  async getProjectDisputes(projectId: string): Promise<Dispute[]> {
    const { data, error } = await supabase
      .from('disputes')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as Dispute[];
  },

  // Update dispute status
  async updateDisputeStatus(disputeId: string, status: Dispute['status'], resolution?: string): Promise<Dispute> {
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

    // Record status change in history
    await supabase
      .from('dispute_status_history')
      .insert({
        dispute_id: disputeId,
        status,
        changed_by: (await supabase.auth.getUser()).data.user?.id
      });

    return data as Dispute;
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
  async addResolution(disputeId: string, resolution: string): Promise<Dispute> {
    return this.updateDisputeStatus(disputeId, 'resolved', resolution);
  }
};
