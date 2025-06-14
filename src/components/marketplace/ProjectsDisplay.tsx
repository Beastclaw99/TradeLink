import React from 'react';
import { useNavigate } from 'react-router-dom';
import MarketplaceProjectCard from './MarketplaceProjectCard';
import ProjectListItem from './ProjectListItem';
import { Project } from '@/types/database';
import { Loader2 } from 'lucide-react';

interface ProjectsDisplayProps {
  projects: Project[];
  loading: boolean;
  viewMode: 'grid' | 'list';
  userType: 'professional' | 'client';
  userSkills?: string[];
}

const ProjectsDisplay: React.FC<ProjectsDisplayProps> = ({ 
  projects, 
  loading, 
  viewMode,
  userType,
  userSkills = []
}) => {
  const navigate = useNavigate();
  
  const handleProjectClick = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };
  
  if (loading) {
    return (
      <div className="my-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4 animate-pulse">
              <div className="h-6 bg-gray-200 rounded-md w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
              <div className="h-20 bg-gray-200 rounded-md w-full"></div>
              <div className="h-4 bg-gray-200 rounded-md w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (projects.length === 0) {
    return (
      <div className="my-8 text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No projects found</h3>
        <p className="text-gray-500">
          {userType === 'professional' 
            ? "Try adjusting your filters or search term to find projects matching your skills."
            : "Try adjusting your filters or search term."}
        </p>
      </div>
    );
  }
  
  return (
    <div className="my-8">
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            userType === 'client' ? (
              <MarketplaceProjectCard 
                key={project.id} 
                project={project} 
                onClick={() => handleProjectClick(project.id)}
              />
            ) : (
              <ProjectListItem 
                key={project.id} 
                project={project}
                onClick={() => handleProjectClick(project.id)}
                userSkills={userSkills}
              />
            )
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map(project => (
            userType === 'client' ? (
              <MarketplaceProjectCard 
                key={project.id} 
                project={project} 
                onClick={() => handleProjectClick(project.id)}
              />
            ) : (
              <ProjectListItem 
                key={project.id} 
                project={project}
                onClick={() => handleProjectClick(project.id)}
                userSkills={userSkills}
              />
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsDisplay;
