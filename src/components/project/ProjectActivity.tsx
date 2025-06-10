import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  FileText,
  UserPlus,
  UserMinus,
  DollarSign,
  Calendar,
  Clock,
  ArrowRight
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

interface ActivityUser {
  id: string;
  name: string;
  avatar?: string;
  role: string;
}

interface ActivityItem {
  id: string;
  type: 'message' | 'milestone' | 'task' | 'file' | 'member' | 'expense' | 'other';
  title: string;
  description?: string;
  timestamp: string;
  user: ActivityUser;
  metadata?: {
    status?: 'completed' | 'in_progress' | 'overdue';
    priority?: 'high' | 'medium' | 'low';
    amount?: number;
    fileType?: string;
    fileSize?: number;
    memberRole?: string;
  };
}

interface ProjectActivityProps {
  activities: ActivityItem[];
}

const ProjectActivity: React.FC<ProjectActivityProps> = ({ activities }) => {
  const getActivityIcon = (type: ActivityItem['type']) => {
    const icons: Record<ActivityItem['type'], React.ReactNode> = {
      message: <MessageSquare className="h-4 w-4" />,
      milestone: <Calendar className="h-4 w-4" />,
      task: <CheckCircle2 className="h-4 w-4" />,
      file: <FileText className="h-4 w-4" />,
      member: <UserPlus className="h-4 w-4" />,
      expense: <DollarSign className="h-4 w-4" />,
      other: <AlertTriangle className="h-4 w-4" />
    };
    return icons[type];
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    const colors: Record<ActivityItem['type'], string> = {
      message: 'bg-blue-100 text-blue-800 border-blue-200',
      milestone: 'bg-purple-100 text-purple-800 border-purple-200',
      task: 'bg-green-100 text-green-800 border-green-200',
      file: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      member: 'bg-pink-100 text-pink-800 border-pink-200',
      expense: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      other: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[type];
  };

  const getStatusBadge = (status: ActivityItem['metadata']['status']) => {
    if (!status) return null;

    const statusConfig: Record<NonNullable<ActivityItem['metadata']['status']>, { color: string; icon: React.ReactNode }> = {
      completed: {
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: <CheckCircle2 className="h-4 w-4" />
      },
      in_progress: {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: <Clock className="h-4 w-4" />
      },
      overdue: {
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: <AlertTriangle className="h-4 w-4" />
      }
    };

    const { color, icon } = statusConfig[status];
    return (
      <Badge variant="outline" className={color}>
        {icon}
        <span className="ml-1">
          {status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </span>
      </Badge>
    );
  };

  const getPriorityBadge = (priority: ActivityItem['metadata']['priority']) => {
    if (!priority) return null;

    const priorityConfig: Record<NonNullable<ActivityItem['metadata']['priority']>, { color: string }> = {
      high: {
        color: 'bg-red-100 text-red-800 border-red-200'
      },
      medium: {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
      },
      low: {
        color: 'bg-green-100 text-green-800 border-green-200'
      }
    };

    const { color } = priorityConfig[priority];
    return (
      <Badge variant="outline" className={color}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Project Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>No activity has been recorded yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex gap-4"
              >
                <div className="flex flex-col items-center">
                  <Avatar>
                    <AvatarImage src={activity.user.avatar} />
                    <AvatarFallback>{getInitials(activity.user.name)}</AvatarFallback>
                  </Avatar>
                  <div className="w-px h-full bg-gray-200 my-2" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={getActivityColor(activity.type)}
                        >
                          {getActivityIcon(activity.type)}
                          <span className="ml-1">
                            {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                          </span>
                        </Badge>
                        {activity.metadata?.status && getStatusBadge(activity.metadata.status)}
                        {activity.metadata?.priority && getPriorityBadge(activity.metadata.priority)}
                      </div>
                      <h3 className="font-medium">{activity.title}</h3>
                      {activity.description && (
                        <p className="text-sm text-gray-600">{activity.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}</span>
                      <span>•</span>
                      <span>{format(new Date(activity.timestamp), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                  {activity.metadata && (
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {activity.metadata.amount && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          <span>{formatCurrency(activity.metadata.amount)}</span>
                        </div>
                      )}
                      {activity.metadata.fileType && (
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          <span>{activity.metadata.fileType}</span>
                          {activity.metadata.fileSize && (
                            <span>({formatFileSize(activity.metadata.fileSize)})</span>
                          )}
                        </div>
                      )}
                      {activity.metadata.memberRole && (
                        <div className="flex items-center gap-1">
                          <UserPlus className="h-4 w-4" />
                          <span>{activity.metadata.memberRole}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectActivity; 