
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database } from '@/integrations/supabase/types';
import { Loader2, Plus } from 'lucide-react';
import ProjectCard from './projects/ProjectCard';

type Project = Database['public']['Tables']['projects']['Row'];
type Application = Database['public']['Tables']['applications']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

interface ProjectsTabProps {
  isLoading: boolean;
  projects: Project[];
  applications: Application[];
  onEditProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  fetchProjectDetails: (projectId: string) => Promise<void>;
}

const ProjectsTab: React.FC<ProjectsTabProps> = ({ 
  isLoading, 
  projects, 
  applications,
  onEditProject,
  onDeleteProject,
  fetchProjectDetails
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Plus className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
          <p className="text-gray-500 mb-4">Create your first project to get started.</p>
          <Button onClick={() => window.location.href = '/projects/new'}>
            Create Project
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          applications={applications.filter(app => app.project_id === project.id)}
          onEdit={onEditProject}
          onDelete={onDeleteProject}
        />
      ))}
    </div>
  );
};

export default ProjectsTab;
