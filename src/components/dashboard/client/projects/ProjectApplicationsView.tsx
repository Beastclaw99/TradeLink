
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Application, Project } from '../../types';

interface ProjectApplicationsViewProps {
  project: Project;
  applications: Application[];
  onApplicationUpdate: (applicationId: string, status: string) => void;
}

const ProjectApplicationsView: React.FC<ProjectApplicationsViewProps> = ({
  project,
  applications,
  onApplicationUpdate
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Applications for {project.title}</h3>
      {applications.map((application) => (
        <Card key={application.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {application.professional?.first_name} {application.professional?.last_name}
                </p>
                <p className="text-sm text-gray-500">
                  Bid: ${application.bid_amount}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => onApplicationUpdate(application.id, 'accepted')}
                >
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onApplicationUpdate(application.id, 'rejected')}
                >
                  Reject
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProjectApplicationsView;
