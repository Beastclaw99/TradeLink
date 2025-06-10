export type ProjectStatus =
  | 'draft'                   // Project is in draft mode
  | 'open'                    // Project is open for applications
  | 'assigned'                // Project has been assigned to a professional
  | 'in_progress'             // Work is in progress
  | 'work_submitted'          // Professional has submitted work for review
  | 'work_revision_requested' // Client has requested revisions
  | 'work_approved'           // Client has approved the work
  | 'completed'               // Project is completed but pending mutual reviews
  | 'archived'                // Project is archived after mutual reviews
  | 'cancelled'               // Project was cancelled
  | 'disputed';               // Project is in dispute

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
  project_id: string;
  update_type: UpdateType;
  message?: string;
  status_update?: ProjectStatus;
  file_url?: string;
  file_name?: string;
  created_at: string;
  professional_id: string;
  metadata?: StatusMetadata;
  profiles?: {
    first_name: string | null;
    last_name: string | null;
    profile_image: string | null;
  };
}
