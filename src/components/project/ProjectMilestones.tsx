import React, { useState, useEffect } from 'react';
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
import { format, isPast, isToday, isFuture, differenceInDays } from 'date-fns';
import { Milestone } from './creation/types';
import MilestoneStatusUpdate from './MilestoneStatusUpdate';
import DeliverableSubmission from './DeliverableSubmission';
import DeliverableReview from './DeliverableReview';
import { ProjectStatus } from '@/types/projectUpdates';
import { supabase } from '@/integrations/supabase/client';
import MilestoneTasks from './MilestoneTasks';
import { ProjectMilestone } from '@/types/database';
import { convertDBMilestoneToMilestone } from '@/utils/milestoneTransformers';

interface ProjectMilestonesProps {
  projectId: string;
  projectStatus: ProjectStatus;
  milestones: ProjectMilestone[];
  isClient?: boolean;
  onAddMilestone?: () => void;
  onEditMilestone?: (milestoneId: string, updates: Partial<ProjectMilestone>) => Promise<void>;
  onDeleteMilestone?: (milestoneId: string) => Promise<void>;
  onUpdateTaskStatus?: (milestoneId: string, taskId: string, completed: boolean) => Promise<void>;
}

const ProjectMilestones: React.FC<ProjectMilestonesProps> = ({
  projectId,
  projectStatus,
  milestones,
  isClient = false,
  onAddMilestone,
  onEditMilestone,
  onDeleteMilestone,
  onUpdateTaskStatus
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
    deliverables: []
  });
  const [newTask, setNewTask] = useState('');
  const [deliverables, setDeliverables] = useState<Record<string, Deliverable[]>>({});

  useEffect(() => {
    const fetchDeliverables = async () => {
      const deliverablesMap: Record<string, Deliverable[]> = {};
      
      for (const milestone of milestones) {
        if (milestone.id) {
          const { data, error } = await supabase
            .from('project_deliverables')
            .select('*')
            .eq('milestone_id', milestone.id)
            .order('created_at', { ascending: false });

          if (!error && data) {
            deliverablesMap[milestone.id] = data.map(d => ({
              id: d.id,
              description: d.description,
              deliverable_type: d.deliverable_type as 'file' | 'note' | 'link',
              content: d.content,
              file_url: d.file_url,
              file_name: d.file_name,
              milestone_id: d.milestone_id,
              uploaded_by: d.uploaded_by,
              created_at: d.created_at,
              status: d.status as 'pending' | 'approved' | 'rejected',
              feedback: d.feedback,
              reviewed_at: d.reviewed_at
            }));
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
      await onAddMilestone();
      setNewMilestone({
        title: '',
        description: '',
        dueDate: '',
        status: 'not_started',
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

  const handleEditMilestone = async (milestoneId: string, updates: Partial<ProjectMilestone>) => {
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

  const getStatusBadge = (status: string | null, dueDate: string | null) => {
    const deadlineStatus = getDeadlineStatus(dueDate);
    
    switch (status) {
      case 'completed':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle2 className="h-4 w-4 mr-1" />
            Completed
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Clock className="h-4 w-4 mr-1" />
            In Progress
          </Badge>
        );
      case 'not_started':
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            <Target className="h-4 w-4 mr-1" />
            Not Started
          </Badge>
        );
      default:
        return (
          <Badge variant={deadlineStatus.variant}>
            <AlertTriangle className="h-4 w-4 mr-1" />
            {deadlineStatus.label}
          </Badge>
        );
    }
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

  const handleStatusUpdate = async (milestoneId: string, newStatus: string) => {
    if (!onEditMilestone) return;
    
    try {
      await onEditMilestone(milestoneId, { status: newStatus });
    } catch (error) {
      console.error('Error updating milestone status:', error);
    }
  };

  const handleDeliverableSubmitted = () => {
    // Refresh the deliverables data
    const fetchDeliverables = async () => {
      const deliverablesMap: Record<string, Deliverable[]> = {};
      
      for (const milestone of milestones) {
        if (milestone.id) {
          const { data, error } = await supabase
            .from('project_deliverables')
            .select('*')
            .eq('milestone_id', milestone.id)
            .order('created_at', { ascending: false });

          if (!error && data) {
            deliverablesMap[milestone.id] = data.map(d => ({
              id: d.id,
              description: d.description,
              deliverable_type: d.deliverable_type as 'file' | 'note' | 'link',
              content: d.content,
              file_url: d.file_url,
              file_name: d.file_name,
              milestone_id: d.milestone_id,
              uploaded_by: d.uploaded_by,
              created_at: d.created_at,
              status: d.status as 'pending' | 'approved' | 'rejected',
              feedback: d.feedback,
              reviewed_at: d.reviewed_at
            }));
          }
        }
      }
      
      setDeliverables(deliverablesMap);
    };

    fetchDeliverables();
  };

  const getDeadlineStatus = (dueDate: string | null): { label: string; variant: 'default' | 'secondary' | 'destructive' } => {
    if (!dueDate) return { label: 'No deadline', variant: 'secondary' };
    
    const now = new Date();
    const deadline = new Date(dueDate);
    const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { label: 'Overdue', variant: 'destructive' };
    } else if (diffDays <= 3) {
      return { label: 'Due soon', variant: 'destructive' };
    } else if (diffDays <= 7) {
      return { label: 'Due in a week', variant: 'secondary' };
    } else {
      return { label: 'On track', variant: 'default' };
    }
  };

  const convertedMilestones: Milestone[] = milestones.map(milestone => convertDBMilestoneToMilestone(milestone));

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
        {convertedMilestones.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>No milestones have been created yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {convertedMilestones.map((milestone) => {
              const deadlineStatus = milestone.due_date ? getDeadlineStatus(milestone.due_date) : null;
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
                        {getStatusBadge(milestone.status, milestone.due_date)}
                        <MilestoneStatusUpdate
                          milestoneId={milestone.id}
                          projectId={projectId}
                          projectTitle={milestone.title}
                          milestoneTitle={milestone.title}
                          currentStatus={milestone.status}
                          clientId={milestone.created_by || ''}
                          professionalId={milestone.created_by || ''}
                          onStatusUpdate={() => handleStatusUpdate(milestone.id, milestone.status)}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">{milestone.description || 'No description provided'}</p>
                    {deadlineStatus && (
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className={`text-sm ${deadlineStatus.variant === 'destructive' ? 'text-red-600' : deadlineStatus.variant === 'secondary' ? 'text-yellow-600' : 'text-green-600'}`}>
                            {deadlineStatus.label}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Tasks Section */}
                    <div className="space-y-2">
                      <h4 className="font-medium">Tasks</h4>
                      <MilestoneTasks
                        milestoneId={milestone.id}
                        projectId={projectId}
                        projectTitle={milestone.title}
                        milestoneTitle={milestone.title}
                        clientId={milestone.created_by || ''}
                        professionalId={milestone.created_by || ''}
                        onTaskStatusUpdate={handleUpdateTaskStatus}
                      />
                    </div>

                    {/* Deliverables Section */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Deliverables</h4>
                        {!isClient && milestone.status === 'in_progress' && projectStatus === 'in_progress' && (
                          <DeliverableSubmission
                            milestoneId={milestone.id}
                            projectId={projectId}
                            projectTitle={milestone.title}
                            milestoneTitle={milestone.title}
                            clientId={milestone.created_by || ''}
                            professionalId={milestone.created_by || ''}
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
                                      onReviewSubmitted={handleDeliverableSubmitted}
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
