
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
  description: string | null;
  created_at: string;
}

export interface DisputeStatusHistory {
  id: string;
  dispute_id: string;
  status: 'open' | 'under_review' | 'resolved' | 'closed';
  changed_by: string;
  reason: string | null;
  created_at: string;
}

class DisputeService {
  async createDispute(
    projectId: string,
    workVersionId: string,
    respondentId: string,
    type: Dispute['type'],
    title: string,
    description: string
  ): Promise<Dispute> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('disputes')
      .insert({
        project_id: projectId,
        work_version_id: workVersionId,
        initiator_id: user.id,
        respondent_id: respondentId,
        type,
        title,
        description,
        status: 'open'
      })
      .select()
      .single();

    if (error) throw error;

    // Create initial status history entry
    await supabase
      .from('dispute_status_history')
      .insert({
        dispute_id: data.id,
        status: 'open',
        changed_by: user.id,
        reason: 'Dispute created'
      });

    // Send notification to respondent
    await notificationService.createNotification(
      respondentId,
      'info',
      'New Dispute Created',
      `A new dispute has been created for project: ${title}`
    );

    return data as Dispute;
  }

  async getDispute(disputeId: string): Promise<Dispute> {
    const { data, error } = await supabase
      .from('disputes')
      .select('*')
      .eq('id', disputeId)
      .single();

    if (error) throw error;
    return data as Dispute;
  }

  async getProjectDisputes(projectId: string): Promise<Dispute[]> {
    const { data, error } = await supabase
      .from('disputes')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as Dispute[];
  }

  async updateDisputeStatus(
    disputeId: string,
    status: Dispute['status'],
    reason?: string
  ): Promise<Dispute> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('disputes')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', disputeId)
      .select()
      .single();

    if (error) throw error;

    // Add to status history
    await supabase
      .from('dispute_status_history')
      .insert({
        dispute_id: disputeId,
        status,
        changed_by: user.id,
        reason
      });

    // Send notifications
    const dispute = data as Dispute;
    const recipients = [dispute.initiator_id, dispute.respondent_id].filter(id => id !== user.id);
    
    for (const recipientId of recipients) {
      await notificationService.createNotification(
        recipientId,
        'info',
        'Dispute Status Updated',
        `Dispute status changed to: ${status}`
      );
    }

    return dispute;
  }

  async addResolution(disputeId: string, resolution: string): Promise<Dispute> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('disputes')
      .update({
        resolution,
        resolved_at: new Date().toISOString(),
        resolved_by: user.id,
        status: 'resolved',
        updated_at: new Date().toISOString()
      })
      .eq('id', disputeId)
      .select()
      .single();

    if (error) throw error;

    // Add to status history
    await supabase
      .from('dispute_status_history')
      .insert({
        dispute_id: disputeId,
        status: 'resolved',
        changed_by: user.id,
        reason: 'Resolution added'
      });

    // Send notifications
    const dispute = data as Dispute;
    const recipients = [dispute.initiator_id, dispute.respondent_id].filter(id => id !== user.id);
    
    for (const recipientId of recipients) {
      await notificationService.createNotification(
        recipientId,
        'info',
        'Dispute Resolved',
        `A resolution has been added to the dispute: ${dispute.title}`
      );
    }

    return dispute;
  }

  async getDisputeMessages(disputeId: string): Promise<DisputeMessage[]> {
    const { data, error } = await supabase
      .from('dispute_messages')
      .select('*')
      .eq('dispute_id', disputeId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async addMessage(disputeId: string, content: string, isInternal = false): Promise<DisputeMessage> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('dispute_messages')
      .insert({
        dispute_id: disputeId,
        sender_id: user.id,
        content,
        is_internal: isInternal
      })
      .select()
      .single();

    if (error) throw error;

    // Send notification to other parties
    const { data: dispute } = await supabase
      .from('disputes')
      .select('initiator_id, respondent_id, title')
      .eq('id', disputeId)
      .single();

    if (dispute) {
      const recipients = [dispute.initiator_id, dispute.respondent_id].filter(id => id !== user.id);
      
      for (const recipientId of recipients) {
        await notificationService.createNotification(
          recipientId,
          'info',
          'New Dispute Message',
          `New message in dispute: ${dispute.title}`
        );
      }
    }

    return data;
  }

  async getDisputeDocuments(disputeId: string): Promise<DisputeDocument[]> {
    const { data, error } = await supabase
      .from('dispute_documents')
      .select('*')
      .eq('dispute_id', disputeId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async addDocument(
    disputeId: string,
    fileId: string,
    description?: string
  ): Promise<DisputeDocument> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('dispute_documents')
      .insert({
        dispute_id: disputeId,
        file_id: fileId,
        uploaded_by: user.id,
        description
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getStatusHistory(disputeId: string): Promise<DisputeStatusHistory[]> {
    const { data, error } = await supabase
      .from('dispute_status_history')
      .select('*')
      .eq('dispute_id', disputeId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as DisputeStatusHistory[];
  }
}

export const disputeService = new DisputeService();
