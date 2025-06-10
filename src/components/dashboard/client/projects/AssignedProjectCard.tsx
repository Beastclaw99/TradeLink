import React from 'react';
import UnifiedProjectCard from '@/components/shared/UnifiedProjectCard';
import { Project, Application } from '../../types';

interface AssignedProjectCardProps {
  project: Project;
  acceptedApp: Application | undefined;
}

const AssignedProjectCard: React.FC<AssignedProjectCardProps> = ({ 
  project,
  acceptedApp
}) => {
  return (
    <UnifiedProjectCard 
      project={project}
      variant="card"
      isProfessional={false}
    />
  );
};

export default AssignedProjectCard;
