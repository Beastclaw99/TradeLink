
import React from 'react';
import { Project } from '@/types/database';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, DollarSign, Calendar, Clock } from 'lucide-react';

interface ProjectListItemProps {
  project: Project;
  onViewDetails: (projectId: string) => void;
  onApply?: (projectId: string) => void;
  showApplyButton?: boolean;
  hasApplied?: boolean;
  userSkills: string[];
}

const ProjectListItem: React.FC<ProjectListItemProps> = ({
  project,
  onViewDetails,
  onApply,
  showApplyButton = false,
  hasApplied = false,
  userSkills
}) => {
  const getMatchingSkills = () => {
    if (!project.recommended_skills || !userSkills) return [];
    
    let projectSkills: string[] = [];
    try {
      projectSkills = Array.isArray(project.recommended_skills) 
        ? project.recommended_skills 
        : JSON.parse(project.recommended_skills as any);
    } catch {
      projectSkills = [];
    }
    
    return projectSkills.filter(skill => 
      userSkills.some(userSkill => 
        userSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    );
  };

  const matchingSkills = getMatchingSkills();
  const skillMatchPercentage = project.recommended_skills && userSkills 
    ? Math.round((matchingSkills.length / (Array.isArray(project.recommended_skills) 
        ? project.recommended_skills.length 
        : JSON.parse(project.recommended_skills as any).length)) * 100)
    : 0;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline">{project.category || 'General'}</Badge>
              {skillMatchPercentage > 0 && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {skillMatchPercentage}% skill match
                </Badge>
              )}
              {hasApplied && (
                <Badge variant="default" className="bg-blue-100 text-blue-800">
                  Applied
                </Badge>
              )}
            </div>
          </div>
        </div>

        {project.description && (
          <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
        )}

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          {project.budget && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-gray-400" />
              <span className="text-gray-500">Budget:</span>
              <span className="font-medium">${project.budget.toLocaleString()}</span>
            </div>
          )}
          {project.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-gray-500">Location:</span>
              <span className="font-medium">{project.location}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-gray-500">Posted:</span>
            <span className="font-medium">
              {project.created_at ? new Date(project.created_at).toLocaleDateString() : 'N/A'}
            </span>
          </div>
          {project.timeline && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-gray-500">Timeline:</span>
              <span className="font-medium">{project.timeline}</span>
            </div>
          )}
        </div>

        {matchingSkills.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">Matching skills:</p>
            <div className="flex flex-wrap gap-1">
              {matchingSkills.map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs bg-green-50 text-green-700">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(project.id)}
          >
            View Details
          </Button>
          
          {showApplyButton && !hasApplied && onApply && (
            <Button
              size="sm"
              onClick={() => onApply(project.id)}
            >
              Apply Now
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectListItem;
