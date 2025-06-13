import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectStatus, ProjectMilestone } from '@/types/database';
import { Milestone, convertDBMilestoneToMilestone } from '@/components/project/creation/types';
import { ProjectTimeline } from './ProjectTimeline';
import { ProjectDeliverables } from './ProjectDeliverables';
import { ProjectUpdates } from './ProjectUpdates';
import { ProjectFiles } from './ProjectFiles';
import { formatDateToLocale } from '@/utils/dateUtils';

interface ProjectCardTabsProps {
  project: {
    id: string;
    status: ProjectStatus | null;
    start_date: string | null;
    deadline: string | null;
  };
  milestones: ProjectMilestone[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isProfessional?: boolean;
  isClient?: boolean;
  onMilestoneUpdate?: (milestoneId: string, updates: Partial<ProjectMilestone>) => Promise<void>;
  onMilestoneDelete?: (milestoneId: string) => Promise<void>;
  onTaskStatusUpdate?: (milestoneId: string, taskId: string, completed: boolean) => Promise<void>;
}

const VALID_PROJECT_STATUSES: ProjectStatus[] = [
  'draft',
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

export const ProjectCardTabs: React.FC<ProjectCardTabsProps> = ({
  project,
  milestones = [],
  activeTab,
  setActiveTab,
  isProfessional = false,
  isClient = false,
  onMilestoneUpdate,
  onMilestoneDelete,
  onTaskStatusUpdate
}) => {
  const getValidProjectStatus = (status: ProjectStatus | null): ProjectStatus => {
    if (!status || !VALID_PROJECT_STATUSES.includes(status)) {
      return 'open';
    }
    return status;
  };

  const defaultMilestoneHandler = async (): Promise<void> => {
    console.warn('No milestone handler provided');
  };

  const defaultMilestoneUpdateHandler = async (_milestoneId: string, _updates: Partial<ProjectMilestone>): Promise<void> => {
    console.warn('No milestone update handler provided');
  };

  const defaultMilestoneDeleteHandler = async (_milestoneId: string): Promise<void> => {
    console.warn('No milestone delete handler provided');
  };

  const defaultTaskStatusHandler = async (_milestoneId: string, _taskId: string, _completed: boolean): Promise<void> => {
    console.warn('No task status handler provided');
  };

  // Convert ProjectMilestone[] to Milestone[] with error handling
  const convertedMilestones: Milestone[] = milestones.map(milestone => {
    try {
      return convertDBMilestoneToMilestone(milestone);
    } catch (error) {
      console.error('Error converting milestone:', error);
      return {
        id: milestone.id || 'unknown',
        title: milestone.title || 'Untitled Milestone',
        description: milestone.description || 'No description provided',
        due_date: milestone.due_date || null,
        status: milestone.status || 'not_started',
        created_by: milestone.created_by || null,
        requires_deliverable: milestone.requires_deliverable || false
      };
    }
  });

  const formatDate = (date: string | null): string => {
    return formatDateToLocale(date);
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="timeline">Timeline</TabsTrigger>
        <TabsTrigger value="milestones">Milestones</TabsTrigger>
        <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
        <TabsTrigger value="updates">Updates</TabsTrigger>
        <TabsTrigger value="files">Files</TabsTrigger>
      </TabsList>

      <TabsContent value="timeline">
        <ProjectTimeline
          startDate={project.start_date}
          deadline={project.deadline}
          projectStatus={getValidProjectStatus(project.status)}
        />
      </TabsContent>

      <TabsContent value="milestones">
        <Card>
          <CardHeader>
            <CardTitle>Project Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            {convertedMilestones.length > 0 ? (
              <div className="space-y-4">
                {convertedMilestones.map((milestone) => (
                  <div key={milestone.id} className="p-4 border rounded-lg">
                    <h3 className="font-semibold">{milestone.title}</h3>
                    <p className="text-sm text-gray-600">{milestone.description}</p>
                    <div className="mt-2">
                      <span className="text-sm text-gray-500">
                        Due: {formatDate(milestone.due_date)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No milestones defined yet.</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="deliverables">
        <ProjectDeliverables
          projectId={project.id}
          milestones={convertedMilestones}
          onMilestoneUpdate={onMilestoneUpdate || defaultMilestoneUpdateHandler}
          onMilestoneDelete={onMilestoneDelete || defaultMilestoneDeleteHandler}
          onTaskStatusUpdate={onTaskStatusUpdate || defaultTaskStatusHandler}
        />
      </TabsContent>

      <TabsContent value="updates">
        <ProjectUpdates projectId={project.id} />
      </TabsContent>

      <TabsContent value="files">
        <ProjectFiles projectId={project.id} />
      </TabsContent>
    </Tabs>
  );
};
