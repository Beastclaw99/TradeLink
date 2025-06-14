
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, User, DollarSign, Calendar, MessageSquare } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type Application = Database['public']['Tables']['applications']['Row'];

interface ProjectApplicationsViewProps {
  applications: Application[];
  onViewApplication: (application: Application) => void;
  onAcceptApplication: (applicationId: string) => void;
  onRejectApplication: (applicationId: string) => void;
  isProcessing?: boolean;
}

const ProjectApplicationsView: React.FC<ProjectApplicationsViewProps> = ({
  applications,
  onViewApplication,
  onAcceptApplication,
  onRejectApplication,
  isProcessing = false
}) => {
  if (applications.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
          <p className="text-gray-600">
            Applications will appear here once professionals start applying to your project.
          </p>
        </CardContent>
      </Card>
    );
  }

  const pendingApplications = applications.filter(app => app.status === 'pending');
  const reviewedApplications = applications.filter(app => app.status !== 'pending');

  return (
    <div className="space-y-6">
      {/* Pending Applications */}
      {pendingApplications.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Pending Applications ({pendingApplications.length})
          </h3>
          <div className="space-y-4">
            {pendingApplications.map((application) => (
              <Card key={application.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <User className="h-5 w-5 text-gray-400" />
                        <span className="font-medium">Professional ID: {application.professional_id}</span>
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          {application.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        {application.bid_amount && (
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-500">Bid Amount:</span>
                            <span className="font-medium">${application.bid_amount.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-500">Applied:</span>
                          <span className="font-medium">
                            {application.created_at ? new Date(application.created_at).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                      </div>

                      {application.cover_letter && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {application.cover_letter}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewApplication(application)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onAcceptApplication(application.id)}
                      disabled={isProcessing}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRejectApplication(application.id)}
                      disabled={isProcessing}
                      className="text-red-600 hover:text-red-700"
                    >
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Reviewed Applications */}
      {reviewedApplications.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Reviewed Applications ({reviewedApplications.length})
          </h3>
          <div className="space-y-4">
            {reviewedApplications.map((application) => (
              <Card key={application.id} className="opacity-75">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <User className="h-5 w-5 text-gray-400" />
                        <span className="font-medium">Professional ID: {application.professional_id}</span>
                        <Badge 
                          variant={application.status === 'accepted' ? 'default' : 'secondary'}
                          className={
                            application.status === 'accepted' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }
                        >
                          {application.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        {application.bid_amount && (
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-500">Bid Amount:</span>
                            <span className="font-medium">${application.bid_amount.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-500">Applied:</span>
                          <span className="font-medium">
                            {application.created_at ? new Date(application.created_at).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewApplication(application)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectApplicationsView;
