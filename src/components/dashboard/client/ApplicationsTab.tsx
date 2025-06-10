
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Application, Project } from '../types';

interface ApplicationsTabProps {
  isLoading: boolean;
  projects: Project[];
  applications: Application[];
  handleApplicationUpdate: (applicationId: string, status: string) => void;
  profile: any;
}

const ApplicationsTab: React.FC<ApplicationsTabProps> = ({
  isLoading,
  projects,
  applications,
  handleApplicationUpdate,
}) => {
  if (isLoading) {
    return <div>Loading applications...</div>;
  }

  const pendingApplications = applications.filter(app => app.status === 'pending');
  const pastApplications = applications.filter(app => app.status !== 'pending');

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Applications</h2>
      
      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pendingApplications.length})</TabsTrigger>
          <TabsTrigger value="past">Past Applications ({pastApplications.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          {pendingApplications.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">No pending applications</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingApplications.map((application) => {
                const project = projects.find(p => p.id === application.project_id);
                return (
                  <Card key={application.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{project?.title || 'Unknown Project'}</CardTitle>
                          <p className="text-sm text-gray-500">
                            Applied on {new Date(application.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="secondary">{application.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p><strong>Professional:</strong> {application.professional?.first_name} {application.professional?.last_name}</p>
                        <p><strong>Bid Amount:</strong> ${application.bid_amount}</p>
                        {application.proposal_message && (
                          <p><strong>Proposal:</strong> {application.proposal_message}</p>
                        )}
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        <Button
                          onClick={() => handleApplicationUpdate(application.id, 'accepted')}
                          size="sm"
                        >
                          Accept
                        </Button>
                        <Button
                          onClick={() => handleApplicationUpdate(application.id, 'rejected')}
                          variant="outline"
                          size="sm"
                        >
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="past">
          {pastApplications.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">No past applications</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pastApplications.map((application) => {
                const project = projects.find(p => p.id === application.project_id);
                return (
                  <Card key={application.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{project?.title || 'Unknown Project'}</CardTitle>
                          <p className="text-sm text-gray-500">
                            Applied on {new Date(application.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={application.status === 'accepted' ? 'default' : 'destructive'}>
                          {application.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p><strong>Professional:</strong> {application.professional?.first_name} {application.professional?.last_name}</p>
                        <p><strong>Bid Amount:</strong> ${application.bid_amount}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApplicationsTab;
