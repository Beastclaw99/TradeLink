import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ProjectStatus } from '@/types/database';
import { format, isValid } from 'date-fns';

interface ProjectTimelineProps {
  startDate: string | null;
  deadline: string | null;
  projectStatus: ProjectStatus;
}

export const ProjectTimeline: React.FC<ProjectTimelineProps> = ({
  startDate,
  deadline,
  projectStatus
}) => {
  const formatDate = (date: string | null): string => {
    if (!date) return 'Not set';
    try {
      const parsedDate = new Date(date);
      if (!isValid(parsedDate)) {
        console.error('Invalid date:', date);
        return 'Invalid date';
      }
      return format(parsedDate, 'PPP');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const formatStatus = (status: ProjectStatus): string => {
    try {
      return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    } catch (error) {
      console.error('Error formatting status:', error);
      return 'Unknown Status';
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium">Start Date</h4>
            <p className="text-sm text-muted-foreground">
              {formatDate(startDate)}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Deadline</h4>
            <p className="text-sm text-muted-foreground">
              {formatDate(deadline)}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Status</h4>
            <p className="text-sm text-muted-foreground">
              {formatStatus(projectStatus)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 