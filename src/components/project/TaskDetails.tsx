import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { taskService } from '@/services/taskService';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  deadline?: string;
  dependencies: string[];
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

interface TaskDetailsProps {
  task: Task;
  milestoneId: string;
  allTasks: Task[];
  onUpdate: () => void;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({
  task,
  milestoneId,
  allTasks,
  onUpdate
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleDeadlineChange = async (date: Date | undefined) => {
    if (!date) return;
    
    setIsUpdating(true);
    try {
      await taskService.updateTaskDeadline(
        milestoneId,
        task.id,
        date.toISOString()
      );
      onUpdate();
      toast({
        title: 'Deadline Updated',
        description: `Task deadline has been updated to ${format(date, 'PPP')}.`
      });
    } catch (error) {
      console.error('Error updating deadline:', error);
      toast({
        title: 'Error',
        description: 'Failed to update task deadline.',
        variant: 'destructive'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddDependency = async (dependencyId: string) => {
    setIsUpdating(true);
    try {
      await taskService.addTaskDependency(
        milestoneId,
        task.id,
        dependencyId
      );
      onUpdate();
      toast({
        title: 'Dependency Added',
        description: 'Task dependency has been added successfully.'
      });
    } catch (error) {
      console.error('Error adding dependency:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add task dependency.',
        variant: 'destructive'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveDependency = async (dependencyId: string) => {
    setIsUpdating(true);
    try {
      await taskService.removeTaskDependency(
        milestoneId,
        task.id,
        dependencyId
      );
      onUpdate();
      toast({
        title: 'Dependency Removed',
        description: 'Task dependency has been removed successfully.'
      });
    } catch (error) {
      console.error('Error removing dependency:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove task dependency.',
        variant: 'destructive'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const isOverdue = task.deadline && !task.completed && new Date(task.deadline) < new Date();
  const availableDependencies = allTasks.filter(t => 
    t.id !== task.id && !task.dependencies.includes(t.id)
  );

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{task.title}</h3>
        <span className={cn(
          "px-2 py-1 rounded text-sm",
          task.priority === 'high' && "bg-red-100 text-red-800",
          task.priority === 'medium' && "bg-yellow-100 text-yellow-800",
          task.priority === 'low' && "bg-green-100 text-green-800"
        )}>
          {task.priority}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !task.deadline && "text-muted-foreground"
                )}
                disabled={isUpdating}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {task.deadline ? format(new Date(task.deadline), 'PPP') : 'Set deadline'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={task.deadline ? new Date(task.deadline) : undefined}
                onSelect={handleDeadlineChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {isOverdue && (
            <div className="flex items-center text-red-500">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span className="text-sm">Overdue</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Dependencies</h4>
          {task.dependencies.length > 0 ? (
            <div className="space-y-1">
              {task.dependencies.map(depId => {
                const depTask = allTasks.find(t => t.id === depId);
                return depTask ? (
                  <div key={depId} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm">{depTask.title}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveDependency(depId)}
                      disabled={isUpdating}
                    >
                      Remove
                    </Button>
                  </div>
                ) : null;
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No dependencies</p>
          )}

          {availableDependencies.length > 0 && (
            <div className="mt-2">
              <select
                className="w-full p-2 border rounded"
                onChange={(e) => {
                  const value = e.target.value;
                  if (value) handleAddDependency(value);
                }}
                disabled={isUpdating}
              >
                <option value="">Add dependency...</option>
                {availableDependencies.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetails; 