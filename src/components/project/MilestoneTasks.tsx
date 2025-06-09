import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { taskService } from '@/services/taskService';
import TaskDetails from './TaskDetails';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  deadline?: string;
  dependencies: string[];
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

interface MilestoneTasksProps {
  milestoneId: string;
  projectId: string;
  projectTitle: string;
  milestoneTitle: string;
  clientId: string;
  professionalId: string;
}

const MilestoneTasks: React.FC<MilestoneTasksProps> = ({
  milestoneId,
  projectId,
  projectTitle,
  milestoneTitle,
  clientId,
  professionalId
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const { toast } = useToast();

  const fetchTasks = async () => {
    try {
      const fetchedTasks = await taskService.getMilestoneTasks(milestoneId);
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch tasks.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [milestoneId]);

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;

    setIsAddingTask(true);
    try {
      await taskService.addTask(
        milestoneId,
        newTaskTitle,
        projectId,
        projectTitle,
        milestoneTitle,
        clientId,
        professionalId
      );
      setNewTaskTitle('');
      fetchTasks();
      toast({
        title: 'Task Added',
        description: 'New task has been added successfully.'
      });
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        title: 'Error',
        description: 'Failed to add task.',
        variant: 'destructive'
      });
    } finally {
      setIsAddingTask(false);
    }
  };

  const handleTaskStatusChange = async (taskId: string, completed: boolean) => {
    try {
      await taskService.updateTaskStatus(
        milestoneId,
        taskId,
        completed,
        projectId,
        projectTitle,
        milestoneTitle,
        clientId,
        professionalId
      );
      fetchTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update task status.',
        variant: 'destructive'
      });
    }
  };

  const handleRemoveTask = async (taskId: string) => {
    try {
      await taskService.removeTask(
        milestoneId,
        taskId,
        projectId,
        projectTitle,
        milestoneTitle,
        clientId,
        professionalId
      );
      fetchTasks();
      toast({
        title: 'Task Removed',
        description: 'Task has been removed successfully.'
      });
    } catch (error) {
      console.error('Error removing task:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to remove task.',
        variant: 'destructive'
      });
    }
  };

  if (isLoading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Add a new task..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
          disabled={isAddingTask}
        />
        <Button
          onClick={handleAddTask}
          disabled={isAddingTask || !newTaskTitle.trim()}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={task.completed}
                onCheckedChange={(checked) => 
                  handleTaskStatusChange(task.id, checked as boolean)
                }
              />
              <span className={task.completed ? 'line-through text-gray-500' : ''}>
                {task.title}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveTask(task.id)}
                className="ml-auto"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <TaskDetails
              task={task}
              milestoneId={milestoneId}
              allTasks={tasks}
              onUpdate={fetchTasks}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MilestoneTasks; 