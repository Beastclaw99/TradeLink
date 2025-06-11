import React, { useState } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Project, ProjectStatus, ProjectMilestone, ProjectDeliverable, Application } from '@/types/database';
import { Milestone } from '@/components/project/creation/types';
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
  Eye,
  User,
  Tag
} from "lucide-react";
import EditProjectForm from './projects/EditProjectForm';
import EmptyProjectState from './projects/EmptyProjectState';
import ProjectUpdateTimeline from "@/components/project/ProjectUpdateTimeline";
import ProjectMilestones from "@/components/project/ProjectMilestones";
import ProjectDeliverables from "@/components/project/ProjectDeliverables";
import { ProgressIndicator } from "@/components/ui/progress-indicator";
import ProjectProgressOverview from '@/components/project/ProjectProgressOverview';
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

interface ExtendedProject extends Project {
  milestones?: ProjectMilestone[];
  deliverables?: ProjectDeliverable[];
  client?: {
    first_name: string | null;
    last_name: string | null;
    profile_image_url: string | null;
  };
  professional?: {
    first_name: string | null;
    last_name: string | null;
    profile_image_url: string | null;
  };
}

interface ProjectsTabProps {
  isLoading: boolean;
  projects: ExtendedProject[];
  applications: Application[];
  selectedProject: ExtendedProject | null;
  setSelectedProject: (project: ExtendedProject | null) => void;
  handleAddMilestone: (projectId: string, milestone: Omit<ProjectMilestone, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  handleEditMilestone: (projectId: string, milestoneId: string, updates: Partial<ProjectMilestone>) => Promise<void>;
  handleDeleteMilestone: (projectId: string, milestoneId: string) => Promise<void>;
  fetchProjectDetails: (projectId: string) => Promise<ExtendedProject>;
  error: string | null;
  onEditProject: (project: ExtendedProject) => void;
  onDeleteProject: (projectId: string) => void;
  onAddMilestone: (projectId: string, milestone: Omit<ProjectMilestone, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onEditMilestone: (projectId: string, milestoneId: string, updates: Partial<ProjectMilestone>) => Promise<void>;
}

const getStatusVariant = (status: ProjectStatus | null): "default" | "destructive" | "secondary" | "outline" => {
  switch (status) {
    case 'completed': return 'default';
    case 'in_progress': return 'default';
    case 'assigned': return 'secondary';
    case 'open': return 'outline';
    case 'cancelled': return 'destructive';
    default: return 'default';
  }
};

const getProjectSteps = (project: ExtendedProject) => {
  const steps = [
    { id: 'draft', title: 'Draft', status: project.status === 'draft' ? 'current' as const : 'completed' as const },
    { id: 'open', title: 'Open', status: project.status === 'open' ? 'current' as const : 
      ['draft'].includes(project.status || '') ? 'pending' as const : 'completed' as const },
    { id: 'assigned', title: 'Assigned', status: project.status === 'assigned' ? 'current' as const : 
      ['draft', 'open'].includes(project.status || '') ? 'pending' as const : 'completed' as const },
    { id: 'in_progress', title: 'In Progress', status: project.status === 'in_progress' ? 'current' as const : 
      ['draft', 'open', 'assigned'].includes(project.status || '') ? 'pending' as const : 'completed' as const },
    { id: 'work_submitted', title: 'Work Submitted', status: project.status === 'work_submitted' ? 'current' as const : 
      ['draft', 'open', 'assigned', 'in_progress'].includes(project.status || '') ? 'pending' as const : 'completed' as const },
    { id: 'work_approved', title: 'Work Approved', status: project.status === 'work_approved' ? 'current' as const : 
      ['draft', 'open', 'assigned', 'in_progress', 'work_submitted', 'work_revision_requested'].includes(project.status || '') ? 'pending' as const : 'completed' as const },
    { id: 'completed', title: 'Completed', status: project.status === 'completed' ? 'completed' as const : 'pending' as const }
  ];
  return steps;
};

const getProjectProgress = (project: ExtendedProject): number => {
  if (!project.milestones?.length) return 0;
  const completedMilestones = project.milestones.filter(m => m.is_complete).length;
  return Math.round((completedMilestones / project.milestones.length) * 100);
};

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
  const [activeTab, setActiveTab] = useState<Record<string, string>>({});
  const [loadingDetails, setLoadingDetails] = useState<string | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  const handleProjectSelect = async (projectId: string) => {
    if (expandedProjectId === projectId) {
      setExpandedProjectId(null);
      setSelectedProject(null);
      return;
    }
    setLoadingDetails(projectId);
    try {
      const projectDetails = await fetchProjectDetails(projectId);
      setSelectedProject(projectDetails);
      setExpandedProjectId(projectId);
      setActiveTab((prev) => ({ ...prev, [projectId]: 'timeline' }));
    } catch (e) {
      setExpandedProjectId(null);
      setSelectedProject(null);
    } finally {
      setLoadingDetails(null);
    }
  };

  const convertToMilestone = (milestone: ProjectMilestone): Milestone => ({
    id: milestone.id,
    title: milestone.title,
    description: milestone.description || '',
    due_date: milestone.due_date || null,
    status: milestone.status || 'not_started',
    is_complete: milestone.is_complete || false,
    requires_deliverable: milestone.requires_deliverable || false,
    created_by: milestone.created_by || null,
    created_at: milestone.created_at || new Date().toISOString(),
    updated_at: milestone.updated_at || new Date().toISOString(),
    project_id: milestone.project_id || '',
    deliverables: [],
    tasks: []
  });

  const handleDeleteClick = (projectId: string) => {
    setProjectToDelete(projectId);
  };

  const handleDeleteCancel = () => {
    setProjectToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (projectToDelete) {
      await onDeleteProject(projectToDelete);
      setProjectToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading projects...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (projects.length === 0) {
    return <EmptyProjectState message="No projects found" />;
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <Card key={project.id}>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <CardTitle className="text-xl">{project.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {project.description}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditProject(project)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedProject(project)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <span>Budget: ${project.budget}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>Location: {project.location || 'Remote'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>Timeline: {project.expected_timeline}</span>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Project Progress</span>
                <span className="text-gray-600">{getProjectProgress(project)}%</span>
              </div>
              <Progress value={getProjectProgress(project)} className="h-2 mt-2" />
              <ProgressIndicator 
                steps={getProjectSteps(project)}
                orientation="horizontal"
              />
            </div>
          </CardContent>

          {expandedProjectId === project.id && selectedProject && (
            <CardContent>
              <Tabs value={activeTab[project.id] || 'timeline'} onValueChange={(value) => setActiveTab((prev) => ({ ...prev, [project.id]: value }))}>
                <TabsList>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="milestones">Milestones</TabsTrigger>
                  <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
                </TabsList>

                <TabsContent value="timeline">
                  <ProjectUpdateTimeline 
                    projectId={project.id} 
                    isProfessional={false}
                    projectStatus={selectedProject.status || 'open'}
                  />
                </TabsContent>

                <TabsContent value="milestones">
                  <ProjectMilestones
                    milestones={selectedProject.milestones?.map(convertToMilestone) || []}
                    isClient={true}
                    onAddMilestone={async (milestone) => {
                      if (!selectedProject) return;
                      await handleAddMilestone(selectedProject.id, {
                        ...milestone,
                        due_date: milestone.due_date || null,
                        created_by: selectedProject.client_id || null
                      });
                    }}
                    onEditMilestone={async (milestoneId, updates) => {
                      if (!selectedProject) return;
                      await handleEditMilestone(selectedProject.id, milestoneId, {
                        ...updates,
                        due_date: updates.due_date || null
                      });
                    }}
                    onDeleteMilestone={async (milestoneId) => {
                      if (!selectedProject) return;
                      await handleDeleteMilestone(selectedProject.id, milestoneId);
                    }}
                    onUpdateTaskStatus={async (milestoneId, taskId, completed) => {
                      // Implement task status update logic here
                    }}
                    projectId={selectedProject.id}
                    projectStatus={selectedProject.status || 'open'}
                  />
                </TabsContent>

                <TabsContent value="deliverables">
                  <ProjectDeliverables projectId={project.id} />
                </TabsContent>
              </Tabs>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
};

export default ProjectsTab;
