import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Project, ProjectStatus } from '@/types/database';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  onClick
}) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/projects/${project.id}`);
    }
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: string | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card 
      className="cursor-pointer transition-all hover:shadow-md"
      onClick={handleClick}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="line-clamp-2">{project.title}</CardTitle>
            <CardDescription className="mt-1">
              Posted {formatDate(project.created_at)}
            </CardDescription>
          </div>
          <Badge variant={project.urgency === 'high' ? 'destructive' : 'default'}>
            {project.urgency || 'Normal'} Priority
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600 line-clamp-3">
            {project.description}
          </p>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Budget:</span>
              <p className="text-gray-600">{formatCurrency(project.budget)}</p>
            </div>
            <div>
              <span className="font-medium">Timeline:</span>
              <p className="text-gray-600">{project.timeline || 'N/A'}</p>
            </div>
            <div>
              <span className="font-medium">Location:</span>
              <p className="text-gray-600">{project.location || 'Remote'}</p>
            </div>
            <div>
              <span className="font-medium">Status:</span>
              <p className="text-gray-600">{project.status || 'Open'}</p>
            </div>
          </div>

          {project.requirements && project.requirements.length > 0 && (
            <div>
              <span className="text-sm font-medium">Required Skills:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {project.requirements.map((skill, index) => (
                  <Badge 
                    key={index}
                    variant="outline"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="default" size="sm">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
