
import React from 'react';
import { Project } from '../types';
import ProjectCard from '../client/projects/ProjectCard';
import AssignedProjectCard from '../client/projects/AssignedProjectCard';
import EmptyProjectState from '../client/projects/EmptyProjectState';

interface ProjectsTabProps {
  projects: Project[];
  editProject: Project | null;
  projectToDelete: string | null;
  editedProject: {
    title: string;
    description: string;
    budget: string;
  } | null;
  isSubmitting: boolean;
  onEditInitiate: (project: Project) => void;
  onEditCancel: () => void;
  onUpdateProject: (projectId: string, updates: Partial<Project>) => Promise<void>;
  onDeleteInitiate: (projectId: string) => void;
  onDeleteCancel: () => void;
  onDeleteProject: (projectId: string) => Promise<void>;
  onReviewInitiate: (projectId: string) => void;
}

export const ProjectsTab: React.FC<ProjectsTabProps> = ({
  projects,
  editProject,
  projectToDelete,
  editedProject,
  isSubmitting,
  onEditInitiate,
  onEditCancel,
  onUpdateProject,
  onDeleteInitiate,
  onDeleteCancel,
  onDeleteProject,
  onReviewInitiate,
}) => {
  // Separate projects by status
  const openProjects = projects.filter(p => p.status === 'open');
  const assignedProjects = projects.filter(p => 
    ['assigned', 'in-progress', 'submitted', 'revision'].includes(p.status)
  );
  const completedProjects = projects.filter(p => 
    ['completed', 'paid'].includes(p.status)
  );

  const handleReviewSubmit = async (projectId: string, data: { rating?: number; comment?: string; }) => {
    // For now, we'll just call the review initiate function
    // In a full implementation, this would submit the actual review
    onReviewInitiate(projectId);
  };

  if (projects.length === 0) {
    return <EmptyProjectState message="No projects found. Create your first project to get started!" />;
  }

  return (
    <div className="space-y-8">
      {/* Open Projects */}
      {openProjects.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Open Projects ({openProjects.length})</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {openProjects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                isEditing={editProject?.id === project.id}
                editedProject={editedProject}
                isSubmitting={isSubmitting}
                onEdit={() => onEditInitiate(project)}
                onCancelEdit={onEditCancel}
                onUpdate={async (updates: Partial<Project>) => {
                  await onUpdateProject(project.id, updates);
                }}
                onDelete={() => onDeleteInitiate(project.id)}
                onViewApplications={() => {
                  // Navigate to applications view
                  window.location.href = `/project/${project.id}/applications`;
                }}
                onEditedProjectChange={(field: string, value: any) => {
                  // This would need to be handled by the parent component
                  console.log('Field change:', field, value);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Assigned/In Progress Projects */}
      {assignedProjects.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Active Projects ({assignedProjects.length})</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {assignedProjects.map(project => (
              <AssignedProjectCard
                key={project.id}
                project={project}
                acceptedApp={undefined}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Projects */}
      {completedProjects.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Completed Projects ({completedProjects.length})</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {completedProjects.map(project => (
              <AssignedProjectCard
                key={project.id}
                project={project}
                acceptedApp={undefined}
                showReviewButton={project.status === 'completed'}
                onReview={handleReviewSubmit}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
