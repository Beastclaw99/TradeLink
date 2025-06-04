import { Application } from '../types';
import { ApplicationCard } from './ApplicationCard';
import { Loader2 } from 'lucide-react';

interface ApplicationListProps {
  applications: Application[];
  isLoading?: boolean;
  onApplicationUpdate: (applicationId: string, status: string) => void;
}

export const ApplicationList = ({ 
  applications, 
  isLoading = false,
  onApplicationUpdate 
}: ApplicationListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">My Applications</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {applications.map(application => (
          <ApplicationCard
            key={application.id}
            application={application}
            onApplicationUpdate={onApplicationUpdate}
          />
        ))}
      </div>
    </div>
  );
}; 