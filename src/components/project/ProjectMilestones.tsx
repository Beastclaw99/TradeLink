import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from "@/components/ui/use-toast";
import {
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
  Target,
  FileText
} from 'lucide-react';
import { format, isPast, isToday, isFuture } from 'date-fns';
import { Milestone } from './creation/types';
import MilestoneStatusUpdate from './MilestoneStatusUpdate';
import DeliverableSubmission from './DeliverableSubmission';
import { ProjectStatus } from '@/types/projectUpdates';

interface ProjectMilestonesProps {
  milestones: Milestone[];
  isClient: boolean;
  onAddMilestone: (milestone: Omit<Milestone, 'id'>) => Promise<void>;
  onEditMilestone: (milestoneId: string, milestone: Partial<Milestone>) => Promise<void>;
  onDeleteMilestone: (milestoneId: string) => Promise<void>;
  onUpdateTaskStatus: (milestoneId: string, taskId: string, completed: boolean) => Promise<void>;
  projectId: string;
  projectStatus: ProjectStatus;
}

const ProjectMilestones: React.FC<ProjectMilestonesProps> = ({
  milestones,
  isClient,
  onAddMilestone,
  onEditMilestone,
  onDeleteMilestone,
  onUpdateTaskStatus,
  projectId,
  projectStatus
}) => {
  const { toast } = useToast();
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<string | null>(null);
  const [expandedMilestones, setExpandedMilestones] = useState<Set<string>>(new Set());
  const [newMilestone, setNewMilestone] = useState<Omit<Milestone, 'id'>>({
    title: '',
    description: '',
    dueDate: '',
    status: 'not_started',
    progress: 0,
    tasks: [],
    deliverables: []
  });
  const [newTask, setNewTask] = useState('');

  const handleAddMilestone = async () => {
    if (!newMilestone.title.trim() || !newMilestone.dueDate) return;
    try {
      await onAddMilestone({
        ...newMilestone,
        tasks: newMilestone.tasks.map(task => ({
          ...task,
          id: crypto.randomUUID()
        }))
      });
      setNewMilestone({
        title: '',
        description: '',
        dueDate: '',
        status: 'not_started',
        progress: 0,
        tasks: [],
        deliverables: []
      });
      setIsAddingMilestone(false);
      toast({
        title: "Success",
        description: "Milestone added successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add milestone. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEditMilestone = async (milestoneId: string, updates: Partial<Milestone>) => {
    try {
      await onEditMilestone(milestoneId, updates);
      setEditingMilestone(null);
      toast({
        title: "Success",
        description: "Milestone updated successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update milestone. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteMilestone = async (milestoneId: string) => {
    try {
      await onDeleteMilestone(milestoneId);
      toast({
        title: "Success",
        description: "Milestone deleted successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete milestone. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateTaskStatus = async (milestoneId: string, taskId: string, completed: boolean) => {
    try {
      await onUpdateTaskStatus(milestoneId, taskId, completed);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAddTask = () => {
    if (!newTask.trim()) return;

    setNewMilestone(prev => ({
      ...prev,
      tasks: [...prev.tasks, { id: crypto.randomUUID(), title: newTask.trim(), completed: false }]
    }));
    setNewTask('');
  };

  const getStatusBadge = (status: Milestone['status']) => {
    const statusConfig: Record<Milestone['status'], { color: string; icon: React.ReactNode }> = {
      not_started: {
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: <Clock className="h-4 w-4" />
      },
      in_progress: {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: <AlertTriangle className="h-4 w-4" />
      },
      completed: {
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: <CheckCircle2 className="h-4 w-4" />
      },
      overdue: {
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: <AlertTriangle className="h-4 w-4" />
      }
    };

    const { color, icon } = statusConfig[status];
    return (
      <Badge variant="outline" className={color}>
        {icon}
        <span className="ml-1">
          {status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </span>
      </Badge>
    );
  };

  const getDueDateStatus = (dueDate: string) => {
    const date = new Date(dueDate);
    if (isPast(date) && !isToday(date)) {
      return 'text-red-600';
    } else if (isToday(date)) {
      return 'text-yellow-600';
    } else if (isFuture(date)) {
      return 'text-green-600';
    }
    return 'text-gray-600';
  };

  const toggleMilestoneExpansion = (milestoneId: string) => {
    setExpandedMilestones(prev => {
      const next = new Set(prev);
      if (next.has(milestoneId)) {
        next.delete(milestoneId);
      } else {
        next.add(milestoneId);
      }
      return next;
    });
  };

  const handleStatusUpdate = (milestoneId: string, newStatus: Milestone['status']) => {
    if (onEditMilestone) {
      onEditMilestone(milestoneId, { status: newStatus });
    }
  };

  const handleDeliverableSubmitted = () => {
    // Refresh the milestones data
    if (onEditMilestone) {
      onEditMilestone(milestones[0].id!, {});
    }
  };

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex justify-between items-center">
          <CardTitle>Project Milestones</CardTitle>
          {isClient && (
            <Dialog open={isAddingMilestone} onOpenChange={setIsAddingMilestone}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Milestone
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Milestone</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newMilestone.title}
                      onChange={(e) => setNewMilestone(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter milestone title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newMilestone.description}
                      onChange={(e) => setNewMilestone(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter milestone description"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newMilestone.dueDate}
                      onChange={(e) => setNewMilestone(prev => ({ ...prev, dueDate: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tasks</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="Add a task"
                      />
                      <Button onClick={handleAddTask}>Add</Button>
                    </div>
                    <div className="space-y-2 mt-2">
                      {newMilestone.tasks.map((task) => (
                        <div key={task.id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={(e) => {
                              const updatedTasks = newMilestone.tasks.map(t =>
                                t.id === task.id ? { ...t, completed: e.target.checked } : t
                              );
                              setNewMilestone(prev => ({ ...prev, tasks: updatedTasks }));
                            }}
                          />
                          <span>{task.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsAddingMilestone(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddMilestone}
                      disabled={!newMilestone.title.trim() || !newMilestone.dueDate}
                    >
                      Add Milestone
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {milestones.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>No milestones have been created yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {milestones.map((milestone) => (
              <Card key={milestone.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-gray-600" />
                      <CardTitle className="text-lg">{milestone.title}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">
                        {milestone.status.replace('_', ' ')}
                      </Badge>
                      <MilestoneStatusUpdate
                        milestone={milestone}
                        projectId={projectId}
                        onStatusUpdate={handleStatusUpdate}
                        isClient={isClient}
                        projectStatus={projectStatus}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{milestone.description}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {new Date(milestone.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Tasks Section */}
                  {milestone.tasks && milestone.tasks.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Tasks</h4>
                      <div className="space-y-2">
                        {milestone.tasks.map((task) => (
                          <div key={task.id} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={task.completed}
                              onChange={(e) => handleUpdateTaskStatus(milestone.id!, task.id, e.target.checked)}
                              className="h-4 w-4 rounded border-gray-300"
                            />
                            <span className={task.completed ? 'line-through text-gray-500' : ''}>
                              {task.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Deliverables Section */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Deliverables</h4>
                      {!isClient && milestone.status === 'in_progress' && projectStatus === 'in_progress' && (
                        <DeliverableSubmission
                          milestoneId={milestone.id!}
                          projectId={projectId}
                          onDeliverableSubmitted={handleDeliverableSubmitted}
                        />
                      )}
                    </div>
                    {milestone.deliverables && milestone.deliverables.length > 0 ? (
                      <div className="space-y-2">
                        {milestone.deliverables.map((deliverable, index) => (
                          <div key={index} className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                            <div className="flex-1">
                              <p className="text-sm font-medium">{deliverable.description}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                Type: {deliverable.deliverable_type}
                              </p>
                              {deliverable.content && (
                                <p className="text-sm mt-1">{deliverable.content}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No deliverables submitted yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectMilestones; 