import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { Clock, CheckCircle, XCircle, Eye, User } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type Application = Database['public']['Tables']['applications']['Row'];
type Project = Database['public']['Tables']['projects']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];
type ApplicationStatus = Database['public']['Enums']['application_status'];

interface ApplicationCardProps {
  application: Application;
  project?: Partial<Project>;
  professional?: Profile;
  onViewDetails?: (application: Application) => void;
  onAccept?: (application: Application) => void;
  onReject?: (application: Application) => void;
  onWithdraw?: (application: Application) => void;
  isProfessional?: boolean;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  project,
  professional,
  onViewDetails,
  onAccept,
  onReject,
  onWithdraw,
  isProfessional = false
}) => {
  const getStatusBadge = (status: ApplicationStatus | null) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      accepted: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle },
      withdrawn: { color: 'bg-gray-100 text-gray-800', icon: XCircle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <Badge variant="outline" className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">
              {project?.title || 'Unknown Project'}
            </CardTitle>
            <CardDescription>
              Applied on {application.created_at ? format(new Date(application.created_at), 'MMM d, yyyy') : 'Unknown date'}
            </CardDescription>
          </div>
          {getStatusBadge(application.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {professional && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="text-sm">
                {professional.first_name} {professional.last_name}
              </span>
            </div>
          )}
          
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
                ${application.bid_amount?.toLocaleString() || 'Not specified'}
              </span>
            </div>
            <div className="flex gap-2">
              {onViewDetails && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDetails(application)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>
              )}
              {!isProfessional && application.status === 'pending' && (
                <>
                  {onAccept && (
                    <Button
                      size="sm"
                      onClick={() => onAccept(application)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Accept
                    </Button>
                  )}
                  {onReject && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onReject(application)}
                    >
                      Reject
                    </Button>
                  )}
                </>
              )}
              {isProfessional && application.status === 'pending' && onWithdraw && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onWithdraw(application)}
                >
                  Withdraw
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationCard; 