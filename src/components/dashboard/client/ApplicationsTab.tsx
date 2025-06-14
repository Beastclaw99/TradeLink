
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database } from '@/integrations/supabase/types';
import { Loader2 } from 'lucide-react';

type Project = Database['public']['Tables']['projects']['Row'];
type Application = Database['public']['Tables']['applications']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

interface ApplicationsTabProps {
  isLoading: boolean;
  projects: Project[];
  applications: Application[];
  handleApplicationUpdate: (applicationId: string, status: 'accepted' | 'rejected') => Promise<void>;
  professionals: Profile[];
  userId: string;
}

const ApplicationsTab: React.FC<ApplicationsTabProps> = ({ 
  isLoading, 
  projects, 
  applications, 
  handleApplicationUpdate,
  professionals,
  userId
}) => {
  const pendingApplications = applications.filter(app => app.status === 'pending');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (pendingApplications.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-gray-500">No pending applications at the moment.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {pendingApplications.map((application) => {
        const project = projects.find(p => p.id === application.project_id);
        if (!project) return null;

        return (
          <Card key={application.id}>
            <CardHeader>
              <CardTitle className="text-lg">{project.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">{application.proposal_message}</p>
                
                {application.bid_amount && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Bid Amount:</span>
                    <span className="font-medium">${application.bid_amount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button 
                    size="sm"
                    onClick={() => handleApplicationUpdate(application.id, 'accepted')}
                  >
                    Accept
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleApplicationUpdate(application.id, 'rejected')}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ApplicationsTab;
