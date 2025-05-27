
import React from 'react';
import { useNavigate } from 'react-router-dom';
import UnifiedProjectCard from '@/components/shared/UnifiedProjectCard';
import { Project } from '@/components/dashboard/types';

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
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
      variant="card"
      onClick={handleClick}
      actionLabel="View Details"
    />
  );
};

export default ProjectCard;
