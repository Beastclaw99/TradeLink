
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus } from 'lucide-react';
import { Project, Application, Profile } from '@/types/database';
import ProjectCard from './projects/ProjectCard';
import { useNavigate } from 'react-router-dom';

interface ProjectsTabProps {
  isLoading: boolean;
  projects: Project[];
  applications: Application[];
  handleDeleteInitiate: (projectId: string) => void;
  // Add callback for data refresh after status updates
  onDataRefresh?: () => void;
}

const ProjectsTab: React.FC<ProjectsTabProps> = ({
  isLoading,
  projects,
  applications,
  handleDeleteInitiate,
  onDataRefresh
}) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Plus className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Projects Yet</h3>
          <p className="text-gray-600 mb-4">
            Create your first project to start working with professionals.
          </p>
          <Button onClick={() => navigate('/create-project')}>
            <Plus className="w-4 h-4 mr-2" />
            Create Project
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Projects</h2>
        <Button onClick={() => navigate('/create-project')}>
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      <div className="grid gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            applications={applications}
            onDelete={handleDeleteInitiate}
            onStatusUpdate={onDataRefresh}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectsTab;
