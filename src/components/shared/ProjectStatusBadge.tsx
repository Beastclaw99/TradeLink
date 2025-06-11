import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, AlertCircle, Users, Play, Pause, FileText, Upload, RefreshCw, Archive, AlertTriangle } from 'lucide-react';

interface ProjectStatusBadgeProps {
  status: string;
  variant?: 'default' | 'large';
  showIcon?: boolean;
}

const ProjectStatusBadge: React.FC<ProjectStatusBadgeProps> = ({ 
  status, 
  variant = 'default',
  showIcon = true 
}) => {
  const getStatusConfig = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    
    switch (normalizedStatus) {
      case 'draft':
        return {
          variant: 'outline' as const,
          className: 'border-gray-500 text-gray-700 bg-gray-50',
          icon: FileText,
          label: 'Draft'
        };
      case 'open':
        return {
          variant: 'outline' as const,
          className: 'border-blue-500 text-blue-700 bg-blue-50',
          icon: Clock,
          label: 'Open'
        };
      case 'assigned':
        return {
          variant: 'default' as const,
          className: 'bg-yellow-500 text-white',
          icon: Users,
          label: 'Assigned'
        };
      case 'in_progress':
        return {
          variant: 'default' as const,
          className: 'bg-blue-500 text-white',
          icon: Play,
          label: 'In Progress'
        };
      case 'work_submitted':
        return {
          variant: 'default' as const,
          className: 'bg-purple-500 text-white',
          icon: Upload,
          label: 'Work Submitted'
        };
      case 'work_revision_requested':
        return {
          variant: 'outline' as const,
          className: 'border-orange-500 text-orange-700 bg-orange-50',
          icon: RefreshCw,
          label: 'Revision Requested'
        };
      case 'work_approved':
        return {
          variant: 'default' as const,
          className: 'bg-green-500 text-white',
          icon: CheckCircle,
          label: 'Work Approved'
        };
      case 'completed':
        return {
          variant: 'default' as const,
          className: 'bg-emerald-500 text-white',
          icon: CheckCircle,
          label: 'Completed'
        };
      case 'archived':
        return {
          variant: 'outline' as const,
          className: 'border-gray-500 text-gray-700 bg-gray-50',
          icon: Archive,
          label: 'Archived'
        };
      case 'cancelled':
        return {
          variant: 'outline' as const,
          className: 'border-red-500 text-red-700 bg-red-50',
          icon: AlertCircle,
          label: 'Cancelled'
        };
      case 'disputed':
        return {
          variant: 'outline' as const,
          className: 'border-rose-500 text-rose-700 bg-rose-50',
          icon: AlertTriangle,
          label: 'Disputed'
        };
      default:
        return {
          variant: 'outline' as const,
          className: 'border-gray-500 text-gray-700 bg-gray-50',
          icon: Clock,
          label: status
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge 
      variant={config.variant}
      className={`${config.className} ${
        variant === 'large' ? 'px-3 py-1 text-sm' : 'px-2 py-1 text-xs'
      } inline-flex items-center gap-1`}
    >
      {showIcon && <Icon className={variant === 'large' ? 'h-4 w-4' : 'h-3 w-3'} />}
      {config.label}
    </Badge>
  );
};

export default ProjectStatusBadge;
