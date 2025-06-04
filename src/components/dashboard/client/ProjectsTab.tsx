import React from 'react';
import { Project } from '@/types';

interface ProjectsTabProps {
  projects: Project[];
  isLoading: boolean;
  onUpdate: () => Promise<void>;
}

const ProjectsTab: React.FC<ProjectsTabProps> = ({ projects, isLoading, onUpdate }) => {
  return (
    <div>
      <h2>Projects Tab</h2>
      {/* Existing implementation */}
    </div>
  );
};

export default ProjectsTab;
