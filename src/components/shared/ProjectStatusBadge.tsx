import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ProjectStatus } from '@/types/database';
import {
  FileText,
  Clock,
  Users,
  Play,
  Upload,
  RefreshCw,
  CheckCircle,
  Archive,
  AlertCircle,
  AlertTriangle
} from 'lucide-react';

interface ProjectStatusBadgeProps {
  status: ProjectStatus | null;
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  showIcon?: boolean;
}

const ProjectStatusBadge = ({ 
  status, 
  variant = 'default',
  showIcon = true 
}: ProjectStatusBadgeProps) => {
  const getStatusConfig = (status: ProjectStatus | null) => {
    switch (status) {
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
          icon: FileText,
          label: 'Archived'
        };
      case 'cancelled':
        return {
          variant: 'destructive' as const,
          className: 'bg-red-500 text-white',
          icon: FileText,
          label: 'Cancelled'
        };
      case 'disputed':
        return {
          variant: 'destructive' as const,
          className: 'bg-rose-500 text-white',
          icon: FileText,
          label: 'Disputed'
        };
      default:
        return {
          variant: 'outline' as const,
          className: 'border-gray-500 text-gray-700 bg-gray-50',
          icon: FileText,
          label: 'Unknown'
        };
    }
  };

  const statusConfig = getStatusConfig(status);
  const Icon = statusConfig.icon;

  return (
    <Badge 
      variant={statusConfig.variant} 
      className={statusConfig.className}
    >
      <div className="flex items-center gap-1">
        {showIcon && <Icon className="h-3 w-3" />}
        <span>{statusConfig.label}</span>
      </div>
    </Badge>
  );
};

export default ProjectStatusBadge;
