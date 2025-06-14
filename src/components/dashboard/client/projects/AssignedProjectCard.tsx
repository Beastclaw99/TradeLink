
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Database } from '@/integrations/supabase/types';
import UnifiedProjectCard from '@/components/shared/UnifiedProjectCard';
import { Eye, MessageSquare, CheckCircle } from 'lucide-react';

type Project = Database['public']['Tables']['projects']['Row'];
type Application = Database['public']['Tables']['applications']['Row'];

interface AssignedProjectCardProps {
  project: Project;
  applications: Application[];
  onViewDetails: (projectId: string) => void;
  onMessageProfessional: (professionalId: string) => void;
  onMarkComplete: (projectId: string) => void;
}

const AssignedProjectCard: React.FC<AssignedProjectCardProps> = ({ 
  project, 
  applications,
  onViewDetails,
  onMessageProfessional,
  onMarkComplete
}) => {
  const handleViewDetails = () => {
    onViewDetails(project.id);
  };

  return (
    <UnifiedProjectCard 
      project={project}
      variant="card"
      onClick={handleViewDetails}
      actionLabel="View Details"
      userType="professional"
      client={{
        id: project.client_id || '',
        first_name: '',
        last_name: '',
        profile_image_url: null,
        rating: null,
        completed_projects: null
      }}
      onViewDetails={handleViewDetails}
    />
  );
};

export default AssignedProjectCard;
