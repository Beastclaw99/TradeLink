import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Project } from '@/components/dashboard/types';
import { format } from 'date-fns';
import { CalendarIcon, MapPinIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

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
    if (userType === 'professional') {
      if (onClick) {
        onClick();
      } else {
        navigate(`/projects/${project.id}`);
      }
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

  const projectSkills = project.recommended_skills ? JSON.parse(project.recommended_skills) as string[] : [];
  const matchingSkills = projectSkills.filter(skill => userSkills.includes(skill));
  const hasMatchingSkills = matchingSkills.length > 0;

  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${userType === 'professional' ? '' : 'opacity-50'}`}
      onClick={handleClick}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="line-clamp-2">{project.title}</CardTitle>
            <CardDescription className="mt-1">
              Posted by {project.client?.first_name} {project.client?.last_name}
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
              <p className="text-gray-600">{project.expected_timeline || 'N/A'}</p>
            </div>
            <div>
              <span className="font-medium">Location:</span>
              <p className="text-gray-600">{project.location || 'Remote'}</p>
            </div>
            <div>
              <span className="font-medium">Posted:</span>
              <p className="text-gray-600">{formatDate(project.created_at)}</p>
            </div>
          </div>

          {projectSkills.length > 0 && (
            <div>
              <span className="text-sm font-medium">Required Skills:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {projectSkills.map((skill, index) => (
                  <Badge 
                    key={index}
                    variant={userSkills.includes(skill) ? 'default' : 'outline'}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {project.milestones && project.milestones.length > 0 && (
            <div>
              <span className="text-sm font-medium">Milestones:</span>
              <div className="mt-2 space-y-2">
                {project.milestones.slice(0, 2).map((milestone: any) => (
                  <div key={milestone.id} className="text-sm text-gray-600">
                    • {milestone.title}
                  </div>
                ))}
                {project.milestones.length > 2 && (
                  <div className="text-sm text-gray-500">
                    +{project.milestones.length - 2} more milestones
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {project.client?.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400" />
              <span className="text-sm">{project.client.rating.toFixed(1)}</span>
            </div>
          )}
          {project.client?.total_reviews && (
            <span className="text-sm text-gray-500">
              ({project.client.total_reviews} reviews)
            </span>
          )}
        </div>
        {userType === 'professional' && (
          <Button variant="default" size="sm">
            View Details
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
