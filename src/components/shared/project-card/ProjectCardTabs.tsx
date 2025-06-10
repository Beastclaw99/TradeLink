import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClockIcon, TagIcon, DocumentIcon, EyeIcon } from '@heroicons/react/24/outline';
import { Project } from '@/components/dashboard/types';
import { Milestone } from '@/components/project/creation/types';
import ProjectUpdateTimeline from '../../project/ProjectUpdateTimeline';
import ProjectMilestones from '../../project/ProjectMilestones';
import ProjectDeliverables from '../../project/ProjectDeliverables';
import { ProjectStatus } from '@/types/projectUpdates';

interface ProjectCardTabsProps {
  project: Project;
  milestones: Milestone[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isProfessional: boolean;
  isClient: boolean;
  onMilestoneUpdate?: (milestoneId: string, updates: Partial<Milestone>) => Promise<void>;
  onMilestoneDelete?: (milestoneId: string) => Promise<void>;
  onTaskStatusUpdate?: (milestoneId: string, taskId: string, completed: boolean) => Promise<void>;
}

export const ProjectCardTabs: React.FC<ProjectCardTabsProps> = ({
  project,
  milestones,
  activeTab,
  setActiveTab,
  isProfessional,
  isClient,
  onMilestoneUpdate,
  onMilestoneDelete,
  onTaskStatusUpdate
}) => {
  const getValidProjectStatus = (status: string | null): ProjectStatus => {
    if (!status) return 'open';
    const validStatuses: ProjectStatus[] = [
      'open',
      'assigned',
      'in_progress',
      'work_submitted',
      'work_revision_requested',
      'work_approved',
      'completed',
      'archived',
      'cancelled',
      'disputed'
    ];
    return validStatuses.includes(status as ProjectStatus) ? status as ProjectStatus : 'open';
  };

  return (
    <div className="mt-6 border-t pt-6">
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <ClockIcon className="h-4 w-4" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="milestones" className="flex items-center gap-2">
            <TagIcon className="h-4 w-4" />
            Milestones
          </TabsTrigger>
          <TabsTrigger value="deliverables" className="flex items-center gap-2">
            <DocumentIcon className="h-4 w-4" />
            Deliverables
          </TabsTrigger>
          <TabsTrigger value="details" className="flex items-center gap-2">
            <EyeIcon className="h-4 w-4" />
            Details
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="mt-4">
          <ProjectUpdateTimeline 
            projectId={project.id} 
            projectStatus={getValidProjectStatus(project.status)}
            isProfessional={isProfessional}
          />
        </TabsContent>

        <TabsContent value="milestones" className="mt-4">
          <ProjectMilestones 
            projectId={project.id}
            projectStatus={getValidProjectStatus(project.status)}
            milestones={milestones}
            isClient={isClient}
            onAddMilestone={async () => {}}
            onEditMilestone={onMilestoneUpdate || async () => {}}
            onDeleteMilestone={onMilestoneDelete || async () => {}}
            onUpdateTaskStatus={onTaskStatusUpdate || async () => {}}
          />
        </TabsContent>

        <TabsContent value="deliverables" className="mt-4">
          <ProjectDeliverables 
            projectId={project.id}
            canUpload={isProfessional}
          />
        </TabsContent>

        <TabsContent value="details" className="mt-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Project Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Location:</span>
                  <p>{project.location || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-gray-600">Timeline:</span>
                  <p>{project.expected_timeline || 'Not specified'}</p>
                </div>
                {project.requirements && (
                  <div className="col-span-2">
                    <span className="text-gray-600">Requirements:</span>
                    <ul className="list-disc list-inside mt-1">
                      {project.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
