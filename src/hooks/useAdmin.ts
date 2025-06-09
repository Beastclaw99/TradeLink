import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AdminProfile, AdminAction, AdminPermission } from '@/types/admin';
import * as adminService from '@/services/adminService';

export function useAdmin() {
  const { user } = useAuth();
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (user) {
      loadAdminProfile();
    } else {
      setAdminProfile(null);
      setLoading(false);
    }
  }, [user]);

  const loadAdminProfile = async () => {
    try {
      setLoading(true);
      const profile = await adminService.getAdminProfile(user!.id);
      setAdminProfile(profile);
      setError(null);
    } catch (err) {
      setError(err as Error);
      setAdminProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<AdminProfile>) => {
    try {
      setLoading(true);
      const updated = await adminService.updateAdminProfile(user!.id, updates);
      setAdminProfile(updated);
      setError(null);
      return updated;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logAction = async (action: Omit<AdminAction, 'id' | 'admin_id' | 'created_at'>) => {
    try {
      return await adminService.logAdminAction(user!.id, action);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const getActions = async (options?: {
    limit?: number;
    offset?: number;
    targetType?: string;
    targetId?: string;
  }) => {
    try {
      return await adminService.getAdminActions(user!.id, options);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const updatePermissions = async (permissions: AdminPermission[]) => {
    try {
      setLoading(true);
      const updated = await adminService.updateAdminPermissions(user!.id, permissions);
      setAdminProfile(updated);
      setError(null);
      return updated;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status: 'active' | 'inactive' | 'suspended') => {
    try {
      setLoading(true);
      const updated = await adminService.updateAdminStatus(user!.id, status);
      setAdminProfile(updated);
      setError(null);
      return updated;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (permission: AdminPermission): boolean => {
    return adminProfile?.admin_permissions.includes(permission) ?? false;
  };

  return {
    adminProfile,
    loading,
    error,
    updateProfile,
    logAction,
    getActions,
    updatePermissions,
    updateStatus,
    hasPermission,
    refresh: loadAdminProfile
  };
} 