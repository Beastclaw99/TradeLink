
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus } from 'lucide-react';
import { Project, Application, Profile } from '@/types/database';
import ProjectCard from './projects/ProjectCard';

interface EditedProject {
  title: string;
  description: string;
  budget: string;
}

interface ProjectsTabProps {
  isLoading: boolean;
  projects: Project[];
  applications: Application[];
  editProject: Project | null;
  projectToDelete: string | null;
  editedProject: EditedProject;
  isSubmitting: boolean;
  setEditedProject: (project: EditedProject) => void;
  handleEditInitiate: (project: Project) => void;
  handleEditCancel: () => void;
  handleUpdateProject: (project: Project) => Promise<void>;
  handleDeleteInitiate: (projectId: string) => void;
  handleDeleteCancel: () => void;
  handleDeleteProject: (projectId: string) => Promise<void>;
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
  onAddMilestone: (projectId: string, milestone: any) => Promise<any>;
  onEditMilestone: (projectId: string, milestoneId: string, updates: any) => Promise<any>;
  handleDeleteMilestone: (projectId: string, milestoneId: string) => Promise<void>;
  handleAddTask: () => Promise<void>;
  handleUpdateTask: () => Promise<void>;
  handleDeleteTask: () => Promise<void>;
  fetchProjectDetails: (projectId: string) => Promise<any>;
  error: string | null;
  onEditProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  profile: Profile | null;
  handleAddMilestone: (projectId: string, milestone: any) => Promise<any>;
  handleEditMilestone: (projectId: string, milestoneId: string, updates: any) => Promise<any>;
  // Add callback for data refresh after status updates
  onDataRefresh?: () => void;
}

const ProjectsTab: React.FC<ProjectsTabProps> = ({
  isLoading,
  projects,
  applications,
  handleEditInitiate,
  handleDeleteInitiate,
  onDataRefresh
}) => {
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
          <Button>
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
        <Button>
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
            onEdit={handleEditInitiate}
            onDelete={handleDeleteInitiate}
            onStatusUpdate={onDataRefresh} // Pass the refresh callback
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectsTab;
