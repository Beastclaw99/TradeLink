
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";
import { Project, Application } from '../types';

interface AvailableProjectsTabProps {
  isLoading: boolean;
  projects: Project[];
  applications: Application[];
  skills: string[];
  selectedProject: string | null;
  setSelectedProject: (id: string | null) => void;
  bidAmount: number | null;
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
  const availableProjects = projects.filter(p => p.status === 'open');
  
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Available Projects</h2>
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span 
                key={index} 
                className="px-2 py-1 bg-ttc-blue-50 text-ttc-blue-700 text-xs rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>
      
      {isLoading ? (
        <p>Loading projects...</p>
      ) : availableProjects.length === 0 ? (
        <div className="text-center py-8">
          <Briefcase className="w-12 h-12 mx-auto text-ttc-neutral-400" />
          <p className="mt-4 text-ttc-neutral-600">No matching projects available at the moment.</p>
          {skills.length === 0 && (
            <p className="mt-2 text-sm text-ttc-neutral-500">
              Add skills to your profile to see matching projects.
            </p>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {availableProjects.map(project => {
            // Check if user has already applied to this project
            const hasApplied = applications.some(app => 
              app.project_id === project.id && 
              app.status !== 'withdrawn'
            );
            
            return (
              <Card key={project.id}>
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                  <CardDescription className="flex items-center justify-between">
                    <span>Posted on {new Date(project.created_at || '').toLocaleDateString()}</span>
                    <span>by {project.client?.first_name} {project.client?.last_name}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-ttc-neutral-600 mb-4">{project.description}</p>
                  <p className="font-medium">Budget: ${project.budget}</p>
                </CardContent>
                <CardFooter>
                  {hasApplied ? (
                    <Button variant="outline" disabled className="w-full">
                      Already Applied
                    </Button>
                  ) : (
                    <Button 
                      className="w-full bg-ttc-blue-700 hover:bg-ttc-blue-800"
                      onClick={() => {
                        setSelectedProject(project.id);
                        if (project.budget) {
                          setBidAmount(project.budget);
                        }
                      }}
                    >
                      Apply for this Project
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
};

export default AvailableProjectsTab;
