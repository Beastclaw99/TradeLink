
// Re-export the main types to ensure consistency
export type {
  Project,
  Application,
  Payment,
  Review,
  Notification
} from '@/types';

export interface Professional {
  id: string;
  first_name?: string;
  last_name?: string;
  skills?: string[];
  rating?: number;
  account_type: 'professional';
  created_at: string;
  updated_at?: string;
}

export interface Client {
  id: string;
  first_name?: string;
  last_name?: string;
  account_type: 'client';
  created_at: string;
  updated_at?: string;
}
