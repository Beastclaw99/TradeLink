import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, ChevronDown, ChevronUp } from "lucide-react";
import { Project } from '../types';
import ProjectUpdateTimeline from "@/components/project/ProjectUpdateTimeline";

interface ActiveProjectsTabProps {
  isLoading: boolean;
  projects: Project[];
  userId: string;
  markProjectComplete: (projectId: string) => Promise<void>;
}

const ActiveProjectsTab: React.FC<ActiveProjectsTabProps> = ({ 
  isLoading, 
  projects, 
  userId, 
  markProjectComplete 
}) => {
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});

  const toggleProjectExpansion = (projectId: string) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Your Active Projects</h2>
      {isLoading ? (
        <p>Loading active projects...</p>
      ) : projects.filter(p => p.status === 'assigned' && p.assigned_to === userId).length === 0 ? (
        <div className="text-center py-8">
          <Briefcase className="w-12 h-12 mx-auto text-ttc-neutral-400" />
          <p className="mt-4 text-ttc-neutral-600">You don't have any active projects at the moment.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-1">
          {projects
            .filter(p => p.status === 'assigned' && p.assigned_to === userId)
            .map(project => (
              <Card key={project.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                  <CardTitle>{project.title}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleProjectExpansion(project.id)}
                      className="ml-2"
                    >
                      {expandedProjects[project.id] ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <CardDescription className="flex items-center justify-between">
                    <span>Started on {new Date(project.created_at || '').toLocaleDateString()}</span>
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      In Progress
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                  <p className="text-sm text-ttc-neutral-600 mb-4">{project.description}</p>
                  <p className="font-medium">Budget: ${project.budget}</p>
                  <p className="text-sm mt-4">Client: {project.client?.first_name} {project.client?.last_name}</p>
                    </div>
                    
                    {expandedProjects[project.id] && (
                      <div className="mt-6 border-t pt-4">
                        <h3 className="text-lg font-semibold mb-4">Project Updates</h3>
                        <ProjectUpdateTimeline projectId={project.id} />
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => markProjectComplete(project.id)}
                  >
                    Mark as Completed
                  </Button>
                </CardFooter>
              </Card>
          ))}
        </div>
      )}
      
      <h2 className="text-2xl font-bold mb-4 mt-8">Completed Projects</h2>
      {projects.filter(p => p.status === 'completed' && p.assigned_to === userId).length === 0 ? (
        <div className="text-center py-8">
          <p className="text-ttc-neutral-600">You don't have any completed projects yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {projects
            .filter(p => p.status === 'completed' && p.assigned_to === userId)
            .map(project => (
              <Card key={project.id}>
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                  <CardDescription className="flex items-center justify-between">
                    <span>Completed</span>
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      Completed
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-ttc-neutral-600 mb-4">{project.description}</p>
                  <p className="font-medium">Budget: ${project.budget}</p>
                  <p className="text-sm mt-4">Client: {project.client?.first_name} {project.client?.last_name}</p>
                </CardContent>
              </Card>
          ))}
        </div>
      )}
    </>
  );
};

export default ActiveProjectsTab;
