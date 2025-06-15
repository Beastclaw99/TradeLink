
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock } from 'lucide-react';
import UnifiedProjectCard from '@/components/shared/UnifiedProjectCard';

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
  assigned_to: string | null;
  category: string | null;
  location: string | null;
  urgency: string | null;
  requirements: string[] | null;
  recommended_skills: string[] | null;
  deadline: string | null;
  updated_at: string | null;
  contract_template_id: string | null;
  industry_specific_fields: any;
  location_coordinates: any;
  project_start_time: string | null;
  rich_description: string | null;
  scope: string | null;
  service_contract: string | null;
  sla_terms: any;
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

  const handleUpdateStatus = (projectId: string, newStatus: any) => {
    onUpdateProjectStatus(projectId, newStatus);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Active Projects</h2>
      
      <div className="space-y-4">
        {projects.map((project) => (
          <UnifiedProjectCard
            key={project.id}
            project={project}
            onViewDetails={onViewProject}
            onUpdateStatus={handleUpdateStatus}
            isProfessional={true}
            userType="professional"
            variant="card"
          />
        ))}
      </div>
    </div>
  );
};

export default ActiveProjectsTab;
