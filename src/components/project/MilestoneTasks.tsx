
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Calendar, Clock, User, AlertTriangle, CheckCircle, Circle } from 'lucide-react';
import { Task } from '@/components/project/creation/types';

interface MilestoneTasksProps {
  milestoneId: string;
  projectId: string;
  milestoneTitle: string;
  projectTitle: string;
  clientId: string;
  professionalId: string;
  tasks: Task[];
  onUpdateTaskStatus: (taskId: string, completed: boolean) => Promise<void>;
  canEdit?: boolean;
}

export default function MilestoneTasks({
  milestoneId,
  projectId,
  milestoneTitle,
  projectTitle,
  clientId,
  professionalId,
  tasks = [],
  onUpdateTaskStatus,
  canEdit = true
}: MilestoneTasksProps) {
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    due_date: ''
  });

  const handleAddTask = () => {
    // Implementation would go here
    setShowAddTask(false);
    setNewTask({ title: '', description: '', priority: 'medium', due_date: '' });
  };

  const handleTaskToggle = async (taskId: string, completed: boolean) => {
    if (canEdit) {
      await onUpdateTaskStatus(taskId, completed);
    }
  };

  const getStatusIcon = (status: string, completed: boolean) => {
    if (completed) return <CheckCircle className="h-4 w-4 text-green-600" />;
    switch (status) {
      case 'in_progress': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'blocked': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            Tasks for {milestoneTitle}
          </CardTitle>
          {canEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddTask(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No tasks added yet.
            </div>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={(checked) => handleTaskToggle(task.id, !!checked)}
                  disabled={!canEdit}
                  className="mt-1"
                />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(task.status || 'todo', task.completed)}
                    <h4 className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                      {task.title}
                    </h4>
                    {task.priority && (
                      <Badge variant="outline" className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    )}
                  </div>
                  {task.description && (
                    <p className="text-sm text-gray-600">{task.description}</p>
                  )}
                  {task.due_date && (
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      Due: {new Date(task.due_date).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          {showAddTask && (
            <Card className="border-dashed">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <Input
                    placeholder="Task title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  />
                  <Textarea
                    placeholder="Task description (optional)"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  />
                  <div className="flex space-x-2">
                    <Select
                      value={newTask.priority}
                      onValueChange={(value: 'low' | 'medium' | 'high') => 
                        setNewTask({ ...newTask, priority: value })
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      type="date"
                      value={newTask.due_date}
                      onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                      className="w-40"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleAddTask} size="sm">
                      Add Task
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowAddTask(false)}
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
