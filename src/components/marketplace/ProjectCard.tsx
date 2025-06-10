import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Project } from '@/components/dashboard/types';
import { format } from 'date-fns';
import { CalendarIcon, MapPinIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import { Badge } from '@/components/ui/badge';

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
  userType: 'professional' | 'client' | null;
  userSkills?: string[];
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  onClick, 
  userType,
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

  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const projectSkills = project.required_skills ? JSON.parse(project.required_skills) as string[] : [];
  const matchingSkills = projectSkills.filter(skill => userSkills.includes(skill));
  const hasMatchingSkills = matchingSkills.length > 0;

  return (
    <Card 
      className={`hover:shadow-md transition-shadow cursor-pointer ${
        userType === 'professional' && hasMatchingSkills ? 'border-ttc-green-500 border-2' : ''
      }`}
      onClick={handleClick}
    >
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
        <div className="space-y-4">
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
          </div>

          {userType === 'professional' && projectSkills.length > 0 && (
            <div className="space-y-2">
              <span className="text-sm font-medium">Required Skills</span>
              <div className="flex flex-wrap gap-2">
                {projectSkills.map((skill) => (
                  <Badge 
                    key={skill} 
                    variant={userSkills.includes(skill) ? "default" : "secondary"}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
              {hasMatchingSkills && (
                <p className="text-sm text-ttc-green-600 font-medium">
                  ✓ {matchingSkills.length} of your skills match this project
                </p>
              )}
            </div>
          )}

          <div className="flex justify-end">
            <Button 
              variant={userType === 'professional' && hasMatchingSkills ? "default" : "outline"} 
              size="sm"
            >
              {userType === 'professional' ? 'Apply Now' : 'View Details'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
