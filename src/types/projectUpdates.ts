import { ProjectStatus, ProjectStatusUpdate } from './database';

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
  | 'photo_update'           // Photo update
  | 'milestone_completed'    // Milestone completed
  | 'on_track'              // Project on track
  | 'meeting'               // Meeting update
  | 'document_uploaded'     // Document uploaded
  | 'document_reviewed'     // Document reviewed
  | 'issue_reported'        // Issue reported
  | 'issue_resolved';       // Issue resolved

export interface StatusMetadata {
  previous_status?: ProjectStatus;
  cancellation_reason?: string;
  dispute_reason?: string;
  revision_notes?: string;
}

// Metadata types for project update actions
export interface ExpenseMetadata {
  amount: string;
  description: string;
}

export interface DelayMetadata {
  delay_reason: string;
}

export interface LocationMetadata {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

// Union type for project update metadata
export type ProjectUpdateMetadata =
  | ExpenseMetadata
  | DelayMetadata
  | LocationMetadata
  | Record<string, never>;

export interface ExtendedProjectUpdate extends Omit<ProjectStatusUpdate, 'metadata'> {
  metadata: StatusMetadata;
  profiles?: {
    first_name: string | null;
    last_name: string | null;
    profile_image: string | null;
  };
}
