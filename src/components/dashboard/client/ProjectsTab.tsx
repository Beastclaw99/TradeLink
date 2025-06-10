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
import { ProjectStatus } from '@/types/projectUpdates';
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Milestone, convertDBMilestoneToMilestone } from '@/components/project/creation/types';

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

const getStatusVariant = (status: string | null): "default" | "destructive" | "secondary" | "outline" => {
  switch (status) {
    case 'completed': return 'default';
    case 'in_progress': return 'default';
    case 'assigned': return 'secondary';
    case 'open': return 'outline';
    case 'cancelled': return 'destructive';
    default: return 'default';
  }
};

const getProjectSteps = (project: Project) => {
  return [
    {
      id: 'assigned',
      title: 'Assigned',
      status: project.status === 'assigned' ? 'current' : 'completed' as 'completed' | 'current' | 'pending'
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      status: project.status === 'in_progress' ? 'current' : 
             ['assigned'].includes(project.status || '') ? 'pending' : 'completed' as 'completed' | 'current' | 'pending'
    },
    {
      id: 'work_submitted',
      title: 'Review',
      status: project.status === 'work_submitted' ? 'current' : 
             ['assigned', 'in_progress'].includes(project.status || '') ? 'pending' : 'completed' as 'completed' | 'current' | 'pending'
    },
    {
      id: 'completed',
      title: 'Completed',
      status: project.status === 'completed' ? 'completed' : 'pending' as 'completed' | 'current' | 'pending'
    }
  ];
};

