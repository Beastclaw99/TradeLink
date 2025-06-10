
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Project, Application } from '../../types';

interface AssignedProjectCardProps {
  project: Project;
  applications: Application[];
  onViewDetails: (project: Project) => void;
}

const AssignedProjectCard: React.FC<AssignedProjectCardProps> = ({
  project,
  onViewDetails
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{project.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span>Status:</span>
            <Badge>{project.status}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Budget:</span>
            <span>${project.budget}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssignedProjectCard;
