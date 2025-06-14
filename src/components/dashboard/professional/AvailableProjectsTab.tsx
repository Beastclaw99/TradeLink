
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, DollarSign, MapPin, Users } from 'lucide-react';
import { Project, Application } from '../types';

interface AvailableProjectsTabProps {
  isLoading: boolean;
  projects: Project[];
  applications: Application[];
  skills?: string[];
  setSelectedProject: (projectId: string | null) => void;
  setBidAmount: (amount: number | null) => void;
}

export const AvailableProjectsTab: React.FC<AvailableProjectsTabProps> = ({
  isLoading,
  projects,
  applications,
  skills,
  setSelectedProject,
  setBidAmount
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const hasApplied = (projectId: string) => {
    return applications.some(app => app.project_id === projectId);
  };

  const getMatchingSkills = (projectSkills: string[] | null) => {
    if (!projectSkills || !skills) return [];
    
    let parsedProjectSkills: string[] = [];
    try {
      parsedProjectSkills = Array.isArray(projectSkills) ? projectSkills : JSON.parse(projectSkills as any);
    } catch {
      parsedProjectSkills = [];
    }
    
    return parsedProjectSkills.filter(skill => 
      skills.some(userSkill => 
        userSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    );
  };

  const getSkillMatchPercentage = (projectSkills: string[] | null) => {
    if (!projectSkills || !skills) return 0;
    
    let parsedProjectSkills: string[] = [];
    try {
      parsedProjectSkills = Array.isArray(projectSkills) ? projectSkills : JSON.parse(projectSkills as any);
    } catch {
      parsedProjectSkills = [];
    }
    
    if (parsedProjectSkills.length === 0) return 0;
    const matchingSkills = getMatchingSkills(projectSkills);
    return Math.round((matchingSkills.length / parsedProjectSkills.length) * 100);
  };

  // Filter and sort projects
  const openProjects = projects.filter(project => project.status === 'open');

  if (openProjects.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Available Projects</h3>
          <p className="text-gray-600">
            There are currently no open projects matching your criteria. Check back later!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Available Projects</h2>
      
      <div className="space-y-4">
        {openProjects.map((project) => {
          const matchingSkills = getMatchingSkills(project.recommended_skills);
          const skillMatchPercentage = getSkillMatchPercentage(project.recommended_skills);
          const alreadyApplied = hasApplied(project.id);
          
          return (
            <Card key={project.id} className="hover:shadow-md transition-shadow">
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
                      {alreadyApplied && (
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
                    onClick={() => {
                      // View project details logic here
                      console.log('Viewing project details:', project.id);
                    }}
                  >
                    View Details
                  </Button>
                  
                  {!alreadyApplied && (
                    <Button
                      size="sm"
                      onClick={() => {
                        setBidAmount(project.budget || null);
                        setSelectedProject(project.id);
                      }}
                    >
                      Apply Now
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
