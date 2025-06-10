
import { Project } from '@/components/dashboard/types';
import { Milestone } from '@/components/project/creation/types';
import { ProjectStatus } from '@/types/projectUpdates';

export interface UnifiedProjectCardProps {
  project: Project;
  variant?: 'list' | 'card';
  onStatusChange?: (newStatus: ProjectStatus) => void;
  isProfessional?: boolean;
  onClick?: () => void;
  actionLabel?: string;
  isClient?: boolean;
  onMilestoneUpdate?: (milestoneId: string, updates: Partial<Milestone>) => Promise<void>;
  onMilestoneDelete?: (milestoneId: string) => Promise<void>;
  onTaskStatusUpdate?: (milestoneId: string, taskId: string, completed: boolean) => Promise<void>;
}
