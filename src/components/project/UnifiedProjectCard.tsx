import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Project } from '@/types/database';
import { MapPin, DollarSign, Calendar, Clock, Target, AlertTriangle, CheckCircle } from 'lucide-react';

interface UnifiedProjectCardProps {
  project: Project;
  onViewDetails: (projectId: string) => void;
  onApply?: (projectId: string) => void;
  onUpdateStatus?: (projectId: string, newStatus: string) => void;
  isClient?: boolean;
  isProfessional?: boolean;
}

const UnifiedProjectCard: React.FC<UnifiedProjectCardProps> = ({
  project,
  onViewDetails,
  onApply,
  onUpdateStatus,
  isClient = false,
  isProfessional = false
}) => {
  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'review':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'assigned':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyColor = (urgency: string | null) => {
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

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'assigned':
        return <Target className="h-4 w-4 text-blue-600" />;
      case 'open':
        return <Clock className="h-4 w-4 text-gray-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <CardTitle className="text-xl">{project.title}</CardTitle>
              <div className="flex items-center gap-2">
                {getStatusIcon(project.status)}
                <Badge variant="outline" className="capitalize">
                  {project.status?.replace('_', ' ')}
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
                {new Date(project.created_at || '').toLocaleDateString()}
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
        <div className="space-y-4">
          {project.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {project.description}
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            {project.category && (
              <Badge variant="outline" className="text-xs">
                {project.category}
              </Badge>
            )}
            {project.recommended_skills && project.recommended_skills.split(',').map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {skill.trim()}
              </Badge>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(project.id)}
            >
              View Details
            </Button>
            
            {onApply && project.status === 'open' && (
              <Button
                size="sm"
                onClick={() => onApply(project.id)}
              >
                Apply Now
              </Button>
            )}

            {onUpdateStatus && isProfessional && project.status === 'assigned' && (
              <Button
                size="sm"
                onClick={() => onUpdateStatus(project.id, 'in_progress')}
              >
                Start Project
              </Button>
            )}

            {onUpdateStatus && isProfessional && project.status === 'in_progress' && (
              <Button
                size="sm"
                onClick={() => onUpdateStatus(project.id, 'review')}
              >
                Submit for Review
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UnifiedProjectCard; 