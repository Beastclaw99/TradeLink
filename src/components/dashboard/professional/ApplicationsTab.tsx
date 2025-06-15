
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, FileText, Calendar, DollarSign, User, MapPin } from 'lucide-react';
import { formatDateToLocale } from '@/utils/dateUtils';
import { Database } from '@/integrations/supabase/types';

type Application = Database['public']['Tables']['applications']['Row'] & {
  project?: {
    id: string;
    title: string;
    status: string;
    budget: number | null;
    created_at: string;
  };
};

type Project = Database['public']['Tables']['projects']['Row'];

interface ApplicationsTabProps {
  isLoading: boolean;
  applications: Application[];
  projects: Project[];
  userId: string;
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications</h3>
          <p className="text-gray-600">
            You haven't applied to any projects yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'withdrawn':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your Applications</h2>
      
      <div className="grid gap-6">
        {applications.map((application) => {
          const project = projects.find(p => p.id === application.project_id) || application.project;
          const projectTitle = project?.title || 'Unknown Project';

          return (
            <Card key={application.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{projectTitle}</h3>
                    <Badge className={`border ${getStatusColor(application.status)}`}>
                      {application.status ? application.status.charAt(0).toUpperCase() + application.status.slice(1) : 'Pending'}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                  {application.bid_amount && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-500">Your Bid:</span>
                      <span className="font-medium">${application.bid_amount.toLocaleString()}</span>
                    </div>
                  )}
                  
                  {application.availability && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-500">Availability:</span>
                      <span className="font-medium">{application.availability}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-500">Applied:</span>
                    <span className="font-medium">
                      {application.created_at ? formatDateToLocale(application.created_at) : 'Unknown date'}
                    </span>
                  </div>
                </div>

                {application.proposal_message && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Your Proposal</h4>
                    <div className="bg-gray-50 rounded-lg p-3 border">
                      <p className="text-sm text-gray-700 line-clamp-3">
                        {application.proposal_message}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View Project
                  </Button>
                  {application.status === 'pending' && (
                    <Button variant="outline" size="sm">
                      Withdraw Application
                    </Button>
                  )}
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
