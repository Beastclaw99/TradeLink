
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, DollarSign, Star, Clock, User, Briefcase, AlertTriangle } from "lucide-react";
import { Project } from '../../types';

interface ProjectDiscoveryCardProps {
  project: Project;
  userSkills: string[];
  onApply: (projectId: string) => void;
}

const ProjectDiscoveryCard: React.FC<ProjectDiscoveryCardProps> = ({
  project,
  userSkills,
  onApply
}) => {
  // Calculate skill match
  const projectSkills = Array.isArray(project.required_skills) 
    ? project.required_skills 
    : (project.required_skills?.toString().split(',').map(skill => skill.trim()) || []);

  const matchingSkills = projectSkills.filter(skill => 
    userSkills.some(userSkill => 
      userSkill.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(userSkill.toLowerCase())
    )
  );

  const skillMatchPercentage = projectSkills.length > 0 
    ? Math.round((matchingSkills.length / projectSkills.length) * 100) 
    : 100;

  const getSkillMatchColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-100 text-green-800 border-green-200';
    if (percentage >= 50) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency?.toLowerCase()) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2 line-clamp-2">{project.title}</CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={getSkillMatchColor(skillMatchPercentage)}>
                <Star className="w-3 h-3 mr-1" />
                {skillMatchPercentage}% Match
              </Badge>
              {project.urgency && (
                <Badge className={getUrgencyColor(project.urgency)}>
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {project.urgency}
                </Badge>
              )}
              {project.category && (
                <Badge variant="outline">
                  <Briefcase className="w-3 h-3 mr-1" />
                  {project.category}
                </Badge>
              )}
            </div>
          </div>
          <div className="text-right ml-4">
            <div className="text-xl font-bold text-green-600">
              ${project.budget?.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">Budget</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-gray-700 text-sm line-clamp-3">{project.description}</p>

        {/* Project Details Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          {project.location && (
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">{project.location}</span>
            </div>
          )}
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">
              {project.deadline 
                ? new Date(project.deadline).toLocaleDateString()
                : 'Flexible deadline'
              }
            </span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{project.expected_timeline || 'Timeline TBD'}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <User className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">
              {project.client 
                ? `${project.client.first_name} ${project.client.last_name}`
                : 'Client'
              }
            </span>
          </div>
        </div>

        {/* Skills Section */}
        {projectSkills.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-gray-700">Required Skills:</h4>
            <div className="flex flex-wrap gap-1">
              {projectSkills.slice(0, 4).map((skill, index) => {
                const isMatching = matchingSkills.includes(skill);
                return (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className={`text-xs ${isMatching ? 'bg-green-50 border-green-300 text-green-700' : ''}`}
                  >
                    {skill}
                  </Badge>
                );
              })}
              {projectSkills.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{projectSkills.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Matching Skills Highlight */}
        {matchingSkills.length > 0 && (
          <div className="bg-green-50 p-2 rounded-lg">
            <p className="text-xs text-green-700 font-medium mb-1">
              ✓ Your matching skills:
            </p>
            <div className="flex flex-wrap gap-1">
              {matchingSkills.slice(0, 3).map(skill => (
                <Badge key={skill} variant="secondary" className="text-xs bg-green-100 text-green-800">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="pt-3 border-t">
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500">
              Posted {new Date(project.created_at).toLocaleDateString()}
            </div>
            <Button 
              onClick={() => onApply(project.id)}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Apply Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectDiscoveryCard;
