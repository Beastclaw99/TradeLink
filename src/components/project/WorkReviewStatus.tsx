import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, RefreshCw, Clock, AlertCircle, FileText } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { formatDistanceToNow } from 'date-fns';

interface WorkReviewStatusProps {
  projectStatus: string;
  lastUpdate: {
    created_at: string;
    message: string;
    metadata?: {
      revision_notes?: string;
      approval_notes?: string;
    };
  } | null;
  isClient: boolean;
  isProfessional: boolean;
}

const WorkReviewStatus: React.FC<WorkReviewStatusProps> = ({
  projectStatus,
  lastUpdate,
  isClient,
  isProfessional
}) => {
  // Determine status icon and color
  const getStatusInfo = () => {
    switch (projectStatus) {
      case 'work_submitted':
        return {
          icon: <FileText className="h-5 w-5 text-blue-500" />,
          color: 'bg-blue-100 text-blue-800',
          title: 'Work Submitted',
          description: 'Waiting for client review'
        };
      case 'work_revision_requested':
        return {
          icon: <RefreshCw className="h-5 w-5 text-orange-500" />,
          color: 'bg-orange-100 text-orange-800',
          title: 'Revision Requested',
          description: 'Changes needed before approval'
        };
      case 'work_approved':
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          color: 'bg-green-100 text-green-800',
          title: 'Work Approved',
          description: 'Project ready for completion'
        };
      default:
        return {
          icon: <Clock className="h-5 w-5 text-gray-500" />,
          color: 'bg-gray-100 text-gray-800',
          title: 'In Progress',
          description: 'Work is being completed'
        };
    }
  };

  const statusInfo = getStatusInfo();

  // Get appropriate message based on role and status
  const getStatusMessage = () => {
    if (!lastUpdate) return null;

    if (projectStatus === 'work_revision_requested') {
      return isProfessional
        ? 'Client has requested changes to the submitted work.'
        : 'You have requested changes to the submitted work.';
    }

    if (projectStatus === 'work_approved') {
      return isProfessional
        ? 'Client has approved your work.'
        : 'You have approved the submitted work.';
    }

    if (projectStatus === 'work_submitted') {
      return isClient
        ? 'Professional has submitted work for your review.'
        : 'You have submitted work for client review.';
    }

    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {statusInfo.icon}
          Work Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className={statusInfo.color}>
            {statusInfo.title}
          </Badge>
          <span className="text-sm text-gray-500">
            {lastUpdate && formatDistanceToNow(new Date(lastUpdate.created_at), { addSuffix: true })}
          </span>
        </div>

        {/* Status Description */}
        <p className="text-sm text-gray-600">{statusInfo.description}</p>

        {/* Last Update Message */}
        {lastUpdate && (
          <>
            <Separator />
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900">Last Update</p>
              <p className="text-sm text-gray-600">{lastUpdate.message}</p>
              
              {/* Revision Notes */}
              {projectStatus === 'work_revision_requested' && lastUpdate.metadata?.revision_notes && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Revision Notes:</strong> {lastUpdate.metadata.revision_notes}
                  </AlertDescription>
                </Alert>
              )}

              {/* Approval Notes */}
              {projectStatus === 'work_approved' && lastUpdate.metadata?.approval_notes && (
                <Alert className="mt-2">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Approval Notes:</strong> {lastUpdate.metadata.approval_notes}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </>
        )}

        {/* Status Message */}
        {getStatusMessage() && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{getStatusMessage()}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkReviewStatus; 