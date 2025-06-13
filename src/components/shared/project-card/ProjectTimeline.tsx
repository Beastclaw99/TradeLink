import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ProjectStatus } from '@/types/database';
import { format } from 'date-fns';

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
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {startDate && (
            <div>
              <h4 className="text-sm font-medium">Start Date</h4>
              <p className="text-sm text-muted-foreground">
                {format(new Date(startDate), 'PPP')}
              </p>
            </div>
          )}
          {deadline && (
            <div>
              <h4 className="text-sm font-medium">Deadline</h4>
              <p className="text-sm text-muted-foreground">
                {format(new Date(deadline), 'PPP')}
              </p>
            </div>
          )}
          <div>
            <h4 className="text-sm font-medium">Status</h4>
            <p className="text-sm text-muted-foreground capitalize">
              {projectStatus.replace('_', ' ')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 