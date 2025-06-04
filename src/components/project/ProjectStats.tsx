import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, CheckCircle, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectStatsProps {
  milestones: {
    total: number;
    completed: number;
  };
  tasks: {
    total: number;
    completed: number;
  };
  budget: string;
  spent: number;
}

const ProjectStats: React.FC<ProjectStatsProps> = ({
  milestones,
  tasks,
  budget,
  spent
}) => {
  const milestoneProgress = milestones.total > 0 ? (milestones.completed / milestones.total) * 100 : 0;
  const taskProgress = tasks.total > 0 ? (tasks.completed / tasks.total) * 100 : 0;
  const budgetProgress = budget ? (spent / parseFloat(budget)) * 100 : 0;

  const getProgressColor = (progress: number, type: 'milestone' | 'task' | 'budget') => {
    if (type === 'budget' && progress > 100) return 'bg-red-500';
    if (progress >= 90) return 'bg-green-500';
    if (progress >= 70) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Milestone Progress */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-gray-500" />
              <h4 className="font-medium">Progress</h4>
            </div>
            <span className="text-sm text-gray-500">
              {milestones.completed}/{milestones.total}
            </span>
          </div>
          <Progress 
            value={milestoneProgress} 
            className={`h-2 ${getProgressColor(milestoneProgress, 'milestone')}`}
          />
          <p className="text-sm text-gray-500 mt-2">
            {milestoneProgress.toFixed(1)}% complete
          </p>
        </CardContent>
      </Card>

      {/* Task Progress */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <h4 className="font-medium">Progress</h4>
            </div>
            <span className="text-sm text-gray-500">
              {tasks.completed}/{tasks.total}
            </span>
          </div>
          <Progress 
            value={taskProgress} 
            className={`h-2 ${getProgressColor(taskProgress, 'task')}`}
          />
          <p className="text-sm text-gray-500 mt-2">
            {taskProgress.toFixed(1)}% complete
          </p>
        </CardContent>
      </Card>

      {/* Budget Progress */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <h4 className="font-medium">Spent</h4>
            </div>
            <span className="text-sm text-gray-500">
              ${spent.toLocaleString()}/{budget}
            </span>
          </div>
          <Progress 
            value={budgetProgress} 
            className={`h-2 ${getProgressColor(budgetProgress, 'budget')}`}
          />
          <p className="text-sm text-gray-500 mt-2">
            {budgetProgress.toFixed(1)}% spent
            {budgetProgress > 100 && (
              <span className="text-red-500 ml-2">
                Over budget
              </span>
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectStats; 