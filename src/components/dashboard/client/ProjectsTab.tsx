import React, { useState } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Project } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Briefcase, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  MapPin, 
  DollarSign,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Target,
  FileText,
  Edit,
  Eye
} from "lucide-react";
import EditProjectForm from './projects/EditProjectForm';
import EmptyProjectState from './projects/EmptyProjectState';
import ProjectUpdateTimeline from "@/components/project/ProjectUpdateTimeline";
import ProjectMilestones from "@/components/project/ProjectMilestones";
import ProjectDeliverables from "@/components/project/ProjectDeliverables";
import { ProgressIndicator } from "@/components/ui/progress-indicator";
import ProjectProgressOverview from '@/components/project/ProjectProgressOverview';
import { ProjectStatus } from '@/types/projectUpdates';
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

interface ProjectsTabProps {
  isLoading: boolean;
  projects: Project[];
  applications: any[];
  editProject: Project | null;
  projectToDelete: string | null;
  editedProject: {
    title: string;
    description: string;
    budget: string;
  };
  isSubmitting: boolean;
  setEditedProject: (project: { title: string; description: string; budget: string }) => void;
  handleEditInitiate: (project: Project) => void;
  handleEditCancel: () => void;
  handleUpdateProject: (project: Project) => void;
  handleDeleteInitiate: (projectId: string) => void;
  handleDeleteCancel: () => void;
  handleDeleteProject: (projectId: string) => void;
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
  handleAddMilestone: (projectId: string, milestone: Omit<Milestone, 'id'>) => Promise<void>;
  handleEditMilestone: (projectId: string, milestoneId: string, updates: Partial<Milestone>) => Promise<void>;
  handleDeleteMilestone: (projectId: string, milestoneId: string) => Promise<void>;
  fetchProjectDetails: (projectId: string) => Promise<any>;
  error: string | null;
  onEditProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
}

export const ProjectsTab: React.FC<ProjectsTabProps> = ({
  projects,
  isLoading,
  error,
  onEditProject,
  onDeleteProject,
  selectedProject,
  setSelectedProject,
  handleAddMilestone,
  handleEditMilestone,
  handleDeleteMilestone,
  fetchProjectDetails
}) => {
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleProjectSelect = async (projectId: string) => {
    try {
      if (expandedProjectId === projectId) {
        setExpandedProjectId(null);
        setSelectedProject(null);
        return;
      }

      const projectDetails = await fetchProjectDetails(projectId);
      if (!projectDetails) {
        throw new Error('Failed to fetch project details');
      }

      // Ensure project has all required fields
      const enrichedProject = {
        ...projectDetails,
        milestones: projectDetails.milestones || [],
        deliverables: projectDetails.deliverables || [],
        status: projectDetails.status || 'draft'
      };

      setSelectedProject(enrichedProject);
      setExpandedProjectId(projectId);
    } catch (error: any) {
      console.error('Error selecting project:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to load project details',
        variant: "destructive"
      });
      setExpandedProjectId(null);
      setSelectedProject(null);
    }
  };

  const renderProjectCard = (project: Project) => {
    const isExpanded = expandedProjectId === project.id;
    const isSelected = selectedProject?.id === project.id;

    return (
      <Card key={project.id} className="mb-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h3 className="text-lg font-semibold">{project.title}</h3>
                <p className="text-sm text-muted-foreground">
                  Created: {new Date(project.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={getStatusVariant(project.status)}>
                {project.status}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleProjectSelect(project.id)}
              >
                <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {isExpanded && isSelected && (
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">{project.description}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Budget:</span>
                    <span className="ml-2">${project.budget}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Timeline:</span>
                    <span className="ml-2">{project.timeline} days</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Category:</span>
                    <span className="ml-2">{project.category}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Location:</span>
                    <span className="ml-2">{project.location}</span>
                  </div>
                </div>
              </div>

              {project.milestones && project.milestones.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Milestones</h4>
                  <div className="space-y-2">
                    {project.milestones.map((milestone) => (
                      <div key={milestone.id} className="flex items-center justify-between p-2 bg-muted rounded">
                        <div>
                          <p className="font-medium">{milestone.title}</p>
                          <p className="text-sm text-muted-foreground">{milestone.description}</p>
                        </div>
                        <Badge variant={getStatusVariant(milestone.status)}>
                          {milestone.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => onEditProject(project)}
                >
                  Edit Project
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => onDeleteProject(project.id)}
                >
                  Delete Project
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    );
  };

  if (isLoading) {
    return <div>Loading projects...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!projects || projects.length === 0) {
    return <div>No projects found.</div>;
  }

  return (
    <div className="space-y-4">
      {projects.map(renderProjectCard)}
    </div>
  );
};

export default ProjectsTab;
