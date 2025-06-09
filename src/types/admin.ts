export type AdminPermission = 
  | 'manage_users'
  | 'manage_projects'
  | 'manage_reviews'
  | 'manage_disputes'
  | 'manage_payments'
  | 'view_analytics'
  | 'manage_settings';

export type AdminStatus = 'active' | 'inactive' | 'suspended';

export interface AdminProfile {
  id: string;
  role: 'admin';
  admin_permissions: AdminPermission[];
  admin_notes?: string;
  last_admin_action?: string;
  admin_status: AdminStatus;
  // Inherited from base profile
  bio?: string;
  location?: string;
  phone?: string;
  email?: string;
  profile_image?: string;
  verification_status: 'verified';
}

export interface AdminAction {
  id: string;
  admin_id: string;
  action_type: string;
  target_type: string;
  target_id: string;
  action_details?: Record<string, any>;
  created_at: string;
  ip_address?: string;
  user_agent?: string;
}

export interface AdminActionLog {
  action: AdminAction;
  admin: AdminProfile;
} 