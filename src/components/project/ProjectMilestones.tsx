
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from "@/components/ui/use-toast";
import {
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Target
} from 'lucide-react';
import { isPast, isToday, differenceInDays } from 'date-fns';
import { Milestone } from './creation/types';
import MilestoneStatusUpdate from './MilestoneStatusUpdate';
import DeliverableSubmission from './DeliverableSubmission';
import DeliverableReview from './DeliverableReview';
import { ProjectStatus } from '@/types/projectUpdates';
import { supabase } from '@/integrations/supabase/client';
import MilestoneTasks from './MilestoneTasks';

interface ProjectMilestonesProps {
  milestones: Milestone[];
  isClient: boolean;
  onAddMilestone: (milestone: Omit<Milestone, 'id'>) => Promise<void>;
  projectId: string;
  projectStatus: ProjectStatus;
}

const ProjectMilestones: React.FC<ProjectMilestonesProps> = ({
  milestones,
  isClient,
  onAddMilestone,
  projectId,
  projectStatus
}) => {
  const { toast } = useToast();
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);
  const [newMilestone, setNewMilestone] = useState<Omit<Milestone, 'id'>>({
    title: '',
    description: '',
    dueDate: '',
    status: 'not_started',
    deliverables: [],
    tasks: []
  });
  const [newTask, setNewTask] = useState('');
  const [deliverables, setDeliverables] = useState<Record<string, any[]>>({});

  useEffect(() => {
    const fetchDeliverables = async () => {
      const deliverablesMap: Record<string, any[]> = {};
      
      for (const milestone of milestones) {
        if (milestone.id) {
          const { data, error } = await supabase
            .from('project_deliverables')
            .select('*')
            .eq('milestone_id', milestone.id)
            .order('created_at', { ascending: false });

          if (!error && data) {
            deliverablesMap[milestone.id] = data;
          }
        }
      }
      
      setDeliverables(deliverablesMap);
    };

    fetchDeliverables();
  }, [milestones]);

  const handleAddMilestone = async () => {
    if (!newMilestone.title.trim() || !newMilestone.dueDate) return;
    try {
      await onAddMilestone({
        ...newMilestone
      });
      setNewMilestone({
        title: '',
        description: '',
        dueDate: '',
        status: 'not_started',
        deliverables: [],
        tasks: []
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

  const handleAddTask = () => {
    if (!newTask.trim()) return;

    setNewMilestone(prev => ({
      ...prev,
      tasks: [...(prev.tasks || []), { id: crypto.randomUUID(), title: newTask.trim(), completed: false }]
    }));
    setNewTask('');
  };

  const getStatusBadge = (status: Milestone['status'], dueDate?: string) => {
    // Check if milestone is overdue
    const isOverdue = dueDate && isPast(new Date(dueDate)) && !isToday(new Date(dueDate)) && status !== 'completed';
    const effectiveStatus = isOverdue ? 'overdue' : status;

    const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
      not_started: {
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: <Clock className="h-4 w-4" />
      },
      in_progress: {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: <Target className="h-4 w-4" />
      },
      completed: {
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: <CheckCircle2 className="h-4 w-4" />
      },
      on_hold: {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: <AlertTriangle className="h-4 w-4" />
      },
      overdue: {
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: <AlertTriangle className="h-4 w-4" />
      }
    };

    const { color, icon } = statusConfig[effectiveStatus];
    return (
      <Badge variant="outline" className={color}>
        {icon}
        <span className="ml-1">
          {effectiveStatus.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </span>
      </Badge>
    );
  };

  const handleStatusUpdate = (_newStatus: string) => {
    // Implementation for status update
  };

  const handleDeliverableSubmitted = () => {
    // Refresh the deliverables data
    const fetchDeliverables = async () => {
      const deliverablesMap: Record<string, any[]> = {};
      
      for (const milestone of milestones) {
        if (milestone.id) {
          const { data, error } = await supabase
            .from('project_deliverables')
            .select('*')
            .eq('milestone_id', milestone.id)
            .order('created_at', { ascending: false });

          if (!error && data) {
            deliverablesMap[milestone.id] = data;
          }
        }
      }
      
      setDeliverables(deliverablesMap);
    };

    fetchDeliverables();
  };

  const getDeadlineStatus = (dueDate: string) => {
    const today = new Date();
    const deadline = new Date(dueDate);
    const daysUntilDeadline = differenceInDays(deadline, today);

    if (isPast(deadline) && !isToday(deadline)) {
      return {
        status: 'overdue',
        message: 'Overdue',
        color: 'text-red-600'
      };
    } else if (isToday(deadline)) {
      return {
        status: 'due-today',
        message: 'Due today',
        color: 'text-orange-600'
      };
    } else if (daysUntilDeadline <= 3) {
      return {
        status: 'due-soon',
        message: `Due in ${daysUntilDeadline} days`,
        color: 'text-yellow-600'
      };
    } else {
      return {
        status: 'upcoming',
        message: `Due in ${daysUntilDeadline} days`,
        color: 'text-green-600'
      };
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
                      {(newMilestone.tasks || []).map((task) => (
                        <div key={task.id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={(e) => {
                              const updatedTasks = (newMilestone.tasks || []).map(t =>
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
            {milestones.map((milestone) => {
              const deadlineStatus = milestone.dueDate ? getDeadlineStatus(milestone.dueDate) : null;
              const milestoneDeliverables = deliverables[milestone.id!] || [];

              return (
                <Card key={milestone.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-gray-600" />
                        <CardTitle className="text-lg">{milestone.title}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(milestone.status, milestone.dueDate)}
                        <MilestoneStatusUpdate
                          milestoneId={milestone.id!}
                          projectId={projectId}
                          projectTitle={milestone.title}
                          milestoneTitle={milestone.title}
                          currentStatus={milestone.status}
                          clientId={milestone.created_by || ''}
                          professionalId={milestone.created_by || ''}
                          onStatusUpdate={handleStatusUpdate}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">{milestone.description}</p>
                    {deadlineStatus && (
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className={`text-sm ${deadlineStatus.color}`}>
                            {deadlineStatus.message}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Tasks Section */}
                    <div className="space-y-2">
                      <h4 className="font-medium">Tasks</h4>
                      <MilestoneTasks
                        milestoneId={milestone.id!}
                        projectId={projectId}
                        projectTitle={milestone.title}
                        milestoneTitle={milestone.title}
                        clientId={milestone.created_by || ''}
                        professionalId={milestone.created_by || ''}
                      />
                    </div>

                    {/* Deliverables Section */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Deliverables</h4>
                        {!isClient && milestone.status === 'in_progress' && projectStatus === 'in_progress' && (
                          <DeliverableSubmission
                            milestoneId={milestone.id!}
                            projectId={projectId}
                            onSubmissionComplete={handleDeliverableSubmitted}
                          />
                        )}
                      </div>
                      {milestoneDeliverables.length > 0 ? (
                        <div className="space-y-2">
                          {milestoneDeliverables.map((deliverable) => (
                            <div key={deliverable.id} className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium">{deliverable.description}</p>
                                  {isClient && projectStatus === 'work_submitted' && (
                                    <DeliverableReview
                                      deliverable={deliverable}
                                      onReviewComplete={handleDeliverableSubmitted}
                                    />
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  Type: {deliverable.deliverable_type}
                                </p>
                                {deliverable.content && (
                                  <p className="text-sm mt-1">{deliverable.content}</p>
                                )}
                                {deliverable.status && (
                                  <Badge 
                                    variant={deliverable.status === 'approved' ? 'default' : 'destructive'}
                                    className="mt-2"
                                  >
                                    {deliverable.status}
                                  </Badge>
                                )}
                                {deliverable.feedback && (
                                  <p className="text-sm text-gray-600 mt-2">
                                    Feedback: {deliverable.feedback}
                                  </p>
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
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectMilestones;
