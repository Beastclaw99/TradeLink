
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Project, Application } from '../../types';
import ProjectUpdateTimeline from '../../ProjectUpdateTimeline';

interface AssignedProjectCardProps {
  project: Project;
  acceptedApp?: Application;
  showReviewButton?: boolean;
  onReview?: (projectId: string, data: { rating?: number; comment?: string; }) => void;
}

const AssignedProjectCard: React.FC<AssignedProjectCardProps> = ({ 
  project,
  acceptedApp,
  showReviewButton = false,
  onReview
}) => {
  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'submitted':
        return 'bg-purple-100 text-purple-800';
      case 'revision':
        return 'bg-orange-100 text-orange-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'paid':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusLabel = (status: Project['status']) => {
    switch (status) {
      case 'in-progress':
        return 'In Progress';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{project.title}</CardTitle>
        <CardDescription className="flex items-center justify-between">
          <span>Posted on {new Date(project.created_at || '').toLocaleDateString()}</span>
          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
            {getStatusLabel(project.status)}
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
          <ProjectUpdateTimeline 
            projectId={project.id} 
            projectStatus={project.status}
          />
        </div>

        {showReviewButton && onReview && (
          <div className="mt-4">
            <Button 
              onClick={() => onReview(project.id, {})}
              className="w-full bg-ttc-blue-700 hover:bg-ttc-blue-800"
            >
              Leave Review
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssignedProjectCard;
