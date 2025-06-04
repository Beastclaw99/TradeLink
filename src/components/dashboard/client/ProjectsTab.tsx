import React from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Project } from '../types';
import ProjectCard from './projects/ProjectCard';
import AssignedProjectCard from './projects/AssignedProjectCard';
import EditProjectForm from './projects/EditProjectForm';
import EmptyProjectState from './projects/EmptyProjectState';

interface ProjectsTabProps {
  isLoading: boolean;
  projects: Project[];
  applications: any[];
  editProject: Project | null;
  projectToDelete: string | null;
  editedProject: {
    title: string;
    description: string;
    budget: number | null;
  };
  isSubmitting: boolean;
  setEditedProject: (project: { title: string; description: string; budget: number | null }) => void;
  handleEditInitiate: (project: Project) => void;
  handleEditCancel: () => void;
  handleUpdateProject: (projectId: string, updates: Partial<Project>) => void;
  handleDeleteInitiate: (projectId: string) => void;
  handleDeleteCancel: () => void;
  handleDeleteProject: (projectId: string) => void;
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
  handleDeleteProject
}) => {
  const openProjects = projects.filter(p => p.status === 'open');
  const assignedProjects = projects.filter(p => p.status === 'assigned');
  
  const navigateToCreateTab = () => {
    const createTab = document.querySelector('[data-value="create"]');
    if (createTab) {
      (createTab as HTMLElement).click();
    }
  };
  
  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Your Open Projects</h2>
      {isLoading ? (
        <p>Loading your projects...</p>
      ) : openProjects.length === 0 ? (
        <EmptyProjectState 
          message="You don't have any open projects." 
          showCreateButton={true}
          onCreateClick={navigateToCreateTab}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {openProjects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              editProject={editProject}
              editedProject={editedProject}
              isSubmitting={isSubmitting}
              applications={applications}
              onEdit={() => handleEditInitiate(project)}
              onCancelEdit={handleEditCancel}
              onSave={async (updates: Partial<Project>) => {
                const processedUpdates = { ...updates };
                const updatedProject = { ...project, ...processedUpdates };
                handleUpdateProject(updatedProject.id, updatedProject);
              }}
              onDelete={() => handleDeleteInitiate(project.id)}
            />
          ))}
        </div>
      )}
      
      <h2 className="text-2xl font-bold mb-4 mt-8">Assigned Projects</h2>
      {assignedProjects.length === 0 ? (
        <EmptyProjectState message="You don't have any assigned projects." />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {assignedProjects.map(project => {
            // Find the accepted application for this project
            const acceptedApp = applications.find(app => 
              app.project_id === project.id && app.status === 'accepted'
            );
            
            return (
              <AssignedProjectCard 
                key={project.id}
                project={project}
                acceptedApp={acceptedApp}
              />
            );
          })}
        </div>
      )}
      
      {/* Edit Project Form */}
      {editProject && (
        <EditProjectForm
          project={editProject}
          editedProject={editedProject}
          isSubmitting={isSubmitting}
          onCancel={handleEditCancel}
          onUpdate={handleUpdateProject}
          onChange={setEditedProject}
        />
      )}
      
      {/* Delete Project Confirmation Dialog */}
      {projectToDelete && (
        <AlertDialog open={!!projectToDelete} onOpenChange={() => handleDeleteCancel()}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this project?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button variant="outline" onClick={() => handleDeleteCancel()}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => handleDeleteProject(projectToDelete)}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Deleting..." : "Delete Project"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};

export default ProjectsTab;
