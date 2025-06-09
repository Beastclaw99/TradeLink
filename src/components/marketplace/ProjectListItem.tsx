
import React from 'react';
import { useNavigate } from 'react-router-dom';
import UnifiedProjectCard from '@/components/shared/UnifiedProjectCard';
import { Project } from '@/components/dashboard/types';

interface ProjectListItemProps {
  project: Project;
  onClick?: () => void;
}

const ProjectListItem: React.FC<ProjectListItemProps> = ({ project, onClick }) => {
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
      onAction={handleClick}
      actionLabel="View Details"
    />
  );
};

export default ProjectListItem;
