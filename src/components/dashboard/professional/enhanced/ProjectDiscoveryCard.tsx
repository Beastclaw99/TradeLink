
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, DollarSign, Clock, Star, Users, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Project, Application } from '../../types';

export interface ProjectDiscoveryCardProps {
  project: Project;
  userSkills: string[];
  onApply: (projectId: string) => void;
}

const ProjectDiscoveryCard: React.FC<ProjectDiscoveryCardProps> = ({
  project,
  userSkills,
  onApply
}) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency?.toLowerCase()) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateSkillMatch = () => {
    if (!project.recommended_skills || !userSkills.length) return 0;
    
    const projectSkills = Array.isArray(project.recommended_skills) 
      ? project.recommended_skills 
      : project.recommended_skills.split(',').map(skill => skill.trim());
    
    const matchingSkills = projectSkills.filter(skill => 
      userSkills.some(userSkill => 
        userSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    );
    
    return Math.round((matchingSkills.length / projectSkills.length) * 100);
  };

  const skillMatchPercentage = calculateSkillMatch();

  const truncatedDescription = project.description?.length > 200 
    ? project.description.substring(0, 200) + '...'
    : project.description;

  const projectSkills = Array.isArray(project.recommended_skills) 
    ? project.recommended_skills 
    : project.recommended_skills?.split(',').map(skill => skill.trim()) || [];

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{project.title}</CardTitle>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getStatusColor(project.status)}>
                {project.status}
              </Badge>
              {project.urgency && (
                <Badge className={getUrgencyColor(project.urgency)}>
                  {project.urgency}
                </Badge>
              )}
              {skillMatchPercentage > 0 && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {skillMatchPercentage}% skill match
                </Badge>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              ${project.budget?.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">Budget</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <p className="text-gray-700">
            {showFullDescription ? project.description : truncatedDescription}
          </p>
          {project.description && project.description.length > 200 && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-blue-600 hover:text-blue-800 text-sm mt-1"
            >
              {showFullDescription ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            {project.location || 'Location not specified'}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            {project.deadline 
              ? format(new Date(project.deadline), 'MMM d, yyyy')
              : 'No deadline specified'
            }
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            {project.expected_timeline || 'Timeline not specified'}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-2" />
            {project.category || 'Category not specified'}
          </div>
        </div>

        {projectSkills.length > 0 && (
          <div>
            <h4 className="font-medium text-sm text-gray-700 mb-2">Required Skills:</h4>
            <div className="flex flex-wrap gap-2">
              {projectSkills.map((skill, index) => {
                const isMatched = userSkills.some(userSkill => 
                  userSkill.toLowerCase().includes(skill.toLowerCase()) ||
                  skill.toLowerCase().includes(userSkill.toLowerCase())
                );
                
                return (
                  <Badge 
                    key={index}
                    variant={isMatched ? "default" : "outline"}
                    className={isMatched ? "bg-green-100 text-green-800" : ""}
                  >
                    {isMatched && <CheckCircle className="w-3 h-3 mr-1" />}
                    {skill}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        {project.requirements && project.requirements.length > 0 && (
          <div>
            <h4 className="font-medium text-sm text-gray-700 mb-2">Requirements:</h4>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              {project.requirements.slice(0, 3).map((req, index) => (
                <li key={index}>{req}</li>
              ))}
              {project.requirements.length > 3 && (
                <li className="text-blue-600">+ {project.requirements.length - 3} more requirements</li>
              )}
            </ul>
          </div>
        )}

        <div className="pt-4 border-t">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Posted {format(new Date(project.created_at), 'MMM d, yyyy')}
            </div>
            <Button 
              onClick={() => onApply(project.id)}
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
