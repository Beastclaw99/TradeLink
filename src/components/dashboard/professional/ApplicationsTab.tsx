
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, DollarSign, Clock, FileText } from 'lucide-react';
import { Project, Application } from '../types';

interface ApplicationsTabProps {
  isLoading: boolean;
  applications: Application[];
  projects: Project[];
}

const ApplicationsTab: React.FC<ApplicationsTabProps> = ({
  isLoading,
  applications,
  projects
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

  if (applications.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
          <p className="text-gray-600">
            You haven't applied to any projects yet. Browse available projects to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'withdrawn':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your Applications</h2>
      
      <div className="space-y-4">
        {applications.map((application) => {
          const project = projects.find(p => p.id === application.project_id);
          
          return (
            <Card key={application.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">
                      {project?.title || 'Project Not Found'}
                    </h3>
                    <Badge className={getStatusColor(application.status)}>
                      {application.status || 'pending'}
                    </Badge>
                  </div>
                </div>

                {application.cover_letter && (
                  <p className="text-gray-600 mb-4 line-clamp-2">{application.cover_letter}</p>
                )}

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  {application.bid_amount && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-500">Bid Amount:</span>
                      <span className="font-medium">${application.bid_amount.toLocaleString()}</span>
                    </div>
                  )}
                  {application.availability && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-500">Availability:</span>
                      <span className="font-medium">{application.availability}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-500">Applied:</span>
                    <span className="font-medium">
                      {application.created_at ? new Date(application.created_at).toLocaleDateString() : 'N/A'}
                    </span>
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

export default ApplicationsTab;
