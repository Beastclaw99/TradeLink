import React from 'react';
import { Application, Project } from '@/types';
import { ApplicationCard } from './components/ApplicationCard';
import { ApplicationDetailsDialog } from './dialogs/ApplicationDetailsDialog';
import { useApplicationOperations } from '@/hooks/client-dashboard/useApplicationOperations';

interface ProjectApplicationsViewProps {
  applications: Application[];
  projects: Project[];
  onUpdate?: () => void;
}

export const ProjectApplicationsView: React.FC<ProjectApplicationsViewProps> = ({
  applications,
  projects,
  onUpdate
}) => {
  const {
    selectedApplication,
    selectedProject,
    isSubmitting,
    handleViewApplication,
    handleCloseDialog,
    handleAcceptApplication,
    handleRejectApplication
  } = useApplicationOperations({ onUpdate });

  if (applications.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No applications found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {applications.map((application) => {
          const project = projects.find(p => p.id === application.project_id);
          if (!project) return null;

          return (
            <ApplicationCard
              key={application.id}
              application={application}
              project={project}
              onViewDetails={() => handleViewApplication(application, project)}
            />
          );
        })}
      </div>

      <ApplicationDetailsDialog
        application={selectedApplication}
        project={selectedProject}
        isOpen={!!selectedApplication}
        onClose={handleCloseDialog}
        onAccept={handleAcceptApplication}
        onReject={handleRejectApplication}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}; 