
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Application } from '../types';
import { formatDate } from '@/lib/utils';

interface ApplicationsTabProps {
  isLoading: boolean;
  applications: Application[];
}

const ApplicationsTab: React.FC<ApplicationsTabProps> = ({
  isLoading,
  applications
}) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'default';
      case 'rejected':
        return 'destructive';
      case 'pending':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">You haven't submitted any applications yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <Card key={application.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Project Application</CardTitle>
              <Badge variant={getStatusBadgeVariant(application.status || 'pending')}>
                {application.status || 'pending'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Proposal</h4>
                <p className="text-sm text-muted-foreground">{application.cover_letter}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium">Bid Amount:</span>
                  <span className="text-sm ml-2">${application.bid_amount}</span>
                </div>
                <div>
                  <span className="text-sm font-medium">Applied:</span>
                  <span className="text-sm ml-2">{formatDate(application.created_at)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ApplicationsTab;
