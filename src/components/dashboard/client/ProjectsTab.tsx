
import React, { useState } from 'react';
import { Project } from '../types';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle } from "lucide-react";
import EmptyProjectState from './projects/EmptyProjectState';
import ProjectUpdateTimeline from "@/components/project/ProjectUpdateTimeline";
import ProjectMilestones from "@/components/project/ProjectMilestones";
import ProjectDeliverables from "@/components/project/ProjectDeliverables";
import ProjectProgressOverview from '@/components/project/ProjectProgressOverview';
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold';
  deliverables: any[];
  tasks?: any[];
}

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

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'completed': return 'success';
    case 'in_progress': return 'default';
    case 'assigned': return 'secondary';
    case 'open': return 'outline';
    case 'cancelled': return 'destructive';
    default: return 'default';
  }
};

export const ProjectsTab: React.FC<ProjectsTabProps> = ({
  projects,
  isLoading, 
  error,
  selectedProject,
  setSelectedProject,
  fetchProjectDetails
}) => {
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Record<string, string>>({});
  const [loadingDetails, setLoadingDetails] = useState<string | null>(null);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading projects...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {(!projects || projects.length === 0) ? (
        <EmptyProjectState message="You haven't created any projects yet. Start by posting your first project!" />
      ) : (
        projects.map((project) => {
          const isExpanded = expandedProjectId === project.id;
          return (
            <Card key={project.id} className="mb-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{project.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Created: {project.created_at ? new Date(project.created_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getStatusVariant(project.status || 'open')}>
                      {project.status || 'open'}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleProjectSelect(project.id)}
                      disabled={loadingDetails === project.id}
                    >
                      <span className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {isExpanded && selectedProject && selectedProject.id === project.id && (
                <CardContent>
                  <Tabs
                    value={activeTab[project.id] || 'timeline'}
                    onValueChange={(tab) => setActiveTab((prev) => ({ ...prev, [project.id]: tab }))}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-4 mb-4">
                      <TabsTrigger value="timeline">Timeline</TabsTrigger>
                      <TabsTrigger value="milestones">Milestones</TabsTrigger>
                      <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
                      <TabsTrigger value="details">Details</TabsTrigger>
                    </TabsList>
                    <TabsContent value="timeline">
                      <ProjectUpdateTimeline 
                        projectId={selectedProject.id} 
                        projectStatus={selectedProject.status}
                        isProfessional={false}
                      />
                    </TabsContent>
                    <TabsContent value="milestones">
                      <ProjectMilestones 
                        projectId={selectedProject.id}
                        projectStatus={selectedProject.status}
                        milestones={selectedProject.milestones || []}
                        isClient={true}
                        onAddMilestone={async () => {}}
                        onEditMilestone={async () => {}}
                        onDeleteMilestone={async () => {}}
                        onUpdateTaskStatus={async () => {}}
                      />
                    </TabsContent>
                    <TabsContent value="deliverables">
                      <ProjectDeliverables 
                        projectId={selectedProject.id}
                        canUpload={false}
                      />
                    </TabsContent>
                    <TabsContent value="details">
                      <ProjectProgressOverview project={selectedProject} />
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Project Details</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Budget:</span>
                            <span className="ml-2">${selectedProject.budget || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Timeline:</span>
                            <span className="ml-2">{selectedProject.timeline || selectedProject.expected_timeline || 'N/A'} days</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Category:</span>
                            <span className="ml-2">{selectedProject.category || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Location:</span>
                            <span className="ml-2">{selectedProject.location || 'N/A'}</span>
                          </div>
                        </div>
                        {selectedProject.requirements && (
                          <div className="col-span-2 mt-2">
                            <span className="text-muted-foreground">Requirements:</span>
                            <ul className="list-disc list-inside mt-1">
                              {selectedProject.requirements.map((req: string, idx: number) => (
                                <li key={idx}>{req}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              )}
            </Card>
          );
        })
      )}
    </div>
  );
};

export default ProjectsTab;
