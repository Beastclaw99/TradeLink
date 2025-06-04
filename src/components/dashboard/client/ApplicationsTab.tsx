import React from 'react';
import { Application, Project } from '@/types';
import { ProjectApplicationsView } from './projects/ProjectApplicationsView';
import { Skeleton } from '@/components/ui/skeleton';

interface ApplicationsTabProps {
  applications: Application[];
  projects: Project[];
  isLoading: boolean;
  onUpdate: () => Promise<void>;
}

const ApplicationsTab: React.FC<ApplicationsTabProps> = ({ 
  applications, 
  projects, 
  isLoading, 
  onUpdate 
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-28" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Applications</h2>
      </div>
      
      <ProjectApplicationsView 
        applications={applications}
        projects={projects}
        onUpdate={onUpdate}
      />
    </div>
  );
};

export default ApplicationsTab;
