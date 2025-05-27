
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, MapPin, DollarSign, User, Clock } from 'lucide-react';

interface ProjectSummaryCardProps {
  project: {
    id: string;
    title: string;
    description: string;
    category: string;
    budget: string;
    location: string;
    status: string;
    timeline: string;
    clientName?: string;
    clientAvatar?: string;
    createdAt: string;
    applicationsCount?: number;
  };
  onViewDetails?: (projectId: string) => void;
  onApply?: (projectId: string) => void;
  showApplyButton?: boolean;
  variant?: 'default' | 'compact';
}

const ProjectSummaryCard: React.FC<ProjectSummaryCardProps> = ({
  project,
  onViewDetails,
  onApply,
  showApplyButton = false,
  variant = 'default'
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (variant === 'compact') {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg truncate pr-2">{project.title}</h3>
            <Badge className={getStatusColor(project.status)}>
              {project.status.replace('_', ' ')}
            </Badge>
          </div>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {project.description}
          </p>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {project.location}
            </div>
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-1" />
              {project.budget}
            </div>
          </div>
          
          {(onViewDetails || showApplyButton) && (
            <div className="flex space-x-2 mt-3">
              {onViewDetails && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDetails(project.id)}
                  className="flex-1"
                >
                  View Details
                </Button>
              )}
              {showApplyButton && onApply && (
                <Button
                  size="sm"
                  onClick={() => onApply(project.id)}
                  className="flex-1"
                >
                  Apply
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{project.title}</CardTitle>
            <Badge className={`${getStatusColor(project.status)} mb-2`}>
              {project.status.replace('_', ' ')}
            </Badge>
          </div>
          <Badge variant="outline">{project.category}</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-gray-600 line-clamp-3">{project.description}</p>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            {project.location}
          </div>
          <div className="flex items-center text-gray-600">
            <DollarSign className="h-4 w-4 mr-2" />
            {project.budget}
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            {project.timeline}
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            {new Date(project.createdAt).toLocaleDateString()}
          </div>
        </div>
        
        {project.clientName && (
          <div className="flex items-center space-x-3 pt-2 border-t">
            <Avatar className="h-8 w-8">
              <AvatarImage src={project.clientAvatar} alt={project.clientName} />
              <AvatarFallback>
                {project.clientName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{project.clientName}</p>
              <p className="text-xs text-gray-500">Project Client</p>
            </div>
          </div>
        )}
        
        {project.applicationsCount !== undefined && (
          <div className="flex items-center text-sm text-gray-600">
            <User className="h-4 w-4 mr-2" />
            {project.applicationsCount} application{project.applicationsCount !== 1 ? 's' : ''}
          </div>
        )}
      </CardContent>
      
      {(onViewDetails || showApplyButton) && (
        <CardFooter className="space-x-2">
          {onViewDetails && (
            <Button
              variant="outline"
              onClick={() => onViewDetails(project.id)}
              className="flex-1"
            >
              View Details
            </Button>
          )}
          {showApplyButton && onApply && (
            <Button
              onClick={() => onApply(project.id)}
              className="flex-1"
            >
              Apply for Project
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default ProjectSummaryCard;
