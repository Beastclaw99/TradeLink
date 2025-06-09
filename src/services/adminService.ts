import { supabase } from '@/integrations/supabase/client';
import { AdminProfile, AdminAction, AdminPermission } from '@/types/admin';

export async function getAdminProfile(adminId: string): Promise<AdminProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', adminId)
    .eq('role', 'admin')
    .single();

  if (error) {
    console.error('Error fetching admin profile:', error);
    throw error;
  }

  return data as AdminProfile;
}

export async function updateAdminProfile(
  adminId: string,
  updates: Partial<AdminProfile>
): Promise<AdminProfile> {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', adminId)
    .eq('role', 'admin')
    .select()
    .single();

  if (error) {
    console.error('Error updating admin profile:', error);
    throw error;
  }

  return data as AdminProfile;
}

export async function logAdminAction(
  adminId: string,
  action: Omit<AdminAction, 'id' | 'admin_id' | 'created_at'>
): Promise<AdminAction> {
  const { data, error } = await supabase
    .from('admin_actions')
    .insert({
      admin_id: adminId,
      ...action,
      ip_address: window.location.hostname,
      user_agent: navigator.userAgent
    })
    .select()
    .single();

  if (error) {
    console.error('Error logging admin action:', error);
    throw error;
  }

  return data as AdminAction;
}

export async function getAdminActions(
  adminId: string,
  options: {
    limit?: number;
    offset?: number;
    targetType?: string;
    targetId?: string;
  } = {}
): Promise<AdminAction[]> {
  let query = supabase
    .from('admin_actions')
    .select('*')
    .eq('admin_id', adminId)
    .order('created_at', { ascending: false });

  if (options.targetType) {
    query = query.eq('target_type', options.targetType);
  }

  if (options.targetId) {
    query = query.eq('target_id', options.targetId);
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  if (options.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching admin actions:', error);
    throw error;
  }

  return data as AdminAction[];
}

export async function updateAdminPermissions(
  adminId: string,
  permissions: AdminPermission[]
): Promise<AdminProfile> {
  const { data, error } = await supabase
    .from('profiles')
    .update({ admin_permissions: permissions })
    .eq('id', adminId)
    .eq('role', 'admin')
    .select()
    .single();

  if (error) {
    console.error('Error updating admin permissions:', error);
    throw error;
  }

  return data as AdminProfile;
}

export async function updateAdminStatus(
  adminId: string,
  status: 'active' | 'inactive' | 'suspended'
): Promise<AdminProfile> {
  const { data, error } = await supabase
    .from('profiles')
    .update({ admin_status: status })
    .eq('id', adminId)
    .eq('role', 'admin')
    .select()
    .single();

  if (error) {
    console.error('Error updating admin status:', error);
    throw error;
  }

  return data as AdminProfile;
} 