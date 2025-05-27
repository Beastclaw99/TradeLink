
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Project } from '../../types';
import ProjectStatusBadge from '@/components/shared/ProjectStatusBadge';
import { Edit, Trash2, Send, Eye } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  applications: any[];
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  applications, 
  onEdit, 
  onDelete 
}) => {
  const navigate = useNavigate();
  
  const projectApplications = applications.filter(app => app.project_id === project.id);
  const pendingApplications = projectApplications.filter(app => app.status === 'pending');

  const handleDispatch = () => {
    navigate(`/client/dispatch/${project.id}`);
  };

  const handleViewDetails = () => {
    navigate(`/projects/${project.id}`);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{project.title}</CardTitle>
            <ProjectStatusBadge status={project.status} showIcon={true} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
        
        <div className="space-y-2 mb-4">
          {project.budget && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Budget:</span>
              <span className="font-medium">${project.budget.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Applications:</span>
            <span className="font-medium">{projectApplications.length}</span>
          </div>
          {pendingApplications.length > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Pending Review:</span>
              <Badge variant="secondary">{pendingApplications.length}</Badge>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleViewDetails}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-1" />
            View Details
          </Button>
          
          {project.status === 'open' && (
            <Button 
              variant="default" 
              size="sm"
              onClick={handleDispatch}
              className="flex-1"
            >
              <Send className="h-4 w-4 mr-1" />
              Dispatch
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onEdit(project)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onDelete(project.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
