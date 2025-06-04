import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Project } from '../../types';
import EditProjectForm from './EditProjectForm';

export interface ProjectCardProps {
  project: Project;
  editProject: Project | null;
  editedProject: {
    title: string;
    description: string;
    budget: number | null;
  } | null;
  isSubmitting: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSave: (updates: Partial<Project>) => Promise<void>;
  onDelete: () => void;
  applications?: any[];
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  editProject,
  editedProject,
  isSubmitting,
  onEdit,
  onCancelEdit,
  onSave,
  onDelete,
  applications = []
}) => {
  const isEditing = editProject?.id === project.id;

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  if (isEditing && editedProject) {
    return (
      <EditProjectForm
        project={project}
        editedProject={editedProject}
        isSubmitting={isSubmitting}
        onCancel={onCancelEdit}
        onSave={async (updates) => {
          await onSave(updates);
        }}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{project.title}</CardTitle>
        <CardDescription className="flex items-center justify-between">
          <span>Posted on {new Date(project.created_at || '').toLocaleDateString()}</span>
          <Badge className={getStatusColor(project.status)}>
            {project.status}
          </Badge>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">{project.description}</p>
        <p className="font-medium">Budget: ${project.budget}</p>
        {project.location && (
          <p className="text-sm text-gray-600">Location: {project.location}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onEdit}>
          Edit
        </Button>
        <Button variant="destructive" onClick={onDelete}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
