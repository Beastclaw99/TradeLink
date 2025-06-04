export type ProjectStatus =
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
  | 'custom_field_updated'   // Custom field updated
  | 'work_submitted'         // Work submitted for review
  | 'work_revision_requested' // Work revision requested
  | 'work_approved';         // Work approved

interface ProjectUpdateMetadata {
  checked_by?: string;
  geolocation?: {
    latitude: number;
    longitude: number;
  };
  amount?: number;
  description?: string;
  task_name?: string;
  field_name?: string;
  field_value?: string;
  delay_reason?: string;
  cancelled_by?: string;
  new_time?: string;
}

export interface ProjectUpdate {
  id: string;
  project_id: string;
  update_type: UpdateType;
  message?: string;
  status_update?: string;
  file_url?: string;
  created_at: string;
  professional_id: string;
  metadata?: ProjectUpdateMetadata;
  profiles?: {
    first_name: string;
    last_name: string;
  };
}
