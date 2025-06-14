
import React from 'react';
import { useNavigate } from 'react-router-dom';
import UnifiedProjectCard from '@/components/shared/UnifiedProjectCard';
import { Database } from '@/integrations/supabase/types';

type Project = Database['public']['Tables']['projects']['Row'];
type Application = Database['public']['Tables']['applications']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

interface AssignedProjectCardProps {
  project: Project;
  acceptedApp: Application | undefined;
  client: Profile;
}

const AssignedProjectCard: React.FC<AssignedProjectCardProps> = ({ 
  project,
  client
}) => {
  const navigate = useNavigate();

  const handleViewDetails = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <UnifiedProjectCard 
      project={project}
      variant="card"
      userType="professional"
      client={client}
      onViewDetails={handleViewDetails}
    />
  );
};

export default AssignedProjectCard;
