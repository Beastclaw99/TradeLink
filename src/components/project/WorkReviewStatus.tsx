import { Card, CardContent } from '@/components/ui/card';
import { FileText, RefreshCw, CheckCircle, Clock } from 'lucide-react';
import { ProjectStatus } from '@/types/database';

interface WorkReviewStatusProps {
  projectStatus: ProjectStatus;
  lastUpdate?: string;
  isClient: boolean;
  isProfessional: boolean;
}

const WorkReviewStatus = ({
  projectStatus,
  lastUpdate,
  isClient,
  isProfessional
}: WorkReviewStatusProps) => {
  // Determine status icon and color
  const getStatusInfo = () => {
    switch (projectStatus) {
      case 'work_submitted':
        return {
          icon: <FileText className="h-5 w-5 text-blue-500" />,
          color: 'bg-blue-100 text-blue-800',
          title: 'Work Submitted',
          description: isClient ? 'Review the submitted work' : 'Waiting for client review'
        };
      case 'work_revision_requested':
        return {
          icon: <RefreshCw className="h-5 w-5 text-orange-500" />,
          color: 'bg-orange-100 text-orange-800',
          title: 'Revision Requested',
          description: isClient ? 'You requested changes' : 'Changes needed before approval'
        };
      case 'work_approved':
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          color: 'bg-green-100 text-green-800',
          title: 'Work Approved',
          description: isClient ? 'You approved the work' : 'Your work has been approved'
        };
      default:
        return {
          icon: <Clock className="h-5 w-5 text-gray-500" />,
          color: 'bg-gray-100 text-gray-800',
          title: 'In Progress',
          description: isClient ? 'Work is being completed' : 'Continue working on the project'
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className={`p-2 rounded-lg ${statusInfo.color}`}>
            {statusInfo.icon}
          </div>
          <div className="flex-1">
            <h3 className="font-medium">{statusInfo.title}</h3>
            <p className="text-sm text-gray-600">{statusInfo.description}</p>
            {lastUpdate && (
              <p className="text-xs text-gray-500 mt-1">
                Last updated: {new Date(lastUpdate).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkReviewStatus; 