import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Target,
  Calendar,
  FileText,
  DollarSign
} from 'lucide-react';
import { Milestone } from './creation/types';
import { ProjectStatus } from '@/types/projectUpdates';

interface ProjectProgressOverviewProps {
  milestones: Milestone[];
  projectStatus: ProjectStatus;
  startDate?: string | null;
  endDate?: string | null;
  budget?: number | null;
  spent?: number | null;
  created_at?: string | null;
}

const ProjectProgressOverview: React.FC<ProjectProgressOverviewProps> = ({
  milestones,
  projectStatus,
  startDate,
  endDate,
  budget,
  spent,
  created_at
}) => {
  // Calculate overall progress
  const totalMilestones = milestones.length;
  const completedMilestones = milestones.filter(m => m.status === 'completed').length;
  const overallProgress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

  // Calculate task progress
  const totalTasks = milestones.reduce((acc, m) => acc + (m.tasks?.length || 0), 0);
  const completedTasks = milestones.reduce((acc, m) => 
    acc + (m.tasks?.filter(t => t.completed).length || 0), 0);
  const taskProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Calculate deliverables progress
  const totalDeliverables = milestones.reduce((acc, m) => acc + (m.deliverables?.length || 0), 0);
  const approvedDeliverables = milestones.reduce((acc, m) => 
    acc + (m.deliverables?.filter(d => d.status === 'approved').length || 0), 0);
  const deliverableProgress = totalDeliverables > 0 ? (approvedDeliverables / totalDeliverables) * 100 : 0;

  // Calculate budget progress
  const budgetProgress = budget && spent ? (spent / budget) * 100 : 0;

  const getProgressColor = (progress: number, type: 'overall' | 'task' | 'deliverable' | 'budget') => {
    if (type === 'budget' && progress > 100) return 'bg-red-500';
    if (progress >= 90) return 'bg-green-500';
    if (progress >= 70) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'work_submitted':
        return <Badge className="bg-purple-100 text-purple-800">Work Submitted</Badge>;
      case 'work_revision_requested':
        return <Badge className="bg-orange-100 text-orange-800">Revision Requested</Badge>;
      case 'work_approved':
        return <Badge className="bg-green-100 text-green-800">Work Approved</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      case 'disputed':
        return <Badge className="bg-red-100 text-red-800">Disputed</Badge>;
      case 'archived':
        return <Badge className="bg-gray-100 text-gray-800">Archived</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Project Progress Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-gray-600" />
              <span className="font-medium">Overall Progress</span>
            </div>
            <span className="text-sm text-gray-600">{overallProgress.toFixed(1)}%</span>
          </div>
          <Progress 
            value={overallProgress} 
            className={`h-2 ${getProgressColor(overallProgress, 'overall')}`}
          />
        </div>

        {/* Task Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-gray-600" />
              <span className="font-medium">Tasks</span>
            </div>
            <span className="text-sm text-gray-600">
              {completedTasks}/{totalTasks} completed
            </span>
          </div>
          <Progress 
            value={taskProgress} 
            className={`h-2 ${getProgressColor(taskProgress, 'task')}`}
          />
        </div>

        {/* Deliverables Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-600" />
              <span className="font-medium">Deliverables</span>
            </div>
            <span className="text-sm text-gray-600">
              {approvedDeliverables}/{totalDeliverables} approved
            </span>
          </div>
          <Progress 
            value={deliverableProgress} 
            className={`h-2 ${getProgressColor(deliverableProgress, 'deliverable')}`}
          />
        </div>

        {/* Budget Progress */}
        {budget && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-gray-600" />
                <span className="font-medium">Budget</span>
              </div>
              <span className="text-sm text-gray-600">
                ${spent?.toFixed(2) || '0.00'} / ${budget.toFixed(2)}
              </span>
            </div>
            <Progress 
              value={budgetProgress} 
              className={`h-2 ${getProgressColor(budgetProgress, 'budget')}`}
            />
          </div>
        )}

        {/* Timeline */}
        {(startDate || endDate || created_at) && (
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-600" />
            <span className="text-sm text-gray-600">
              {startDate ? `Start: ${new Date(startDate).toLocaleDateString()}` :
               created_at ? `Start: ${new Date(created_at).toLocaleDateString()}` : ''}
              {(startDate || created_at) && endDate && ' - '}
              {endDate && `End: ${new Date(endDate).toLocaleDateString()}`}
            </span>
          </div>
        )}

        {/* Project Status */}
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-gray-600" />
          {getStatusBadge(projectStatus)}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectProgressOverview; 