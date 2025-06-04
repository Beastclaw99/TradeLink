import { Project } from '../types';
import { ProjectCard } from './ProjectCard';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface ProjectListProps {
  projects: Project[];
  isLoading?: boolean;
  onEditInitiate?: (project: Project) => void;
  onDeleteInitiate?: (projectId: string) => void;
  onApply?: (projectId: string) => void;
  onComplete?: (projectId: string) => void;
}

export const ProjectList = ({ 
  projects, 
  isLoading = false,
  onEditInitiate,
  onDeleteInitiate,
  onApply,
  onComplete 
}: ProjectListProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Projects</h2>
        {onEditInitiate && onDeleteInitiate && (
          <Button onClick={() => navigate('/professional/projects/new')}>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map(project => (
          <ProjectCard
            key={project.id}
            project={project}
            onEditInitiate={onEditInitiate}
            onDeleteInitiate={onDeleteInitiate}
            onApply={onApply}
            onComplete={onComplete}
          />
        ))}
      </div>
    </div>
  );
}; 