export type UserRole = 'user' | 'professional' | 'admin';

export type BasePermission = 
  | 'view_profile'
  | 'edit_profile'
  | 'view_projects'
  | 'create_project'
  | 'edit_project'
  | 'delete_project'
  | 'view_messages'
  | 'send_messages'
  | 'view_reviews'
  | 'create_review'
  | 'edit_review'
  | 'delete_review';

export type ProfessionalPermission = 
  | BasePermission
  | 'manage_portfolio'
  | 'manage_availability'
  | 'manage_services'
  | 'view_earnings'
  | 'manage_milestones'
  | 'manage_tasks';

export type ClientPermission = 
  | BasePermission
  | 'manage_budget'
  | 'manage_payments'
  | 'manage_disputes'
  | 'view_invoices'
  | 'manage_project_members';

export type AdminPermission = 
  | BasePermission
  | 'manage_users'
  | 'manage_projects'
  | 'manage_reviews'
  | 'manage_disputes'
  | 'manage_payments'
  | 'view_analytics'
  | 'manage_settings'
  | 'manage_roles'
  | 'view_logs';

export type Permission = BasePermission | ProfessionalPermission | ClientPermission | AdminPermission;

export interface RolePermissions {
  user: BasePermission[];
  professional: ProfessionalPermission[];
  client: ClientPermission[];
  admin: AdminPermission[];
}

export const DEFAULT_ROLE_PERMISSIONS: RolePermissions = {
  user: [
    'view_profile',
    'edit_profile',
    'view_projects',
    'view_messages',
    'send_messages',
    'view_reviews',
    'create_review'
  ],
  professional: [
    'view_profile',
    'edit_profile',
    'view_projects',
    'create_project',
    'edit_project',
    'view_messages',
    'send_messages',
    'view_reviews',
    'create_review',
    'manage_portfolio',
    'manage_availability',
    'manage_services',
    'view_earnings',
    'manage_milestones',
    'manage_tasks'
  ],
  client: [
    'view_profile',
    'edit_profile',
    'view_projects',
    'create_project',
    'edit_project',
    'delete_project',
    'view_messages',
    'send_messages',
    'view_reviews',
    'create_review',
    'manage_budget',
    'manage_payments',
    'manage_disputes',
    'view_invoices',
    'manage_project_members'
  ],
  admin: [
    'view_profile',
    'edit_profile',
    'view_projects',
    'create_project',
    'edit_project',
    'delete_project',
    'view_messages',
    'send_messages',
    'view_reviews',
    'create_review',
    'edit_review',
    'delete_review',
    'manage_users',
    'manage_projects',
    'manage_reviews',
    'manage_disputes',
    'manage_payments',
    'view_analytics',
    'manage_settings',
    'manage_roles',
    'view_logs'
  ]
}; 