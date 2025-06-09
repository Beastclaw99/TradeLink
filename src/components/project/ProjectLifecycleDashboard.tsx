
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Archive,
  FileText,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { projectLifecycleService, ProjectStatus } from '@/services/projectLifecycleService';
import ProjectHistory from './ProjectHistory';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ProjectLifecycleDashboardProps {
  projectId: string;
  onStatusUpdate?: (newStatus: ProjectStatus) => void;
}

const ProjectLifecycleDashboard: React.FC<ProjectLifecycleDashboardProps> = ({ 
  projectId, 
  onStatusUpdate 
}) => {
  const [lifecycleStatus, setLifecycleStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadLifecycleStatus();
  }, [projectId]);

  const loadLifecycleStatus = async () => {
    try {
      setLoading(true);
      const status = await projectLifecycleService.getProjectLifecycleStatus(projectId);
      setLifecycleStatus(status);
    } catch (error) {
      console.error('Error loading lifecycle status:', error);
      toast({
        title: 'Error',
        description: 'Failed to load project lifecycle status',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: ProjectStatus, reason?: string) => {
    try {
      setUpdating(true);
      const result = await projectLifecycleService.updateProjectStatus(
        projectId,
        newStatus,
        reason
      );

      if (result.success) {
        toast({
          title: 'Success',
          description: result.message
        });
        await loadLifecycleStatus();
        if (onStatusUpdate) {
          onStatusUpdate(newStatus);
        }
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update project status',
        variant: 'destructive'
      });
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      open: 'bg-blue-100 text-blue-800',
      assigned: 'bg-purple-100 text-purple-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      work_submitted: 'bg-indigo-100 text-indigo-800',
      work_revision_requested: 'bg-orange-100 text-orange-800',
      work_approved: 'bg-green-100 text-green-800',
      completed: 'bg-emerald-100 text-emerald-800',
      paid: 'bg-green-600 text-white',
      archived: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!lifecycleStatus) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            Failed to load project lifecycle information
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Project Lifecycle Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Current Status</span>
                <Badge className={getStatusColor(lifecycleStatus.status)}>
                  {lifecycleStatus.status.replace('_', ' ')}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-gray-600">
                  {Math.round(lifecycleStatus.progress)}%
                </span>
              </div>
              <Progress value={lifecycleStatus.progress} className="w-full" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Milestones</span>
                <span className="text-sm text-gray-600">
                  {lifecycleStatus.milestonesCompleted}/{lifecycleStatus.totalMilestones}
                </span>
              </div>
              {lifecycleStatus.overdueMilestones > 0 && (
                <div className="flex items-center text-red-600 text-sm">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  {lifecycleStatus.overdueMilestones} overdue
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Available Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {lifecycleStatus.validTransitions.map((status: ProjectStatus) => (
              <Button
                key={status}
                variant="outline"
                size="sm"
                onClick={() => handleStatusUpdate(status)}
                disabled={updating}
              >
                Move to {status.replace('_', ' ')}
              </Button>
            ))}
            
            {lifecycleStatus.status === 'completed' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusUpdate('archived', 'Project completed and archived')}
                disabled={updating}
              >
                <Archive className="h-4 w-4 mr-1" />
                Archive Project
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Project History */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            View Project History
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Project History</DialogTitle>
          </DialogHeader>
          <ProjectHistory projectId={projectId} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectLifecycleDashboard;
