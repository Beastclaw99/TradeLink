
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, DollarSign, User, Clock, Star } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Project } from '@/components/dashboard/types';

export type ProjectStatus = 'not_started' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';

interface UnifiedProjectCardProps {
  project: Project;
  variant: 'card' | 'list';
  isProfessional: boolean;
  actionLabel: string;
  onAction?: (projectId: string) => void;
  showMilestones?: boolean;
}

const UnifiedProjectCard: React.FC<UnifiedProjectCardProps> = ({
  project,
  variant,
  isProfessional,
  actionLabel,
  onAction,
  showMilestones = false
}) => {
  const navigate = useNavigate();
  const [showFullDescription, setShowFullDescription] = useState(false);

  const handleAction = () => {
    if (onAction) {
      onAction(project.id);
    } else {
      navigate(`/projects/${project.id}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency?.toLowerCase()) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const truncatedDescription = project.description?.length > 200 
    ? project.description.substring(0, 200) + '...'
    : project.description;

  if (variant === 'list') {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold">{project.title}</h3>
                <Badge className={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
                {project.urgency && (
                  <Badge className={getUrgencyColor(project.urgency)}>
                    {project.urgency}
                  </Badge>
                )}
              </div>
              
              <p className="text-gray-600 mb-3">
                {showFullDescription ? project.description : truncatedDescription}
                {project.description && project.description.length > 200 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-blue-600 hover:text-blue-800 ml-2"
                  >
                    {showFullDescription ? 'Show less' : 'Show more'}
                  </button>
                )}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                {project.location && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {project.location}
                  </div>
                )}
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {format(new Date(project.created_at), 'MMM d, yyyy')}
                </div>
                {project.deadline && (
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Due: {format(new Date(project.deadline), 'MMM d, yyyy')}
                  </div>
                )}
              </div>
            </div>

            <div className="text-right ml-4">
              <div className="text-xl font-bold text-green-600 mb-2">
                ${project.budget?.toLocaleString()}
              </div>
              <Button onClick={handleAction} size="sm">
                {actionLabel}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl mb-2">{project.title}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(project.status)}>
                {project.status}
              </Badge>
              {project.urgency && (
                <Badge className={getUrgencyColor(project.urgency)}>
                  {project.urgency}
                </Badge>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              ${project.budget?.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">Budget</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <p className="text-gray-700">
            {showFullDescription ? project.description : truncatedDescription}
          </p>
          {project.description && project.description.length > 200 && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-blue-600 hover:text-blue-800 text-sm mt-1"
            >
              {showFullDescription ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {project.location && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              {project.location}
            </div>
          )}
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            {format(new Date(project.created_at), 'MMM d, yyyy')}
          </div>
          {project.deadline && (
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              Due: {format(new Date(project.deadline), 'MMM d, yyyy')}
            </div>
          )}
          {project.category && (
            <div className="flex items-center text-sm text-gray-600">
              <User className="w-4 h-4 mr-2" />
              {project.category}
            </div>
          )}
        </div>

        {project.requirements && project.requirements.length > 0 && (
          <div>
            <h4 className="font-medium text-sm text-gray-700 mb-2">Requirements:</h4>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              {project.requirements.slice(0, 3).map((req, index) => (
                <li key={index}>{req}</li>
              ))}
              {project.requirements.length > 3 && (
                <li className="text-blue-600">+ {project.requirements.length - 3} more</li>
              )}
            </ul>
          </div>
        )}

        <div className="pt-4 border-t">
          <Button onClick={handleAction} className="w-full">
            {actionLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UnifiedProjectCard;
