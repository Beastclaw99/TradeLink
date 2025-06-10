
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle, 
  Clock, 
  DollarSign, 
  MapPin,
  ChevronDown,
  ChevronUp,
  Target,
  FileText
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import ProjectUpdateTimeline from "@/components/project/ProjectUpdateTimeline";
import ProjectMilestones from "@/components/project/ProjectMilestones";
import ProjectDeliverables from "@/components/project/ProjectDeliverables";
import { Project } from '../types';
import { ProjectStatus } from '@/types/projectUpdates';

interface DatabaseMilestone {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  status: string | null;
  is_complete: boolean | null;
  project_id: string | null;
  created_at: string | null;
  updated_at: string | null;
  created_by: string | null;
  requires_deliverable: boolean | null;
  tasks: {
    id: string;
    title: string;
    description: string | null;
    status: string | null;
    completed: boolean;
  }[];
}

interface ProjectWithMilestones extends Omit<Project, 'milestones'> {
  milestones?: DatabaseMilestone[];
  required_skills: string | null;
}

interface ActiveProjectsTabProps {
  projects: Project[];
  isLoading: boolean;
  markProjectComplete: (projectId: string) => void;
}

const ActiveProjectsTab: React.FC<ActiveProjectsTabProps> = ({
  projects: allProjects,
  isLoading,
  markProjectComplete
}) => {
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Record<string, string>>({});
  const [selectedProject, setSelectedProject] = useState<ProjectWithMilestones | null>(null);
  const { toast } = useToast();

  // Filter for active projects only
  const activeProjects = allProjects.filter(project => 
    ['assigned', 'in_progress'].includes(project.status || '')
  );

  const getValidProjectStatus = (status: string | null): ProjectStatus => {
    if (!status) return 'open';
    const validStatuses: ProjectStatus[] = [
      'open', 'assigned', 'in_progress', 'work_submitted', 
      'work_revision_requested', 'work_approved', 'completed', 
      'archived', 'cancelled', 'disputed'
    ];
    return validStatuses.includes(status as ProjectStatus) ? status as ProjectStatus : 'open';
  };

  const fetchProjectDetails = async (projectId: string) => {
    try {
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select(`
          *,
          milestones:project_milestones(*)
        `)
        .eq('id', projectId)
        .single();

      if (projectError) throw projectError;

      if (project) {
        // Transform the data to match our interface
        const transformedProject: ProjectWithMilestones = {
          ...project,
          required_skills: project.recommended_skills || null,
          milestones: project.milestones?.map((m: any) => ({
            id: m.id,
            title: m.title,
            description: m.description,
            due_date: m.due_date,
            status: m.status,
            is_complete: m.is_complete,
            project_id: m.project_id,
            created_at: m.created_at,
            updated_at: m.updated_at,
            created_by: m.created_by,
            requires_deliverable: m.requires_deliverable,
            tasks: [] // Initialize empty tasks array since we removed the relationship
          })) || []
        };
        setSelectedProject(transformedProject);
      }
    } catch (error) {
      console.error('Error fetching project details:', error);
      toast({
        title: "Error",
        description: "Failed to load project details",
        variant: "destructive"
      });
    }
  };

  const handleMilestoneUpdate = async (milestoneId: string, updates: any) => {
    if (!selectedProject) return;

    try {
      const { error } = await supabase
        .from('project_milestones')
        .update({
          title: updates.title,
          description: updates.description,
          due_date: updates.dueDate,
          status: updates.status
        })
        .eq('id', milestoneId);

      if (error) throw error;

      setSelectedProject(prev => {
        if (!prev) return null;
        return {
          ...prev,
          milestones: prev.milestones?.map(m => 
            m.id === milestoneId ? { ...m, ...updates } : m
          ) || []
        };
      });

      toast({
        title: "Success",
        description: "Milestone updated successfully"
      });
    } catch (error) {
      console.error('Error updating milestone:', error);
      toast({
        title: "Error",
        description: "Failed to update milestone",
        variant: "destructive"
      });
    }
  };

  const handleMilestoneDelete = async (milestoneId: string) => {
    if (!selectedProject) return;

    try {
      const { error } = await supabase
        .from('project_milestones')
        .delete()
        .eq('id', milestoneId);

      if (error) throw error;

      setSelectedProject(prev => {
        if (!prev) return null;
        return {
          ...prev,
          milestones: prev.milestones?.filter(m => m.id !== milestoneId) || []
        };
      });

      toast({
        title: "Success",
        description: "Milestone deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting milestone:', error);
      toast({
        title: "Error",
        description: "Failed to delete milestone",
        variant: "destructive"
      });
    }
  };

  const handleTaskStatusUpdate = async (_milestoneId: string, taskId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('project_tasks')
        .update({ completed })
        .eq('id', taskId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Task ${completed ? 'completed' : 'reopened'} successfully`
      });
    } catch (error) {
      console.error('Error updating task status:', error);
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive"
      });
    }
  };

  const toggleProjectExpansion = async (projectId: string) => {
    if (expandedProject === projectId) {
      setExpandedProject(null);
      setSelectedProject(null);
    } else {
      setExpandedProject(projectId);
      setActiveTab(prev => ({ ...prev, [projectId]: 'timeline' }));
      await fetchProjectDetails(projectId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading active projects...</span>
      </div>
    );
  }

  if (activeProjects.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Target className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Projects</h3>
          <p className="text-gray-500">You don't have any active projects at the moment.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {activeProjects.map((project) => {
        const isExpanded = expandedProject === project.id;
        
        return (
          <Card key={project.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-1">{project.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mb-2">
                    {project.description || 'No description provided'}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span>${project.budget || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{project.location || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{project.expected_timeline || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant={project.status === 'in_progress' ? 'default' : 'secondary'}>
                    {project.status}
                  </Badge>
                  
                  {project.status === 'in_progress' && (
                    <Button
                      size="sm"
                      onClick={() => markProjectComplete(project.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Complete
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleProjectExpansion(project.id)}
                  >
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>

            {isExpanded && selectedProject && selectedProject.id === project.id && (
              <CardContent>
                <Tabs
                  value={activeTab[project.id] || 'timeline'}
                  onValueChange={(tab) => setActiveTab(prev => ({ ...prev, [project.id]: tab }))}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-3 mb-4">
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
                  </TabsList>

                  <TabsContent value="timeline">
                    <ProjectUpdateTimeline 
                      projectId={selectedProject.id} 
                      projectStatus={getValidProjectStatus(selectedProject.status)}
                      isProfessional={true}
                    />
                  </TabsContent>

                  <TabsContent value="milestones">
                    <ProjectMilestones 
                      projectId={selectedProject.id}
                      projectStatus={getValidProjectStatus(selectedProject.status)}
                      milestones={(selectedProject.milestones || []).map(m => ({
                        id: m.id,
                        title: m.title,
                        description: m.description || '',
                        dueDate: m.due_date || '',
                        status: (m.status as any) || 'not_started',
                        deliverables: [],
                        tasks: m.tasks || []
                      }))}
                      isClient={false}
                      onAddMilestone={async () => {}}
                      onEditMilestone={handleMilestoneUpdate}
                      onDeleteMilestone={handleMilestoneDelete}
                      onUpdateTaskStatus={handleTaskStatusUpdate}
                    />
                  </TabsContent>

                  <TabsContent value="deliverables">
                    <ProjectDeliverables 
                      projectId={selectedProject.id}
                      canUpload={true}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
};

export default ActiveProjectsTab;
