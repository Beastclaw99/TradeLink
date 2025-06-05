import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Project } from '@/components/dashboard/types';
import { format } from 'date-fns';
import { CalendarIcon, MapPinIcon, BanknotesIcon } from '@heroicons/react/24/outline';

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

  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleClick}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{project.title}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <CalendarIcon className="h-4 w-4" />
              <span>Posted {format(new Date(project.created_at || ''), 'MMM d, yyyy')}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            {project.location && (
              <div className="flex items-center gap-1 text-gray-500">
                <MapPinIcon className="h-4 w-4" />
                <span>{project.location}</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-gray-500">
              <BanknotesIcon className="h-4 w-4" />
              <span>{formatCurrency(project.budget)}</span>
            </div>
          </div>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
