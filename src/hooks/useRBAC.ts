import { useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Permission, UserRole, DEFAULT_ROLE_PERMISSIONS } from '@/types/auth';

export function useRBAC() {
  const { user } = useAuth();

  const userRole = useMemo<UserRole>(() => {
    if (!user) return 'user';
    return user.role || 'user';
  }, [user]);

  const userPermissions = useMemo<Permission[]>(() => {
    if (!user) return DEFAULT_ROLE_PERMISSIONS.user;
    return DEFAULT_ROLE_PERMISSIONS[userRole] || DEFAULT_ROLE_PERMISSIONS.user;
  }, [user, userRole]);

  const hasPermission = (permission: Permission): boolean => {
    return userPermissions.includes(permission);
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  };

  const isRole = (role: UserRole): boolean => {
    return userRole === role;
  };

  const isAdmin = (): boolean => {
    return isRole('admin');
  };

  const isProfessional = (): boolean => {
    return isRole('professional');
  };

  const isClient = (): boolean => {
    return isRole('client');
  };

  return {
    userRole,
    userPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isRole,
    isAdmin,
    isProfessional,
    isClient
  };
} 