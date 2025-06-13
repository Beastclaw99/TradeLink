import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExtendedProjectTask, TaskStatus } from '@/types/database';
import { format } from 'date-fns';

interface ProjectTasksProps {
  tasks: ExtendedProjectTask[];
  onDeleteTask: (taskId: string) => Promise<void>;
  onCreateTask: (task: Omit<ExtendedProjectTask, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onUpdateTask: (taskId: string, updates: Partial<ExtendedProjectTask>) => Promise<void>;
}

const ProjectTasks: React.FC<ProjectTasksProps> = ({
  tasks,
  onDeleteTask,
  onCreateTask,
  onUpdateTask
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newTask, setNewTask] = useState<Partial<ExtendedProjectTask>>({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium'
  });
  const [selectedPriority, setSelectedPriority] = useState<ExtendedProjectTask['priority'] | 'all'>('all');

  const handleCreateTask = async () => {
    if (!newTask.title) return;

    try {
      await onCreateTask({
        title: newTask.title,
        description: newTask.description || null,
        status: newTask.status || 'todo',
        priority: newTask.priority || 'medium',
        assignee_id: newTask.assignee_id || null,
        due_date: newTask.due_date || null
      });
      setNewTask({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium'
      });
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<ExtendedProjectTask>) => {
    try {
      await onUpdateTask(taskId, updates);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await onDeleteTask(taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const getStatusBadge = (status: TaskStatus) => {
    const statusConfig: Record<TaskStatus, { color: string; label: string }> = {
      todo: { color: 'bg-yellow-100 text-yellow-800', label: 'To Do' },
      in_progress: { color: 'bg-blue-100 text-blue-800', label: 'In Progress' },
      completed: { color: 'bg-green-100 text-green-800', label: 'Completed' }
    };

    const config = statusConfig[status];
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: ExtendedProjectTask['priority']) => {
    const priorityConfig: Record<ExtendedProjectTask['priority'], { color: string }> = {
      low: { color: 'bg-gray-100 text-gray-800' },
      medium: { color: 'bg-blue-100 text-blue-800' },
      high: { color: 'bg-red-100 text-red-800' }
    };

    const config = priorityConfig[priority];
    return (
      <Badge className={config.color}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  const filteredTasks = selectedPriority === 'all'
    ? tasks
    : tasks.filter(task => task.priority === selectedPriority);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Tasks</CardTitle>
          <div className="flex items-center gap-4">
            <Select
              value={selectedPriority}
              onValueChange={(value) => setSelectedPriority(value as ExtendedProjectTask['priority'] | 'all')}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => setIsCreating(true)}>Add Task</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isCreating && (
          <div className="mb-6 space-y-4 p-4 border rounded-lg">
            <Input
              placeholder="Task title"
              value={newTask.title}
              onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
            />
            <Textarea
              placeholder="Task description"
              value={newTask.description || ''}
              onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
            />
            <div className="flex gap-4">
              <Select
                value={newTask.status}
                onValueChange={(value) => setNewTask(prev => ({ ...prev, status: value as TaskStatus }))}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={newTask.priority}
                onValueChange={(value) => setNewTask(prev => ({ ...prev, priority: value as ExtendedProjectTask['priority'] }))}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
              <Button onClick={handleCreateTask}>Create Task</Button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <div key={task.id} className="p-4 border rounded-lg">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h3 className="font-medium">{task.title}</h3>
                  {task.description && (
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                  )}
                  <div className="flex gap-2">
                    {getStatusBadge(task.status)}
                    {getPriorityBadge(task.priority)}
                    {task.due_date && (
                      <Badge variant="outline">
                        Due: {format(new Date(task.due_date), 'MMM d, yyyy')}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateTask(task.id, { status: 'completed' })}
                  >
                    Complete
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectTasks; 