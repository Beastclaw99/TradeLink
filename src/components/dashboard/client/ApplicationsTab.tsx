
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from 'date-fns';
import { Clock, CheckCircle, XCircle, Eye, User } from 'lucide-react';
import { Application, Project } from '../types';

interface ApplicationsTabProps {
  isLoading: boolean;
  projects: Project[];
  applications: Application[];
  handleApplicationUpdate: (applicationId: string, status: 'accepted' | 'rejected') => Promise<void>;
  profile: any;
}

const ApplicationsTab: React.FC<ApplicationsTabProps> = ({
  isLoading,
  projects,
  applications,
  handleApplicationUpdate,
  profile
}) => {
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const pendingApplications = applications.filter(app => app.status === 'pending');
  const processedApplications = applications.filter(app => app.status !== 'pending');

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      accepted: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <Badge variant="outline" className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const ApplicationCard = ({ application }: { application: Application }) => {
    const project = projects.find(p => p.id === application.project_id);
    
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">
                {project?.title || 'Unknown Project'}
              </CardTitle>
              <CardDescription>
                Applied on {format(new Date(application.created_at), 'MMM d, yyyy')}
              </CardDescription>
            </div>
            {getStatusBadge(application.status || 'pending')}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="text-sm">
                Professional ID: {application.professional_id}
              </span>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-1">Proposal:</p>
              <p className="text-sm text-gray-600 line-clamp-3">
                {application.proposal_message || application.cover_letter || 'No proposal message'}
              </p>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm text-gray-500">Bid Amount: </span>
                <span className="font-medium">
                  TTD {application.bid_amount?.toLocaleString() || 'Not specified'}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedApplication(application)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>
                {application.status === 'pending' && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleApplicationUpdate(application.id, 'accepted')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Accept
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleApplicationUpdate(application.id, 'rejected')}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Project Applications</h2>
        <p className="text-gray-600">
          Manage applications from professionals for your projects
        </p>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({pendingApplications.length})
          </TabsTrigger>
          <TabsTrigger value="processed">
            Processed ({processedApplications.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="mt-6">
          {pendingApplications.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Pending Applications</h3>
                <p className="text-gray-500">
                  New applications will appear here when professionals apply to your projects.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingApplications.map(application => (
                <ApplicationCard key={application.id} application={application} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="processed" className="mt-6">
          {processedApplications.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <CheckCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Processed Applications</h3>
                <p className="text-gray-500">
                  Applications you've accepted or rejected will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {processedApplications.map(application => (
                <ApplicationCard key={application.id} application={application} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApplicationsTab;
