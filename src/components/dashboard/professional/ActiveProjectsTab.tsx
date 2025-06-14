
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, DollarSign, Clock } from 'lucide-react';

// Simplified interface for the component
interface ProjectWithMilestones {
  id: string;
  title: string;
  description: string | null;
  status: string | null;
  budget: number | null;
  timeline: string | null;
  spent: number | null;
  created_at: string | null;
  client_id: string | null;
  professional_id: string | null;
  milestones?: any[];
}

interface ActiveProjectsTabProps {
  isLoading: boolean;
  projects: ProjectWithMilestones[];
  onViewProject: (projectId: string) => void;
  onUpdateProjectStatus: (projectId: string, status: string) => Promise<void>;
  onSubmitWork: (projectId: string) => void;
  onRequestRevision: (projectId: string) => void;
  markProjectComplete: (projectId: string) => Promise<void>;
  isSubmitting: boolean;
}

const ActiveProjectsTab: React.FC<ActiveProjectsTabProps> = ({
  isLoading,
  projects,
  onViewProject,
  onUpdateProjectStatus,
  onSubmitWork,
  onRequestRevision,
  isSubmitting
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Projects</h3>
          <p className="text-gray-600">
            You don't have any active projects at the moment.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Active Projects</h2>
      
      <div className="space-y-4">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                  <Badge variant="outline" className="mb-3">
                    {project.status?.replace('_', ' ') || 'Active'}
                  </Badge>
                </div>
              </div>

              {project.description && (
                <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
              )}

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                {project.budget && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-500">Budget:</span>
                    <span className="font-medium">${project.budget.toLocaleString()}</span>
                  </div>
                )}
                {project.timeline && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-500">Timeline:</span>
                    <span className="font-medium">{project.timeline}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-500">Started:</span>
                  <span className="font-medium">
                    {project.created_at ? new Date(project.created_at).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewProject(project.id)}
                >
                  View Details
                </Button>
                
                {project.status === 'assigned' && (
                  <Button
                    size="sm"
                    onClick={() => onUpdateProjectStatus(project.id, 'in_progress')}
                    disabled={isSubmitting}
                  >
                    Start Project
                  </Button>
                )}
                
                {project.status === 'in_progress' && (
                  <Button
                    size="sm"
                    onClick={() => onSubmitWork(project.id)}
                    disabled={isSubmitting}
                  >
                    Submit Work
                  </Button>
                )}

                {project.status === 'work_revision_requested' && (
                  <Button
                    size="sm"
                    onClick={() => onRequestRevision(project.id)}
                    disabled={isSubmitting}
                  >
                    Resubmit Work
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ActiveProjectsTab;