const getProjectProgress = (project: Project) => {
  if (!project.milestones || project.milestones.length === 0) return 0;
  const completedMilestones = project.milestones.filter(m => m.status === 'completed').length;
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
        <EmptyProjectState message="No projects found" />
      ) : (
        projects.map((project) => {
          const isExpanded = expandedProjectId === project.id;
          return (
            <Card key={project.id} className="mb-4 hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">{project.title}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusVariant(project.status)} className="capitalize">
                          {project.status?.replace('_', ' ') || 'Open'}
                        </Badge>
                        {project.urgency && (
                          <Badge variant="outline" className="text-xs">
                            {project.urgency} Priority
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Created: {new Date(project.created_at || '').toLocaleDateString()}</span>
                      </div>
                      {project.deadline && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>Due: {new Date(project.deadline).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleProjectSelect(project.id)}
                    disabled={loadingDetails === project.id}
                  >
                    {loadingDetails === project.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    ) : (
                      <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    )}
                  </Button>
                </div>
              </CardHeader>
              {isExpanded && selectedProject && selectedProject.id === project.id && (
                <CardContent>
                  {/* Project Progress */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Project Progress</span>
                      <span className="text-gray-600">{getProjectProgress(selectedProject)}%</span>
                    </div>
                    <Progress value={getProjectProgress(selectedProject)} className="h-2" />
                    <ProgressIndicator 
                      steps={getProjectSteps(selectedProject)}
                      orientation="horizontal"
                    />
                  </div>

                  <Separator className="my-6" />

                  <Tabs
                    value={activeTab[project.id] || 'timeline'}
                    onValueChange={(tab) => setActiveTab((prev) => ({ ...prev, [project.id]: tab }))}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-4 mb-4">
                      <TabsTrigger value="timeline" className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Timeline
                      </TabsTrigger>
                      <TabsTrigger value="milestones" className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Milestones
                      </TabsTrigger>
                      <TabsTrigger value="deliverables" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Deliverables
                      </TabsTrigger>
                      <TabsTrigger value="details" className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Details
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="timeline">
                      <ProjectUpdateTimeline 
                        projectId={selectedProject.id} 
                        projectStatus={(() => {
                          const status = selectedProject.status || 'open';
                          const validStatuses: ProjectStatus[] = [
                            'draft', 'open', 'assigned', 'in_progress', 'work_submitted',
                            'work_revision_requested', 'work_approved', 'completed',
                            'archived', 'cancelled', 'disputed'
                          ];
                          return validStatuses.includes(status as ProjectStatus) 
                            ? status as ProjectStatus 
                            : 'open';
                        })()}
                        isProfessional={false}
                      />
                    </TabsContent>

                    <TabsContent value="milestones">
                      <ProjectMilestones 
                        projectId={selectedProject.id}
                        projectStatus={(() => {
                          const status = selectedProject.status || 'open';
                          const validStatuses: ProjectStatus[] = [
                            'draft', 'open', 'assigned', 'in_progress', 'work_submitted',
                            'work_revision_requested', 'work_approved', 'completed',
                            'archived', 'cancelled', 'disputed'
                          ];
                          return validStatuses.includes(status as ProjectStatus) 
                            ? status as ProjectStatus 
                            : 'open';
                        })()}
                        milestones={selectedProject.milestones?.map(m => convertDBMilestoneToMilestone({
                          id: m.id,
                          title: m.title,
                          description: m.description,
                          due_date: m.due_date,
                          status: m.status || 'not_started',
                          project_id: selectedProject.id,
                          tasks: m.tasks || []
                        })) || []}
                        isClient={true}
                        onAddMilestone={async (milestone) => {
                          await handleAddMilestone(selectedProject.id, milestone);
                        }}
                        onEditMilestone={async (milestoneId, updates) => {
                          await handleEditMilestone(selectedProject.id, milestoneId, updates);
                        }}
                        onDeleteMilestone={async (milestoneId) => {
                          await handleDeleteMilestone(selectedProject.id, milestoneId);
                        }}
                        onUpdateTaskStatus={async (milestoneId, taskId, completed) => {
                          // Since this is a client view, we don't need to implement task status updates
                          return;
                        }}
                      />
                    </TabsContent>

                    <TabsContent value="deliverables">
                      <ProjectDeliverables 
                        projectId={selectedProject.id}
                        canUpload={false}
                      />
                    </TabsContent>

                    <TabsContent value="details">
                      <div className="space-y-6">
                        <ProjectProgressOverview
                          milestones={selectedProject.milestones?.map(m => ({
                            id: m.id,
                            title: m.title,
                            description: m.description || undefined,
                            status: (m.status || 'not_started') as 'not_started' | 'in_progress' | 'completed' | 'on_hold',
                            deliverables: [],
                            dueDate: m.due_date || undefined,
                            requires_deliverable: false,
                            progress: 0,
                            project_id: selectedProject.id,
                            created_at: undefined,
                            updated_at: undefined,
                            is_complete: false
                          })) || []}
                          projectStatus={(() => {
                            const status = selectedProject.status || 'open';
                            const validStatuses: ProjectStatus[] = [
                              'draft', 'open', 'assigned', 'in_progress', 'work_submitted',
                              'work_revision_requested', 'work_approved', 'completed',
                              'archived', 'cancelled', 'disputed'
                            ];
                            return validStatuses.includes(status as ProjectStatus) 
                              ? status as ProjectStatus 
                              : 'open';
                          })()}
                          startDate={selectedProject.project_start_time}
                          endDate={selectedProject.deadline}
                          budget={selectedProject.budget}
                          spent={0}
                          created_at={selectedProject.created_at}
                        />

                        <Separator />

                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2 flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Project Details
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Budget:</span>
                                  <span className="font-medium">${selectedProject.budget?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Timeline:</span>
                                  <span>{selectedProject.expected_timeline || 'N/A'} days</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Category:</span>
                                  <span className="capitalize">{selectedProject.category}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Location:</span>
                                  <span>{selectedProject.location || 'Remote'}</span>
                                </div>
                              </div>
                            </div>

                            {selectedProject.requirements && selectedProject.requirements.length > 0 && (
                              <div>
                                <h4 className="font-medium mb-2">Requirements</h4>
                                <ul className="list-disc pl-5 space-y-1 text-sm">
                                  {selectedProject.requirements.map((req, index) => (
                                    <li key={index} className="text-muted-foreground">{req}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          <div className="space-y-4">
                            {selectedProject.required_skills && (
                              <div>
                                <h4 className="font-medium mb-2 flex items-center gap-2">
                                  <Tag className="h-4 w-4" />
                                  Required Skills
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {selectedProject.required_skills.split(',').map((skill, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {skill.trim()}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {selectedProject.description && (
                              <div>
                                <h4 className="font-medium mb-2">Description</h4>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                  {selectedProject.description}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
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
