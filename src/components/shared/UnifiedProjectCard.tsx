import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, CheckCircle2, Link2, ListChecks, User2, Calendar, DollarSign, MapPin, Clock, Target, AlertTriangle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Database } from '@/integrations/supabase/types';
import { Project, ProjectStatus } from '@/types/database';
import { formatDateToLocale } from '@/utils/dateUtils';

type Project = Database['public']['Tables']['projects']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

interface UnifiedProjectCardProps {
  project: Project;
  variant?: 'card' | 'list';
  userType: 'professional';
  userSkills?: string[];
  actionLabel?: string;
  onClick?: () => void;
  client?: Profile;
  onViewDetails: (projectId: string) => void;
  onApply?: (projectId: string) => void;
  onUpdateStatus?: (projectId: string, newStatus: ProjectStatus) => void;
  isClient?: boolean;
  isProfessional?: boolean;
}

interface StatusConfig {
  label: string;
  variant: 'default' | 'secondary' | 'outline' | 'destructive';
  icon: React.ReactNode;
  color: string;
}

const getStatusConfig = (status: ProjectStatus | null): StatusConfig => {
  switch (status) {
    case 'open':
      return {
        label: 'Open',
        variant: 'default',
        icon: <Clock className="h-4 w-4 text-blue-600" />,
        color: 'bg-blue-100 text-blue-800 border-blue-200'
      };
    case 'assigned':
      return {
        label: 'Assigned',
        variant: 'secondary',
        icon: <Target className="h-4 w-4 text-purple-600" />,
        color: 'bg-purple-100 text-purple-800 border-purple-200'
      };
    case 'completed':
      return {
        label: 'Completed',
        variant: 'default',
        icon: <CheckCircle className="h-4 w-4 text-green-600" />,
        color: 'bg-green-100 text-green-800 border-green-200'
      };
    case 'cancelled':
      return {
        label: 'Cancelled',
        variant: 'destructive',
        icon: <AlertTriangle className="h-4 w-4 text-red-600" />,
        color: 'bg-red-100 text-red-800 border-red-200'
      };
    case 'disputed':
      return {
        label: 'Disputed',
        variant: 'destructive',
        icon: <AlertTriangle className="h-4 w-4 text-red-600" />,
        color: 'bg-red-100 text-red-800 border-red-200'
      };
    case 'draft':
      return {
        label: 'Draft',
        variant: 'outline',
        icon: <Clock className="h-4 w-4 text-gray-600" />,
        color: 'bg-gray-100 text-gray-800 border-gray-200'
      };
    case 'in_progress':
      return {
        label: 'In Progress',
        variant: 'secondary',
        icon: <Clock className="h-4 w-4 text-yellow-600" />,
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
      };
    case 'work_submitted':
      return {
        label: 'Work Submitted',
        variant: 'secondary',
        icon: <Clock className="h-4 w-4 text-indigo-600" />,
        color: 'bg-indigo-100 text-indigo-800 border-indigo-200'
      };
    case 'work_revision_requested':
      return {
        label: 'Revision Requested',
        variant: 'destructive',
        icon: <AlertTriangle className="h-4 w-4 text-orange-600" />,
        color: 'bg-orange-100 text-orange-800 border-orange-200'
      };
    case 'work_approved':
      return {
        label: 'Work Approved',
        variant: 'default',
        icon: <CheckCircle className="h-4 w-4 text-green-600" />,
        color: 'bg-green-100 text-green-800 border-green-200'
      };
    case 'archived':
      return {
        label: 'Archived',
        variant: 'outline',
        icon: <Clock className="h-4 w-4 text-gray-600" />,
        color: 'bg-gray-100 text-gray-800 border-gray-200'
      };
    default:
      return {
        label: 'Unknown',
        variant: 'outline',
        icon: <AlertTriangle className="h-4 w-4 text-gray-600" />,
        color: 'bg-gray-100 text-gray-800 border-gray-200'
      };
  }
};

const UnifiedProjectCard: React.FC<UnifiedProjectCardProps> = ({ 
  project, 
  variant = 'card',
  userType,
  userSkills = [],
  actionLabel = "View Project",
  onClick,
  client,
  onViewDetails,
  onApply,
  onUpdateStatus,
  isClient = false,
  isProfessional = false
}) => {
  const navigate = useNavigate();

  const statusConfig = getStatusConfig(project.status);

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/projects/${project.id}`);
    }
  };

  const getProjectType = (): 'open' | 'applied' | 'assigned' | 'completed' => {
    if (project.assigned_to) return 'assigned';
    if (project.status === 'completed') return 'completed';
    return 'open';
  };

  const projectType = getProjectType();

  const projectSkills = project.requirements || [];
  const matchingSkills = projectSkills.filter((skill: string) => userSkills.includes(skill));
  const hasMatchingSkills = matchingSkills.length > 0;

  const getUrgencyColor = (urgency: string | null): string => {
    switch (urgency?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card onClick={handleCardClick} className="hover:cursor-pointer">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <CardTitle className="text-xl">{project.title}</CardTitle>
              <div className="flex items-center gap-2">
                {statusConfig.icon}
                <Badge variant={statusConfig.variant} className={statusConfig.color}>
                  {statusConfig.label}
                </Badge>
                {project.urgency && (
                  <Badge className={`border ${getUrgencyColor(project.urgency)}`}>
                    {project.urgency} Priority
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDateToLocale(project.created_at)}
              </span>
              {project.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {project.location}
                </span>
              )}
              {project.budget && (
                <span className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  ${project.budget.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onViewDetails(project.id)}
          >
            View Details
          </Button>
          {onApply && (
            <Button
              onClick={() => onApply(project.id)}
              disabled={project.status !== 'open'}
            >
              Apply Now
            </Button>
          )}
          {onUpdateStatus && project.status && (
            <Button
              variant="secondary"
              onClick={() => onUpdateStatus(project.id, project.status)}
            >
              Update Status
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UnifiedProjectCard;
