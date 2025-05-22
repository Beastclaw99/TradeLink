
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from 'lucide-react';
import { Project } from '../../types';
import { Application } from '../../types';

interface ProjectCardProps {
  project: Project;
  applications: Application[];
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  applications,
  onEdit,
  onDelete
}) => {
  const isOpen = project.status === 'open';
  const applicationCount = applications.filter(app => app.project_id === project.id).length;
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="mr-2">{project.title}</CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => onEdit(project)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-red-500" 
              onClick={() => onDelete(project.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription className="flex items-center justify-between">
          <span>Posted on {new Date(project.created_at || '').toLocaleDateString()}</span>
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
            {isOpen ? 'Open' : 'In Progress'}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-ttc-neutral-600 mb-4">{project.description}</p>
        <p className="font-medium">Budget: ${project.budget}</p>
        
        <div className="mt-4">
          <p className="text-sm font-medium">
            {applicationCount} applications
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
