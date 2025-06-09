
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, DollarSign, AlertCircle, Briefcase, Star } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Project {
  id: string;
  title: string;
  description: string;
  budget: number;
  location: string;
  category: string;
  urgency: string;
  expected_timeline?: string;
  required_skills?: string | string[];
  client_id: string;
  created_at: string;
  status: string;
}

interface ProjectDiscoveryCardProps {
  project: Project;
  onSelectProject: (projectId: string) => void;
  userSkills: string[];
  isSelected: boolean;
}

const ProjectDiscoveryCard: React.FC<ProjectDiscoveryCardProps> = ({
  project,
  onSelectProject,
  userSkills,
  isSelected
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTimelineLabel = (timeline: string) => {
    const labels: Record<string, string> = {
      'less_than_1_month': 'Less than 1 month',
      '1_to_3_months': '1-3 months',
      '3_to_6_months': '3-6 months',
      'more_than_6_months': 'More than 6 months'
    };
    return labels[timeline] || timeline;
  };

  const calculateSkillMatch = () => {
    if (!project.required_skills || !userSkills.length) return 0;
    
    // Ensure required_skills is treated as an array
    const requiredSkillsArray = Array.isArray(project.required_skills) 
      ? project.required_skills 
      : project.required_skills.split(',').map(skill => skill.trim());
    
    const matchingSkills = requiredSkillsArray.filter(skill =>
      userSkills.some(userSkill => 
        userSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    );
    
    return Math.round((matchingSkills.length / requiredSkillsArray.length) * 100);
  };

  const skillMatchPercentage = calculateSkillMatch();

  const getSkillMatchColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    if (percentage >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just posted';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  // Ensure required_skills is treated as an array for rendering
  const requiredSkillsArray = project.required_skills 
    ? (Array.isArray(project.required_skills) 
        ? project.required_skills 
        : project.required_skills.split(',').map(skill => skill.trim()))
    : [];

  return (
    <Card className={`relative transition-all duration-200 hover:shadow-lg cursor-pointer ${
      isSelected ? 'ring-2 ring-ttc-blue-500 bg-ttc-blue-50' : 'hover:shadow-md'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
              {project.title}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="h-4 w-4" />
              <span>{project.location}</span>
              <span>•</span>
              <span>{timeAgo(project.created_at)}</span>
            </div>
          </div>
          <Badge className={getUrgencyColor(project.urgency)}>
            {project.urgency}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-gray-700 text-sm line-clamp-3">
          {project.description}
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="font-semibold text-green-600">
              {formatCurrency(project.budget)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-gray-600">
              {getTimelineLabel(project.expected_timeline || 'Not specified')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-purple-600" />
          <Badge variant="secondary">{project.category}</Badge>
        </div>

        {/* Skills Section */}
        {requiredSkillsArray.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700">Required Skills</h4>
              {userSkills.length > 0 && (
                <div className="flex items-center gap-1">
                  <Star className={`h-4 w-4 ${getSkillMatchColor(skillMatchPercentage)}`} />
                  <span className={`text-sm font-medium ${getSkillMatchColor(skillMatchPercentage)}`}>
                    {skillMatchPercentage}% match
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-1">
              {requiredSkillsArray.slice(0, 3).map((skill, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className={`text-xs ${
                    userSkills.some(userSkill => 
                      userSkill.toLowerCase().includes(skill.toLowerCase()) ||
                      skill.toLowerCase().includes(userSkill.toLowerCase())
                    ) ? 'bg-green-50 text-green-700 border-green-200' : ''
                  }`}
                >
                  {skill}
                </Badge>
              ))}
              {requiredSkillsArray.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{requiredSkillsArray.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Dialog open={showDetails} onOpenChange={setShowDetails}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1">
                View Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{project.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Project Description</h4>
                  <p className="text-gray-700">{project.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-1">Budget</h4>
                    <p className="text-green-600 font-semibold">
                      {formatCurrency(project.budget)}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Timeline</h4>
                    <p className="text-gray-700">
                      {getTimelineLabel(project.expected_timeline || 'Not specified')}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-1">Location</h4>
                  <p className="text-gray-700">{project.location}</p>
                </div>

                {requiredSkillsArray.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">All Required Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {requiredSkillsArray.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className={
                            userSkills.some(userSkill => 
                              userSkill.toLowerCase().includes(skill.toLowerCase()) ||
                              skill.toLowerCase().includes(userSkill.toLowerCase())
                            ) ? 'bg-green-50 text-green-700 border-green-200' : ''
                          }
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <Button
            size="sm"
            className="flex-1"
            onClick={() => onSelectProject(project.id)}
            disabled={isSelected}
          >
            {isSelected ? 'Selected' : 'Apply Now'}
          </Button>
        </div>

        {skillMatchPercentage < 50 && userSkills.length > 0 && (
          <div className="flex items-start gap-2 p-2 bg-yellow-50 rounded-md">
            <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
            <p className="text-xs text-yellow-700">
              Low skill match. Consider improving your skills in the required areas.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectDiscoveryCard;
