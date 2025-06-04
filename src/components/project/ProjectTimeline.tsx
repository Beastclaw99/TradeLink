import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, AlertTriangle } from 'lucide-react';
import { format, differenceInDays, isPast } from 'date-fns';

interface ProjectTimelineProps {
  startDate: string | null;
  deadline: string | null;
  status: string;
}

const ProjectTimeline: React.FC<ProjectTimelineProps> = ({
  startDate,
  deadline,
  status
}) => {
  const getTimelineStatus = () => {
    if (!startDate || !deadline) return null;

    const today = new Date();
    const deadlineDate = new Date(deadline);
    const daysRemaining = differenceInDays(deadlineDate, today);
    const isOverdue = isPast(deadlineDate);

    if (isOverdue) {
      return {
        type: 'error',
        message: 'Project is overdue',
        days: Math.abs(daysRemaining)
      };
    }

    if (daysRemaining <= 7) {
      return {
        type: 'warning',
        message: 'Deadline approaching',
        days: daysRemaining
      };
    }

    return {
      type: 'success',
      message: 'On track',
      days: daysRemaining
    };
  };

  const timelineStatus = getTimelineStatus();

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Project Timeline</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Start Date */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-ttc-blue-100 flex items-center justify-center text-ttc-blue-700">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-medium">Start Date</h4>
              <p className="text-sm text-gray-600">
                {startDate ? format(new Date(startDate), 'PPP') : 'Not started yet'}
              </p>
            </div>
          </div>

          {/* Deadline */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-ttc-blue-100 flex items-center justify-center text-ttc-blue-700">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-medium">Deadline</h4>
              <p className="text-sm text-gray-600">
                {deadline ? format(new Date(deadline), 'PPP') : 'No deadline set'}
              </p>
              {timelineStatus && (
                <div className="mt-2">
                  <Badge
                    variant="outline"
                    className={`${
                      timelineStatus.type === 'error'
                        ? 'bg-red-100 text-red-800 border-red-200'
                        : timelineStatus.type === 'warning'
                        ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                        : 'bg-green-100 text-green-800 border-green-200'
                    }`}
                  >
                    {timelineStatus.type === 'error' ? (
                      <AlertTriangle className="w-3 h-3 mr-1" />
                    ) : (
                      <Clock className="w-3 h-3 mr-1" />
                    )}
                    {timelineStatus.message} ({timelineStatus.days} days{' '}
                    {timelineStatus.type === 'error' ? 'overdue' : 'remaining'})
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-ttc-blue-100 flex items-center justify-center text-ttc-blue-700">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-medium">Current Status</h4>
              <Badge
                variant="outline"
                className={`${
                  status === 'completed'
                    ? 'bg-green-100 text-green-800 border-green-200'
                    : status === 'in_progress'
                    ? 'bg-blue-100 text-blue-800 border-blue-200'
                    : 'bg-gray-100 text-gray-800 border-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectTimeline; 