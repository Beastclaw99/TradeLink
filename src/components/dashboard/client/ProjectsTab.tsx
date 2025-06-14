import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Calendar, DollarSign, MapPin, User, AlertCircle } from 'lucide-react';
import { Project, Application, Profile } from '@/types/database';

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
}

const ProjectsTab: React.FC<ProjectsTabProps> = ({
  isLoading,
  projects,
  applications,
  editProject,
  projectToDelete,
  editedProject,
  isSubmitting,
  setEditedProject,
  handleEditInitiate,
  handleEditCancel,
  handleUpdateProject,
  handleDeleteInitiate,
  handleDeleteCancel,
  handleDeleteProject,
  selectedProject,
  setSelectedProject,
  onAddMilestone,
  onEditMilestone,
  handleDeleteMilestone,
  handleAddTask,
  handleUpdateTask,
  handleDeleteTask,
  fetchProjectDetails,
  error,
  onEditProject,
  onDeleteProject,
  profile,
  handleAddMilestone,
  handleEditMilestone
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
        {projects.map((project) => {
          const projectApplications = applications.filter(app => app.project_id === project.id);
          
          return (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{project.title}</CardTitle>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {project.created_at && new Date(project.created_at).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        ${project.budget}
                      </span>
                      {project.location && (
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {project.location}
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge 
                    variant={
                      project.status === 'completed' ? 'default' :
                      project.status === 'in_progress' ? 'secondary' :
                      project.status === 'open' ? 'outline' :
                      'destructive'
                    }
                  >
                    {project.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-700 mb-4">{project.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {projectApplications.length} application{projectApplications.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    {project.status === 'draft' && (
                      <Button size="sm">
                        Edit
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectsTab;
