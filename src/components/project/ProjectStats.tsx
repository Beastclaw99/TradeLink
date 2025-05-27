import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, CheckCircle, AlertTriangle, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectStatsProps {
  totalMilestones: number;
  completedMilestones: number;
  totalTasks: number;
  completedTasks: number;
  budget: number;
  spent: number;
  status: string;
}

const ProjectStats: React.FC<ProjectStatsProps> = ({
  totalMilestones,
  completedMilestones,
  totalTasks,
  completedTasks,
  budget,
  spent,
  status
}) => {
  const milestoneProgress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;
  const taskProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const budgetProgress = budget > 0 ? (spent / budget) * 100 : 0;

  const getProgressColor = (progress: number, type: 'milestone' | 'task' | 'budget') => {
    if (type === 'budget' && progress > 100) return 'bg-red-500';
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Project Statistics</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Milestones Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-ttc-blue-700" />
                <h4 className="font-medium">Milestones</h4>
              </div>
              <span className="text-sm text-gray-600">
                {completedMilestones}/{totalMilestones}
              </span>
            </div>
            <Progress
              value={milestoneProgress}
              className={cn("h-2", "[&>div]:bg-primary")}
            />
            <p className="text-sm text-gray-600">
              {milestoneProgress.toFixed(1)}% complete
            </p>
          </div>

          {/* Tasks Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-ttc-blue-700" />
                <h4 className="font-medium">Tasks</h4>
              </div>
              <span className="text-sm text-gray-600">
                {completedTasks}/{totalTasks}
              </span>
            </div>
            <Progress
              value={taskProgress}
              className={cn("h-2", "[&>div]:bg-primary")}
            />
            <p className="text-sm text-gray-600">
              {taskProgress.toFixed(1)}% complete
            </p>
          </div>

          {/* Budget Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-ttc-blue-700" />
                <h4 className="font-medium">Budget</h4>
              </div>
              <span className="text-sm text-gray-600">
                ${spent.toLocaleString()}/${budget.toLocaleString()}
              </span>
            </div>
            <Progress
              value={budgetProgress}
              className={cn("h-2", "[&>div]:bg-primary")}
            />
            <p className="text-sm text-gray-600">
              {budgetProgress.toFixed(1)}% spent
              {budgetProgress > 100 && (
                <span className="ml-2 text-red-600 flex items-center">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Over budget
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Overall Project Status */}
        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Overall Progress</h4>
            <span className="text-sm text-gray-600">
              {((milestoneProgress + taskProgress) / 2).toFixed(1)}%
            </span>
          </div>
          <Progress
            value={(milestoneProgress + taskProgress) / 2}
            className={cn("h-2 mt-2", "[&>div]:bg-primary")}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectStats; 