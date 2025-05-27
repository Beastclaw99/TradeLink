import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Project, Application } from '../../types';
import ProjectUpdateTimeline from '../../ProjectUpdateTimeline';

interface AssignedProjectCardProps {
  project: Project;
  acceptedApp: Application | undefined;
}

const AssignedProjectCard: React.FC<AssignedProjectCardProps> = ({ 
  project,
  acceptedApp
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{project.title}</CardTitle>
        <CardDescription className="flex items-center justify-between">
          <span>Posted on {new Date(project.created_at || '').toLocaleDateString()}</span>
          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
            In Progress
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-ttc-neutral-600 mb-4">{project.description}</p>
        <p className="font-medium">Budget: ${project.budget}</p>
        
        {acceptedApp && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <p className="font-medium">Assigned to:</p>
            <p>{acceptedApp.professional?.first_name} {acceptedApp.professional?.last_name}</p>
          </div>
        )}
        
        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-4">Project Updates</h3>
          <ProjectUpdateTimeline projectId={project.id} />
        </div>
      </CardContent>
    </Card>
  );
};

export default AssignedProjectCard;
