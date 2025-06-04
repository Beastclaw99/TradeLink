
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, MapPin, User, Edit, Trash2, CheckCircle, Send } from 'lucide-react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onEditInitiate: (project: Project) => void;
  onDeleteInitiate: (projectId: string) => void;
  onApply?: (projectId: string) => void;
  onComplete?: (projectId: string) => void;
}

export const ProjectCard = ({ 
  project, 
  onEditInitiate, 
  onDeleteInitiate,
  onApply,
  onComplete 
}: ProjectCardProps) => {
  const formatBudget = (budget: number | null) => {
    if (!budget) return 'Budget not specified';
    return `$${budget.toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const canComplete = project.status === 'in-progress' && onComplete;
  const canApply = project.status === 'open' && onApply;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{project.title}</CardTitle>
            <CardDescription className="mt-1">
              {project.description?.substring(0, 100)}
              {project.description && project.description.length > 100 && '...'}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(project.status)}>
            {project.status.replace('-', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="h-4 w-4 mr-2" />
            {formatBudget(project.budget)}
          </div>
          
          {project.location && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              {project.location}
            </div>
          )}
          
          {project.client && (
            <div className="flex items-center text-sm text-gray-600">
              <User className="h-4 w-4 mr-2" />
              {project.client.first_name} {project.client.last_name}
            </div>
          )}
          
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            {new Date(project.created_at).toLocaleDateString()}
          </div>
        </div>

        <div className="mt-4 flex gap-2 flex-wrap">
          {canApply && (
            <Button
              size="sm"
              onClick={() => onApply(project.id)}
              className="flex items-center gap-1"
            >
              <Send className="h-3 w-3" />
              Apply
            </Button>
          )}
          
          {canComplete && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onComplete(project.id)}
              className="flex items-center gap-1"
            >
              <CheckCircle className="h-3 w-3" />
              Complete
            </Button>
          )}
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEditInitiate(project)}
            className="flex items-center gap-1"
          >
            <Edit className="h-3 w-3" />
            Edit
          </Button>
          
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDeleteInitiate(project.id)}
            className="flex items-center gap-1"
          >
            <Trash2 className="h-3 w-3" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
