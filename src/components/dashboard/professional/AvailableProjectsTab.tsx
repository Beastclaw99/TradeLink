
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Project, Application } from '../types';
import { Badge } from "@/components/ui/badge";

interface AvailableProjectsTabProps {
  isLoading: boolean;
  projects: Project[];
  applications: Application[];
  skills?: string[];
  setSelectedProject: (project: Project) => void;
  setBidAmount: (amount: number | null) => void;
}

const AvailableProjectsTab: React.FC<AvailableProjectsTabProps> = ({
  isLoading,
  projects,
  applications,
  skills,
  setSelectedProject,
  setBidAmount
}) => {
  const filteredProjects = projects.filter((project: Project) => {
    // Filter out projects that are not open
    if (project.status !== 'open') return false;
    
    // Filter out projects that the user has already applied to
    if (applications.some((app: Application) => app.project_id === project.id)) return false;
    
    // If user has skills, filter projects that match at least one required skill
    if (skills && skills.length > 0) {
      const projectSkills = project.required_skills ? JSON.parse(project.required_skills) as string[] : [];
      if (projectSkills.length === 0) return false; // Skip projects with no required skills
      
      // Check if at least one skill matches
      return projectSkills.some(skill => skills.includes(skill));
    }
    
    return true;
  });

  const formatBudget = (budget: number | null | undefined) => {
    if (budget === null || budget === undefined) return 'Not specified';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(budget);
  };

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No available projects match your skills at the moment.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project: Project) => {
            const projectSkills = project.required_skills ? JSON.parse(project.required_skills) as string[] : [];
            const matchingSkills = projectSkills.filter(skill => skills?.includes(skill));
            
            return (
              <Card key={project.id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="line-clamp-1">{project.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Budget</span>
                      <span className="text-sm">{formatBudget(project.budget)}</span>
                    </div>
                    {projectSkills.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Required Skills</span>
                          <span className="text-sm text-ttc-green-600 font-medium">
                            {matchingSkills.length} matching skill{matchingSkills.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {projectSkills.map((skill) => (
                            <Badge
                              key={skill}
                              variant={skills?.includes(skill) ? "default" : "secondary"}
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => {
                      setSelectedProject(project);
                      setBidAmount(project.budget || 0);
                    }}
                  >
                    Apply Now
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AvailableProjectsTab;
