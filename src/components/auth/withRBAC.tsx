import React from 'react';
import { useRBAC } from '@/hooks/useRBAC';
import { Permission, UserRole } from '@/types/auth';

interface RBACProps {
  requiredPermissions?: Permission[];
  requiredRole?: UserRole;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function withRBAC<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithRBACComponent(props: P & RBACProps) {
    const {
      requiredPermissions = [],
      requiredRole,
      fallback = null,
      children,
      ...rest
    } = props;

    const {
      hasAllPermissions,
      isRole,
      userRole,
      userPermissions
    } = useRBAC();

    const hasRequiredPermissions = requiredPermissions.length === 0 || 
      hasAllPermissions(requiredPermissions);

    const hasRequiredRole = !requiredRole || isRole(requiredRole);

    if (!hasRequiredPermissions || !hasRequiredRole) {
      return fallback;
    }

    return (
      <WrappedComponent
        {...rest as P}
        userRole={userRole}
        userPermissions={userPermissions}
      >
        {children}
      </WrappedComponent>
    );
  };
}

export function RBACGuard({
  requiredPermissions = [],
  requiredRole,
  fallback = null,
  children
}: RBACProps) {
  const {
    hasAllPermissions,
    isRole
  } = useRBAC();

  const hasRequiredPermissions = requiredPermissions.length === 0 || 
    hasAllPermissions(requiredPermissions);

  const hasRequiredRole = !requiredRole || isRole(requiredRole);

  if (!hasRequiredPermissions || !hasRequiredRole) {
    return fallback;
  }

  return <>{children}</>;
} 