
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, XCircle, Eye, User, DollarSign, Calendar, Clock, MessageSquare } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';
import { formatDateToLocale } from '@/utils/dateUtils';

type Application = Database['public']['Tables']['applications']['Row'] & {
  professional?: {
    id: string;
    first_name: string;
    last_name: string;
    profile_image_url?: string;
    rating?: number;
  };
  project?: {
    id: string;
    title: string;
    status: string;
    budget: number | null;
    created_at: string;
  };
};

type Project = Database['public']['Tables']['projects']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

interface ApplicationsTabProps {
  isLoading: boolean;
  projects: Project[];
  applications: Application[];
  handleApplicationUpdate: (applicationId: string, status: 'accepted' | 'rejected') => Promise<void>;
  profile: Profile | null;
  userId: string;
}

const getStatusConfig = (status: string | null) => {
  switch (status) {
    case 'accepted':
      return {
        variant: 'default' as const,
        className: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle
      };
    case 'rejected':
      return {
        variant: 'destructive' as const,
        className: 'bg-red-100 text-red-800 border-red-200',
        icon: XCircle
      };
    case 'pending':
    default:
      return {
        variant: 'secondary' as const,
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: Clock
      };
  }
};

const ApplicationsTab: React.FC<ApplicationsTabProps> = ({
  isLoading,
  projects,
  applications,
  handleApplicationUpdate
}) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full mb-4" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-24" />
                  <Skeleton className="h-9 w-24" />
                  <Skeleton className="h-9 w-32" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Project Applications</h2>
        </div>
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <MessageSquare className="h-8 w-8 text-gray-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">No Applications Yet</h3>
                <p className="text-gray-600 max-w-md">
                  Applications for your projects will appear here once professionals start applying.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pendingApplications = applications.filter(app => app.status === 'pending');
  const reviewedApplications = applications.filter(app => app.status !== 'pending');

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Project Applications</h2>
        <div className="text-sm text-gray-500">
          {applications.length} total application{applications.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Pending Applications Section */}
      {pendingApplications.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-900">Pending Review</h3>
            <Badge variant="secondary" className="bg-amber-100 text-amber-800">
              {pendingApplications.length}
            </Badge>
          </div>
          
          <div className="grid gap-4">
            {pendingApplications.map((application) => {
              const project = projects.find(p => p.id === application.project_id);
              const projectTitle = project?.title || application.project?.title || 'Unknown Project';
              const statusConfig = getStatusConfig(application.status);
              const StatusIcon = statusConfig.icon;

              return (
                <Card key={application.id} className="hover:shadow-md transition-all duration-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-lg font-semibold text-gray-900">
                          {projectTitle}
                        </CardTitle>
                        {application.professional && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <User className="h-4 w-4" />
                            <span className="text-sm">
                              {application.professional.first_name} {application.professional.last_name}
                            </span>
                          </div>
                        )}
                      </div>
                      <Badge variant={statusConfig.variant} className={statusConfig.className}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {application.status ? application.status.charAt(0).toUpperCase() + application.status.slice(1) : 'Pending'}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Application Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {application.bid_amount && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <div>
                            <span className="text-sm text-gray-500">Bid Amount</span>
                            <p className="font-semibold text-gray-900">${application.bid_amount.toLocaleString()}</p>
                          </div>
                        </div>
                      )}
                      
                      {application.availability && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <div>
                            <span className="text-sm text-gray-500">Availability</span>
                            <p className="font-semibold text-gray-900">{application.availability}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <div>
                          <span className="text-sm text-gray-500">Applied</span>
                          <p className="font-semibold text-gray-900">
                            {application.created_at ? formatDateToLocale(application.created_at) : 'Unknown date'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Proposal Message */}
                    {application.proposal_message && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-900">Proposal</h4>
                        <div className="bg-gray-50 rounded-lg p-4 border">
                          <p className="text-sm text-gray-700 line-clamp-3">
                            {application.proposal_message}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-2 border-t">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </Button>
                      
                      <Button 
                        size="sm"
                        onClick={() => handleApplicationUpdate(application.id, 'accepted')}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Accept
                      </Button>
                      
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => handleApplicationUpdate(application.id, 'rejected')}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Reviewed Applications Section */}
      {reviewedApplications.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-900">Reviewed Applications</h3>
            <Badge variant="outline" className="text-gray-600">
              {reviewedApplications.length}
            </Badge>
          </div>
          
          <div className="grid gap-4">
            {reviewedApplications.map((application) => {
              const project = projects.find(p => p.id === application.project_id);
              const projectTitle = project?.title || application.project?.title || 'Unknown Project';
              const statusConfig = getStatusConfig(application.status);
              const StatusIcon = statusConfig.icon;

              return (
                <Card key={application.id} className="opacity-75 hover:opacity-100 transition-opacity">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-lg font-semibold text-gray-900">
                          {projectTitle}
                        </CardTitle>
                        {application.professional && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <User className="h-4 w-4" />
                            <span className="text-sm">
                              {application.professional.first_name} {application.professional.last_name}
                            </span>
                          </div>
                        )}
                      </div>
                      <Badge variant={statusConfig.variant} className={statusConfig.className}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {application.status ? application.status.charAt(0).toUpperCase() + application.status.slice(1) : 'Unknown'}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {application.bid_amount && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <div>
                            <span className="text-sm text-gray-500">Bid Amount</span>
                            <p className="font-semibold text-gray-900">${application.bid_amount.toLocaleString()}</p>
                          </div>
                        </div>
                      )}
                      
                      {application.availability && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <div>
                            <span className="text-sm text-gray-500">Availability</span>
                            <p className="font-semibold text-gray-900">{application.availability}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <div>
                          <span className="text-sm text-gray-500">Applied</span>
                          <p className="font-semibold text-gray-900">
                            {application.created_at ? formatDateToLocale(application.created_at) : 'Unknown date'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2 border-t">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsTab;
