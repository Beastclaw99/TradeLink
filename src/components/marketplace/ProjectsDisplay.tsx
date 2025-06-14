
import React from 'react';
import { Project } from '@/types/database';
import ProjectListItem from './ProjectListItem';
import ProjectCard from './ProjectCard';
import { Card, CardContent } from '@/components/ui/card';
import { Search } from 'lucide-react';

interface ProjectsDisplayProps {
  projects: Project[];
  viewMode: 'grid' | 'list';
  onViewDetails: (projectId: string) => void;
  onApply?: (projectId: string) => void;
  showApplyButton?: boolean;
  userSkills?: string[];
  applications?: any[];
}

const ProjectsDisplay: React.FC<ProjectsDisplayProps> = ({
  projects,
  viewMode,
  onViewDetails,
  onApply,
  showApplyButton = false,
  userSkills = [],
  applications = []
}) => {
  const hasApplied = (projectId: string) => {
    return applications.some(app => app.project_id === projectId);
  };

  if (projects.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Projects Found</h3>
          <p className="text-gray-600">
            No projects match your current search criteria. Try adjusting your filters.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {projects.map((project) => (
          <ProjectListItem
            key={project.id}
            project={project}
            onViewDetails={onViewDetails}
            onApply={onApply}
            showApplyButton={showApplyButton}
            hasApplied={hasApplied(project.id)}
            userSkills={userSkills}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onViewDetails={onViewDetails}
          onApply={onApply}
          showApplyButton={showApplyButton}
          hasApplied={hasApplied(project.id)}
          userSkills={userSkills}
        />
      ))}
    </div>
  );
};

export default ProjectsDisplay;
