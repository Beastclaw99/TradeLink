
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
  | 'cancelled'
  | 'disputed';

export type PaymentStatus =
  | 'pending'     // Payment is pending
  | 'processing'  // Payment is being processed
  | 'completed'   // Payment has been completed
  | 'failed'      // Payment has failed
  | 'refunded';   // Payment has been refunded

export type UpdateType =
  | 'message'                 // General message
  | 'status_change'           // Status change notification
  | 'file_upload'            // File uploaded
  | 'site_check'             // Site visit check
  | 'start_time'             // Work started
  | 'completion_note'        // Work completion note
  | 'check_in'               // Professional checked in
  | 'check_out'              // Professional checked out
  | 'on_my_way'              // Professional is on the way
  | 'delayed'                // Work is delayed
  | 'cancelled'              // Work is cancelled
  | 'revisit_required'       // Site revisit required
  | 'expense_submitted'      // Expense submitted
  | 'expense_approved'       // Expense approved
  | 'payment_processed'      // Payment processed
  | 'schedule_updated'       // Schedule updated
  | 'task_completed'         // Task completed
  | 'custom_field_updated';  // Custom field updated

export interface StatusMetadata {
  previous_status?: ProjectStatus;
  cancellation_reason?: string;
  dispute_reason?: string;
  revision_notes?: string;
  [key: string]: any;
}

export interface ProjectUpdate {
  id: string;
  project_id: string | null;
  professional_id: string | null;
  update_type: string | null;
  message: string | null;
  status_update: string | null;
  file_url: string | null;
  metadata: any | null;
  created_at: string;
}

export interface ProjectUpdateComment {
  id: string;
  update_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  attachments: string[];
}
