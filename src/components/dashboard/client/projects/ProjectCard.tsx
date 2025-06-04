
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, MapPin, Users, Edit, Trash2, Eye } from "lucide-react";
import { format } from "date-fns";
import { Project } from '../../types';
import EditProjectForm from './EditProjectForm';

interface ProjectCardProps {
  project: Project;
  isEditing: boolean;
  editedProject: any;
  isSubmitting: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onUpdate: (updates: any) => Promise<void>;
  onDelete: () => void;
  onViewApplications: () => void;
  onEditedProjectChange: (field: string, value: any) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  isEditing,
  editedProject,
  isSubmitting,
  onEdit,
  onCancelEdit,
  onUpdate,
  onDelete,
  onViewApplications,
  onEditedProjectChange,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'archived': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isEditing) {
    return (
      <Card>
        <EditProjectForm
          project={project}
          editedProject={editedProject}
          isSubmitting={isSubmitting}
          onCancel={onCancelEdit}
          onSave={onUpdate}
          onFieldChange={onEditedProjectChange}
        />
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{project.title}</CardTitle>
          <Badge className={getStatusColor(project.status)}>
            {project.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-gray-600 line-clamp-3">{project.description}</p>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-gray-500">
            <DollarSign className="w-4 h-4 mr-2" />
            ${project.budget?.toLocaleString() || 'N/A'}
          </div>
          
          {project.location && (
            <div className="flex items-center text-gray-500">
              <MapPin className="w-4 h-4 mr-2" />
              {project.location}
            </div>
          )}
          
          {project.deadline && (
            <div className="flex items-center text-gray-500">
              <Calendar className="w-4 h-4 mr-2" />
              {format(new Date(project.deadline), 'MMM dd, yyyy')}
            </div>
          )}
          
          <div className="flex items-center text-gray-500">
            <Users className="w-4 h-4 mr-2" />
            {project.status === 'open' ? 'Open' : 'Assigned'}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={onDelete}>
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </div>
        
        <Button size="sm" onClick={onViewApplications}>
          <Eye className="w-4 h-4 mr-1" />
          View Applications
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
