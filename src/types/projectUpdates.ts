
export type ProjectStatus = 
  | 'draft'
  | 'open' 
  | 'assigned'
  | 'in_progress'
  | 'work_submitted'
  | 'work_revision_requested'
  | 'work_approved'
  | 'completed'
  | 'archived'
  | 'cancelled'
  | 'disputed';

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

export interface ProjectUpdate {
  id: string;
  project_id: string;
  user_id?: string;
  professional_id?: string;
  update_type: UpdateType;
  message?: string;
  status_update?: string;
  file_url?: string;
  file_name?: string;
  metadata?: any;
  created_at: string;
  profiles?: {
    first_name: string;
    last_name: string;
  };
}

export interface StatusUpdate {
  id: string;
  project_id: string;
  professional_id: string | null;
  message?: string;
  file_url?: string;
  file_name?: string;
  status_update?: string;
  update_type?: string;
  metadata?: any;
  created_at: string | null;
  profiles?: {
    first_name: string;
    last_name: string;
  } | null;
}
