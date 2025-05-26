export interface ProjectUpdate {
  id: string;
  project_id: string;
  update_type: string;
  message?: string;
  status_update?: string;
  file_url?: string;
  file_name?: string;
  created_at: string;
  created_by?: string;
  metadata?: {
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
  };
}

export type UpdateType =
  | 'message'
  | 'status_change'
  | 'file_upload'
  | 'site_check'
  | 'start_time'
  | 'completion_note'
  | 'check_in'
  | 'check_out'
  | 'on_my_way'
  | 'delayed'
  | 'cancelled'
  | 'revisit_required'
  | 'expense_submitted'
  | 'expense_approved'
  | 'payment_processed'
  | 'schedule_updated'
  | 'task_completed'
  | 'custom_field_updated'; 