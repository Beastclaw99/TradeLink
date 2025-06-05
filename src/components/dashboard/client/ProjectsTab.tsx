import React from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Project } from '../types';
import UnifiedProjectCard from '@/components/shared/UnifiedProjectCard';
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
    budget: string;
  };
  isSubmitting: boolean;
  setEditedProject: (project: { title: string; description: string; budget: string }) => void;
  handleEditInitiate: (project: Project) => void;
  handleEditCancel: () => void;
  handleUpdateProject: (project: Project) => void;
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
        <div className="space-y-4">
          {openProjects.map(project => (
            <UnifiedProjectCard
              key={project.id}
              project={project}
              variant="list"
              isProfessional={false}
              actionLabel="View Details"
            />
          ))}
        </div>
      )}
      
      <h2 className="text-2xl font-bold mb-4 mt-8">Assigned Projects</h2>
      {isLoading ? (
        <p>Loading your projects...</p>
      ) : assignedProjects.length === 0 ? (
        <EmptyProjectState message="You don't have any assigned projects." />
      ) : (
        <div className="space-y-4">
          {assignedProjects.map(project => (
            <UnifiedProjectCard
              key={project.id}
              project={project}
              variant="list"
              isProfessional={false}
              actionLabel="View Details"
            />
          ))}
        </div>
      )}
      
      {/* Edit Project Form */}
      {editProject && (
        <EditProjectForm
          editProject={editProject}
          editedProject={editedProject}
          isSubmitting={isSubmitting}
          onCancel={handleEditCancel}
          onUpdate={handleUpdateProject}
          onChange={setEditedProject}
        />
      )}
      
      {/* Delete Project Confirmation Dialog */}
      <AlertDialog open={!!projectToDelete} onOpenChange={() => handleDeleteCancel()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={handleDeleteCancel}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => projectToDelete && handleDeleteProject(projectToDelete)}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProjectsTab;
