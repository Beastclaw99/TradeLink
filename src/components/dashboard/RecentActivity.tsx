import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  Briefcase, 
  FileText, 
  DollarSign, 
  Star,
  MessageSquare,
  AlertCircle
} from 'lucide-react';

interface Activity {
  id: string;
  type: 'project' | 'application' | 'payment' | 'review' | 'message' | 'alert';
  title: string;
  description: string;
  timestamp: string;
  link?: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'project':
        return <Briefcase className="h-4 w-4 text-blue-500" />;
      case 'application':
        return <FileText className="h-4 w-4 text-green-500" />;
      case 'payment':
        return <DollarSign className="h-4 w-4 text-yellow-500" />;
      case 'review':
        return <Star className="h-4 w-4 text-purple-500" />;
      case 'message':
        return <MessageSquare className="h-4 w-4 text-indigo-500" />;
      case 'alert':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {activities.length === 0 ? (
        <p className="text-sm text-muted-foreground">No recent activity</p>
      ) : (
        activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start space-x-4 rounded-lg border p-4"
          >
            <div className="mt-1">{getActivityIcon(activity.type)}</div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">
                {activity.title}
              </p>
              <p className="text-sm text-muted-foreground">
                {activity.description}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
              </p>
            </div>
            {activity.link && (
              <a
                href={activity.link}
                className="text-sm text-primary hover:underline"
              >
                View
              </a>
            )}
          </div>
        ))
      )}
    </div>
  );
}; 