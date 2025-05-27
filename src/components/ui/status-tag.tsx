
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type StatusTagVariant = 
  | 'pending' 
  | 'approved' 
  | 'rejected' 
  | 'completed' 
  | 'in-progress' 
  | 'cancelled'
  | 'verified'
  | 'expired'
  | 'low'
  | 'medium'
  | 'high'
  | 'urgent';

interface StatusTagProps {
  variant: StatusTagVariant;
  children: React.ReactNode;
  className?: string;
}

const statusVariants = {
  // Project/Application Status
  pending: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  approved: 'bg-green-100 text-green-800 hover:bg-green-200',
  rejected: 'bg-red-100 text-red-800 hover:bg-red-200',
  completed: 'bg-green-100 text-green-800 hover:bg-green-200',
  'in-progress': 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  cancelled: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  
  // Compliance Status
  verified: 'bg-green-100 text-green-800 hover:bg-green-200',
  expired: 'bg-red-100 text-red-800 hover:bg-red-200',
  
  // Priority Levels
  low: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  medium: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  high: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
  urgent: 'bg-red-100 text-red-800 hover:bg-red-200',
};

export const StatusTag: React.FC<StatusTagProps> = ({
  variant,
  children,
  className
}) => {
  return (
    <Badge
      className={cn(
        statusVariants[variant],
        'font-medium',
        className
      )}
    >
      {children}
    </Badge>
  );
};

export default StatusTag;
