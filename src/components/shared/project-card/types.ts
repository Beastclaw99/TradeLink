import { Project, ProjectStatus, ProjectMilestone } from '@/types/database';
import { Milestone } from '@/components/project/creation/types';

export interface UnifiedProjectCardProps {
  project: Project;
  variant?: 'list' | 'card';
  onStatusChange?: (newStatus: ProjectStatus) => void;
  isProfessional?: boolean;
  onClick?: () => void;
  actionLabel?: string;
  isClient?: boolean;
  onMilestoneUpdate?: (milestoneId: string, updates: Partial<ProjectMilestone>) => Promise<void>;
  onMilestoneDelete?: (milestoneId: string) => Promise<void>;
  onTaskStatusUpdate?: (milestoneId: string, taskId: string, completed: boolean) => Promise<void>;
}
