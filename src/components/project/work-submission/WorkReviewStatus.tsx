
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, AlertCircle, FileText, MessageSquare } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface WorkReviewStatusProps {
  status: 'pending_review' | 'approved' | 'revision_requested';
  submittedAt?: string;
  reviewedAt?: string;
  revisionNotes?: string;
}

const WorkReviewStatus: React.FC<WorkReviewStatusProps> = ({
  status,
  submittedAt,
  reviewedAt,
  revisionNotes
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'pending_review':
        return {
          icon: Clock,
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          text: 'Pending Review',
          bgColor: 'bg-yellow-50',
          description: 'Your work has been submitted and is awaiting client review.'
        };
      case 'approved':
        return {
          icon: CheckCircle,
          color: 'bg-green-100 text-green-800 border-green-200',
          text: 'Work Approved',
          bgColor: 'bg-green-50',
          description: 'Congratulations! Your work has been approved by the client.'
        };
      case 'revision_requested':
        return {
          icon: AlertCircle,
          color: 'bg-orange-100 text-orange-800 border-orange-200',
          text: 'Revision Requested',
          bgColor: 'bg-orange-50',
          description: 'The client has requested changes to your submitted work.'
        };
      default:
        return {
          icon: Clock,
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          text: 'Unknown Status',
          bgColor: 'bg-gray-50',
          description: 'Status information unavailable.'
        };
    }
  };

  const statusConfig = getStatusConfig();
  const Icon = statusConfig.icon;

  return (
    <Card className={statusConfig.bgColor}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="h-5 w-5" />
          Work Submission Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className={`${statusConfig.color} px-3 py-1`}>
            {statusConfig.text}
          </Badge>
        </div>

        <Alert>
          <FileText className="h-4 w-4" />
          <AlertDescription>
            {statusConfig.description}
          </AlertDescription>
        </Alert>

        <div className="space-y-3 text-sm">
          {submittedAt && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="font-medium">Submitted:</span>
              <span className="text-gray-600">{new Date(submittedAt).toLocaleString()}</span>
            </div>
          )}
          
          {reviewedAt && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="font-medium">Reviewed:</span>
              <span className="text-gray-600">{new Date(reviewedAt).toLocaleString()}</span>
            </div>
          )}
        </div>

        {revisionNotes && (
          <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-start gap-2">
              <MessageSquare className="h-4 w-4 text-orange-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-orange-800 mb-1">Client Feedback:</p>
                <p className="text-orange-700 text-sm leading-relaxed">{revisionNotes}</p>
              </div>
            </div>
          </div>
        )}

        {status === 'pending_review' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-700">
              <strong>What happens next?</strong> The client will review your submission and either approve it or request revisions. You'll be notified via email and can check back here for updates.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkReviewStatus;
