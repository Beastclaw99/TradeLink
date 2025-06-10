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
}

const ProjectsTab: React.FC<ProjectsTabProps> = ({ 
  isLoading, 
  projects, 
  applications, 
  editProject, 
  projectToDelete,
  editedProject,
  isSubmitting,
  setEditedProject,
  handleEditInitiate,
  handleEditCancel,
  handleUpdateProject,
  handleDeleteInitiate,
  handleDeleteCancel,
  handleDeleteProject,
  selectedProject,
  setSelectedProject,
  handleAddMilestone,
  handleEditMilestone,
  handleDeleteMilestone,
  fetchProjectDetails,
}) => {
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<Record<string, string>>({});

  const openProjects = projects.filter(p => p.status === 'open');
  const assignedProjects = projects.filter(p => p.status === 'assigned');
  
  const navigateToCreateTab = () => {
    const createTab = document.querySelector('[data-value="create"]');
    if (createTab) {
      (createTab as HTMLElement).click();
    }
  };

  const toggleProjectExpansion = (projectId: string) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  const setProjectTab = (projectId: string, tabValue: string) => {
    setActiveTab(prev => ({
      ...prev,
      [projectId]: tabValue
    }));
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

  const handleProjectSelect = async (projectId: string) => {
    try {
      const projectDetails = await fetchProjectDetails(projectId);
      if (!projectDetails) {
        console.error('No project details returned for project:', projectId);
        return;
      }
      
      // Ensure the project has all required fields
      const enrichedProject = {
        ...projectDetails,
        milestones: projectDetails.milestones || [],
        deliverables: projectDetails.deliverables || [],
        status: projectDetails.status || 'open'
      };
      
      setSelectedProject(enrichedProject);
      toggleProjectExpansion(projectId);
    } catch (error) {
      console.error('Error fetching project details:', error);
      // Optionally show an error toast here
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Your Open Projects</h2>
      {isLoading ? (
        <p>Loading your projects...</p>
      ) : openProjects.length === 0 ? (
        <EmptyProjectState 
          message="You don't have any open projects." 
          showCreateButton={true}
          onCreateClick={navigateToCreateTab}
        />
      ) : (
        <div className="space-y-4">
          {openProjects.map(project => (
            <Card key={project.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{project.title}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>Posted {new Date(project.created_at || '').toLocaleDateString()}</span>
                      {project.location && (
                        <>
                          <MapPin className="h-4 w-4 ml-2" />
                          <span>{project.location}</span>
                        </>
                      )}
                      {project.budget && (
                        <>
                          <DollarSign className="h-4 w-4 ml-2" />
                          <span>${project.budget.toLocaleString()}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleProjectSelect(project.id)}
                  >
                    {expandedProjects[project.id] ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>

              {expandedProjects[project.id] && (
                <CardContent>
                  <Tabs
                    value={activeTab[project.id] || 'overview'}
                    onValueChange={(value) => setProjectTab(project.id, value)}
                  >
                    <TabsList className="mb-4">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="milestones">Milestones</TabsTrigger>
                      <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
                      <TabsTrigger value="updates">Updates</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                      <ProjectProgressOverview
                        milestones={selectedProject?.milestones || []}
                        projectStatus={project.status as ProjectStatus}
                        startDate={project.project_start_time}
                        endDate={project.deadline}
                        budget={project.budget}
                        spent={project.spent}
                        created_at={project.created_at}
                      />
                    </TabsContent>

                    <TabsContent value="milestones">
                      <ProjectMilestones 
                        milestones={selectedProject?.milestones || []}
                        isClient={true}
                        projectId={project.id}
                        projectStatus={(project.status || 'open') as ProjectStatus}
                        onAddMilestone={(milestone) => handleAddMilestone(project.id, milestone)}
                        onEditMilestone={(milestoneId, updates) => handleEditMilestone(project.id, milestoneId, updates)}
                        onDeleteMilestone={(milestoneId) => handleDeleteMilestone(project.id, milestoneId)}
                      />
                    </TabsContent>

                    <TabsContent value="deliverables">
                      <ProjectDeliverables 
                        projectId={project.id}
                        canUpload={false}
                      />
                    </TabsContent>

                    <TabsContent value="updates">
                      <ProjectUpdateTimeline projectId={project.id} />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
      
      <h2 className="text-2xl font-bold mb-4 mt-8">Assigned Projects</h2>
      {isLoading ? (
        <p>Loading your projects...</p>
      ) : assignedProjects.length === 0 ? (
        <EmptyProjectState message="You don't have any assigned projects." />
      ) : (
        <div className="space-y-6">
          {assignedProjects.map(project => (
            <Card key={project.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{project.title}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>Started {new Date(project.project_start_time || '').toLocaleDateString()}</span>
                      {project.location && (
                        <>
                          <MapPin className="h-4 w-4 ml-2" />
                          <span>{project.location}</span>
                        </>
                      )}
                      {project.budget && (
                        <>
                          <DollarSign className="h-4 w-4 ml-2" />
                          <span>${project.budget.toLocaleString()}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleProjectExpansion(project.id)}
                  >
                    {expandedProjects[project.id] ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>

              {expandedProjects[project.id] && (
                <CardContent>
                  <Tabs
                    value={activeTab[project.id] || 'overview'}
                    onValueChange={(value) => setProjectTab(project.id, value)}
                  >
                    <TabsList className="mb-4">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="milestones">Milestones</TabsTrigger>
                      <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
                      <TabsTrigger value="updates">Updates</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                      <ProjectProgressOverview
                        milestones={project.milestones || []}
                        projectStatus={project.status as ProjectStatus}
                        startDate={project.project_start_time}
                        endDate={project.deadline}
                        budget={project.budget}
                        spent={project.spent}
                        created_at={project.created_at}
                      />
                      <div className="mt-4">
                        <ProgressIndicator steps={getProjectSteps(project)} />
                      </div>
                    </TabsContent>

                    <TabsContent value="milestones">
                      <ProjectMilestones 
                        milestones={project.milestones || []}
                        isClient={true}
                        projectId={project.id}
                        projectStatus={(project.status || 'open') as ProjectStatus}
                      />
                    </TabsContent>

                    <TabsContent value="deliverables">
                      <ProjectDeliverables 
                        projectId={project.id}
                        canUpload={false}
                      />
                    </TabsContent>

                    <TabsContent value="updates">
                      <ProjectUpdateTimeline projectId={project.id} />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
      
      {/* Edit Project Form */}
      {editProject && (
        <EditProjectForm
          editProject={editProject}
          editedProject={editedProject}
          isSubmitting={isSubmitting}
          onCancel={handleEditCancel}
          onUpdate={handleUpdateProject}
          onChange={setEditedProject}
        />
      )}
      
      {/* Delete Project Confirmation Dialog */}
      <AlertDialog open={!!projectToDelete} onOpenChange={() => handleDeleteCancel()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={handleDeleteCancel}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => projectToDelete && handleDeleteProject(projectToDelete)}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProjectsTab;
