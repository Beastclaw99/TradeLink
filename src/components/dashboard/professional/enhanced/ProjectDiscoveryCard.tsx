
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, DollarSign, User, Star, AlertCircle, CheckCircle2, TrendingUp } from "lucide-react";
import { Project, Application } from '../../types';

interface ProjectDiscoveryCardProps {
  project: Project;
  applications: Application[];
  userSkills: string[];
  onApply: (projectId: string) => void;
}

const ProjectDiscoveryCard: React.FC<ProjectDiscoveryCardProps> = ({
  project,
  applications,
  userSkills,
  onApply
}) => {
  const hasApplied = applications.some(app => 
    app.project_id === project.id && app.status !== 'withdrawn'
  );
  
  const userApplication = applications.find(app => app.project_id === project.id);
  
  // Properly handle the required_skills field which can be string or array
  const requiredSkills = (() => {
    if (!project.required_skills) return [];
    if (Array.isArray(project.required_skills)) return project.required_skills;
    if (typeof project.required_skills === 'string') {
      return project.required_skills.split(',').map(s => s.trim()).filter(s => s.length > 0);
    }
    return [];
  })();
  
  const matchingSkills = userSkills.filter(skill => 
    requiredSkills.some(reqSkill => 
      reqSkill.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(reqSkill.toLowerCase())
    )
  );
  
  const skillMatchPercentage = requiredSkills.length > 0 
    ? Math.round((matchingSkills.length / requiredSkills.length) * 100) 
    : 100;

  const getUrgencyColor = (urgency: string | null) => {
    switch (urgency?.toLowerCase()) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusDisplay = () => {
    if (!userApplication) return null;
    
    const statusConfig = {
      pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50', text: 'Application Pending' },
      accepted: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', text: 'Application Accepted!' },
      rejected: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50', text: 'Application Declined' },
      withdrawn: { icon: AlertCircle, color: 'text-gray-600', bg: 'bg-gray-50', text: 'Application Withdrawn' }
    };
    
    const config = statusConfig[userApplication.status as keyof typeof statusConfig];
    if (!config) return null;
    
    const Icon = config.icon;
    
    return (
      <div className={`flex items-center gap-2 p-3 rounded-lg ${config.bg} border`}>
        <Icon className={`h-4 w-4 ${config.color}`} />
        <span className={`text-sm font-medium ${config.color}`}>
          {config.text}
        </span>
        {userApplication.status === 'pending' && (
          <span className="text-xs text-gray-500">
            Applied {new Date(userApplication.created_at).toLocaleDateString()}
          </span>
        )}
      </div>
    );
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-l-4 border-l-ttc-blue-500">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2 group-hover:text-ttc-blue-700 transition-colors">
              {project.title}
            </CardTitle>
            <CardDescription className="text-sm mb-3">
              {project.description?.substring(0, 120)}
              {project.description && project.description.length > 120 ? '...' : ''}
            </CardDescription>
          </div>
          {project.urgency && (
            <Badge variant="outline" className={getUrgencyColor(project.urgency)}>
              {project.urgency}
            </Badge>
          )}
        </div>
        
        {/* Project Meta Information */}
        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
          {project.budget && (
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              <span>${project.budget.toLocaleString()}</span>
            </div>
          )}
          {project.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{project.location}</span>
            </div>
          )}
          {project.client && (
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{project.client.first_name} {project.client.last_name}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Posted {new Date(project.created_at || '').toLocaleDateString()}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Skills Matching Section */}
        {requiredSkills.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Skills Match</span>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-gray-500" />
                <Badge 
                  variant={skillMatchPercentage >= 80 ? "default" : skillMatchPercentage >= 50 ? "secondary" : "outline"}
                  className={
                    skillMatchPercentage >= 80 ? "bg-green-100 text-green-800" : 
                    skillMatchPercentage >= 50 ? "bg-yellow-100 text-yellow-800" : 
                    "bg-red-100 text-red-800"
                  }
                >
                  {skillMatchPercentage}% Match
                </Badge>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {requiredSkills.slice(0, 4).map((skill, index) => {
                const isMatching = matchingSkills.some(userSkill => 
                  userSkill.toLowerCase().includes(skill.toLowerCase()) ||
                  skill.toLowerCase().includes(userSkill.toLowerCase())
                );
                
                return (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className={isMatching ? "bg-green-50 text-green-700 border-green-200" : ""}
                  >
                    {isMatching && <Star className="w-3 h-3 mr-1" />}
                    {skill}
                  </Badge>
                );
              })}
              {requiredSkills.length > 4 && (
                <Badge variant="outline" className="text-gray-500">
                  +{requiredSkills.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Application Status */}
        {getStatusDisplay()}

        {/* Project Timeline */}
        {project.expected_timeline && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>Timeline: {project.expected_timeline}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-4">
        {hasApplied ? (
          <Button variant="outline" disabled className="w-full">
            {userApplication?.status === 'pending' && 'Application Submitted'}
            {userApplication?.status === 'accepted' && 'Application Accepted'}
            {userApplication?.status === 'rejected' && 'Application Declined'}
            {userApplication?.status === 'withdrawn' && 'Application Withdrawn'}
          </Button>
        ) : (
          <Button 
            className="w-full bg-ttc-blue-700 hover:bg-ttc-blue-800"
            onClick={() => onApply(project.id)}
          >
            Apply for Project
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProjectDiscoveryCard;
