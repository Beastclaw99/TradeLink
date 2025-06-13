import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ProjectStatus } from '@/types/database';
import { formatDateToLocale } from '@/utils/dateUtils';

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
  const formatStatus = (status: ProjectStatus): string => {
    try {
      return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    } catch (error) {
      console.error('Error formatting status:', error);
      return 'Unknown Status';
    }
  };

  const formatDate = (date: string | null): string => {
    return formatDateToLocale(date);
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