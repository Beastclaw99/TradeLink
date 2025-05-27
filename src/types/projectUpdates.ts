
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
