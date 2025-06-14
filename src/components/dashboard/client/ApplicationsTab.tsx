import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, XCircle, Clock, Eye, User } from 'lucide-react';
import { Application, Project, Profile } from '@/types/database';

interface ApplicationsTabProps {
  isLoading: boolean;
  projects: Project[];
  applications: Application[];
  handleApplicationUpdate: (applicationId: string, status: 'accepted' | 'rejected') => Promise<void>;
  profile: Profile | null;
  professionals: any[];
  userId: string;
}

const ApplicationsTab: React.FC<ApplicationsTabProps> = ({
  isLoading,
  projects,
  applications,
  handleApplicationUpdate,
  profile
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
          <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
          <p className="text-gray-600">
            Applications for your projects will appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Project Applications</h2>
      
      <div className="space-y-4">
        {applications.map((application) => {
          const project = projects.find(p => p.id === application.project_id);
          if (!project) return null;

          return (
            <Card key={application.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{project.title}</h3>
                    <p className="text-gray-600">Professional ID: {application.professional_id}</p>
                  </div>
                  <Badge 
                    variant={
                      application.status === 'accepted' ? 'default' :
                      application.status === 'rejected' ? 'destructive' :
                      'secondary'
                    }
                  >
                    {application.status || 'pending'}
                  </Badge>
                </div>

                {application.proposal_message && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Proposal</h4>
                    <p className="text-gray-700">{application.proposal_message}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-4">
                  {application.bid_amount && (
                    <div>
                      <span className="font-medium">Bid Amount: </span>
                      <span>${application.bid_amount}</span>
                    </div>
                  )}
                  {application.availability && (
                    <div>
                      <span className="font-medium">Availability: </span>
                      <span>{application.availability}</span>
                    </div>
                  )}
                </div>

                {application.status === 'pending' && (
                  <div className="flex space-x-2">
                    <Button 
                      size="sm"
                      onClick={() => handleApplicationUpdate(application.id, 'accepted')}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Accept
                    </Button>
                    <Button 
                      size="sm"
                      variant="destructive"
                      onClick={() => handleApplicationUpdate(application.id, 'rejected')}
                      className="flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </Button>
                    <Button 
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ApplicationsTab;
