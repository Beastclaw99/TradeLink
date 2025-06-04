
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, MapPin, Clock, CheckCircle2, Star } from "lucide-react";
import { Project } from '../types';

interface ActiveProjectsTabProps {
  projects: Project[];
  markProjectComplete: (projectId: string) => Promise<void>;
}

const ActiveProjectsTab: React.FC<ActiveProjectsTabProps> = ({ 
  projects, 
  markProjectComplete 
}) => {
  const [completingProjects, setCompletingProjects] = useState<Set<string>>(new Set());

  // Filter active projects (assigned or in-progress)
  const activeProjects = projects.filter(project => 
    project.status === 'assigned' || project.status === 'in-progress'
  );

  // Filter completed projects
  const completedProjects = projects.filter(project => 
    project.status === 'completed'
  );

  const handleCompleteProject = async (projectId: string) => {
    setCompletingProjects(prev => new Set(prev).add(projectId));
    try {
      await markProjectComplete(projectId);
    } finally {
      setCompletingProjects(prev => {
        const newSet = new Set(prev);
        newSet.delete(projectId);
        return newSet;
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'assigned':
        return <Calendar className="w-4 h-4" />;
      case 'in-progress':
        return <Clock className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const ProjectCard = ({ project }: { project: Project }) => (
    <Card key={project.id} className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{project.title}</CardTitle>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getStatusColor(project.status)}>
                {getStatusIcon(project.status)}
                <span className="ml-1 capitalize">{project.status.replace('-', ' ')}</span>
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <span>Client: {project.client?.first_name} {project.client?.last_name}</span>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {project.description}
        </p>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gray-500" />
            <span className="text-sm">
              ${project.budget?.toLocaleString() || 'N/A'}
            </span>
          </div>
          
          {project.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{project.location}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm">
              Started: {formatDate(project.created_at)}
            </span>
          </div>
          
          {project.deadline && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm">
                Due: {formatDate(project.deadline)}
              </span>
            </div>
          )}
        </div>
        
        {(project.status === 'assigned' || project.status === 'in-progress') && (
          <div className="flex gap-2">
            <Button
              onClick={() => handleCompleteProject(project.id)}
              disabled={completingProjects.has(project.id)}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {completingProjects.has(project.id) ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Marking Complete...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Mark as Complete
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Active Projects Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Active Projects</h2>
          <Badge variant="outline" className="text-sm">
            {activeProjects.length} active
          </Badge>
        </div>
        
        {activeProjects.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Projects</h3>
              <p className="text-gray-500">
                You don't have any active projects at the moment. Check the Available Projects tab to find new opportunities.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {activeProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>

      {/* Completed Projects Section */}
      {completedProjects.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Completed Projects</h2>
            <Badge variant="outline" className="text-sm">
              {completedProjects.length} completed
            </Badge>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            {completedProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveProjectsTab;
