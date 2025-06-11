import { ProjectStatus, ProjectUpdate as DBProjectUpdate } from './database';

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
  | 'custom_field_updated';

export interface StatusMetadata {
  previous_status?: ProjectStatus;
  cancellation_reason?: string;
  dispute_reason?: string;
  revision_notes?: string;
  [key: string]: any;
}

export interface ProjectUpdate extends DBProjectUpdate {
  profiles?: {
    first_name: string | null;
    last_name: string | null;
    profile_image: string | null;
  };
}
