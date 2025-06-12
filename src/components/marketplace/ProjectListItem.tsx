import React from 'react';
import { useNavigate } from 'react-router-dom';
import UnifiedProjectCard from '@/components/shared/UnifiedProjectCard';
import { ExtendedProject } from '@/types/database';

interface ProjectListItemProps {
  project: ExtendedProject;
  onClick?: () => void;
  userSkills?: string[];
}

const ProjectListItem: React.FC<ProjectListItemProps> = ({ 
  project, 
  onClick,
  userSkills = []
}) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/projects/${project.id}`);
    }
  };

  return (
    <UnifiedProjectCard 
      project={project}
      variant="list"
      onClick={handleClick}
      actionLabel="View Details"
      userType="professional"
      userSkills={userSkills}
    />
  );
};

export default ProjectListItem;
