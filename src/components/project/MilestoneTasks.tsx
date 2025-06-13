import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { ProjectTask, TaskStatus } from '@/types/database';

interface MilestoneTasksProps {
  milestoneId: string;
  tasks: ProjectTask[];
  isClient?: boolean;
  onAddTask?: (task: Omit<ProjectTask, 'id'>) => Promise<void>;
  onDeleteTask?: (taskId: string) => Promise<void>;
  onUpdateTaskStatus?: (taskId: string, status: TaskStatus) => Promise<void>;
}

const MilestoneTasks: React.FC<MilestoneTasksProps> = ({
  milestoneId,
  tasks = [],
  isClient = false,
  onAddTask,
  onDeleteTask,
  onUpdateTaskStatus
}) => {
  const { toast } = useToast();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);

  const handleAddTask = async () => {
    if (!newTaskTitle.trim() || !onAddTask) return;

    try {
      await onAddTask({
        project_id: milestoneId,
        title: newTaskTitle.trim(),
        status: 'todo' as TaskStatus,
        description: null,
        assignee_id: null,
        due_date: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        assignee: null
      });

      setNewTaskTitle('');
      setIsAddingTask(false);
      
      toast({
        title: "Task added",
        description: "The task has been added successfully.",
      });
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        title: "Error",
        description: "Failed to add task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!onDeleteTask) return;

    try {
      await onDeleteTask(taskId);
      
      toast({
        title: "Task deleted",
        description: "The task has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTaskStatusChange = async (taskId: string, checked: boolean) => {
    if (!onUpdateTaskStatus) return;

    try {
      const newStatus: TaskStatus = checked ? 'completed' : 'todo';
      await onUpdateTaskStatus(taskId, newStatus);
      
      toast({
        title: "Task updated",
        description: `Task marked as ${checked ? 'completed' : 'incomplete'}.`,
      });
    } catch (error) {
      console.error('Error updating task status:', error);
      toast({
        title: "Error",
        description: "Failed to update task status. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Tasks</h3>
            {!isClient && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddingTask(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Task
              </Button>
            )}
          </div>

          {isAddingTask && (
            <div className="flex items-center gap-2">
              <Input
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Enter task title"
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddTask}
                disabled={!newTaskTitle.trim()}
              >
                Add
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsAddingTask(false);
                  setNewTaskTitle('');
                }}
              >
                Cancel
              </Button>
            </div>
          )}

          <div className="space-y-2">
            {tasks.length === 0 ? (
              <p className="text-sm text-gray-500">No tasks added yet.</p>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={task.status === 'completed'}
                      onCheckedChange={(checked) => 
                        handleTaskStatusChange(task.id, checked as boolean)
                      }
                      disabled={isClient}
                    />
                    <span className={`text-sm ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                      {task.title}
                    </span>
                  </div>
                  {!isClient && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MilestoneTasks; 