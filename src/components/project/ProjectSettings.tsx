import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/components/ui/use-toast";
import {
  Settings,
  Save,
  AlertTriangle,
  Lock,
  Globe,
  Bell,
  Users,
  FileText,
  Calendar,
  Tag
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useProjectStatus } from '@/hooks/useProjectStatus';
import { Project, ProjectStatus } from '@/types/database';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

interface ProjectSettings {
  name: string;
  description: string;
  status: ProjectStatus;
  visibility: 'public' | 'private' | 'team';
  notifications: {
    email: boolean;
    inApp: boolean;
    mentions: boolean;
    updates: boolean;
  };
  permissions: {
    allowMemberInvites: boolean;
    allowFileUploads: boolean;
    allowComments: boolean;
    allowTaskCreation: boolean;
  };
  timezone: string;
  dateFormat: string;
  defaultLanguage: string;
  tags: string[];
}

interface ProjectSettingsProps {
  project: Project;
  onUpdate: () => void;
}

const ProjectSettings: React.FC<ProjectSettingsProps> = ({ project, onUpdate }) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [editedSettings, setEditedSettings] = useState({
    name: project.title || '',
    status: project.status || 'draft'
  });
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [statusMetadata, setStatusMetadata] = useState({
    cancellation_reason: '',
    dispute_reason: '',
    revision_notes: ''
  });

  const { updateProjectStatus, canTransitionTo, isUpdating } = useProjectStatus(
    project.id,
    project.client_id
  );

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const { error } = await supabase
        .from('projects')
        .update({
          title: editedSettings.name,
          updated_at: new Date().toISOString()
        })
        .eq('id', project.id);

      if (error) throw error;

      toast({
        title: "Settings Updated",
        description: "Project settings have been updated successfully."
      });

      onUpdate();
    } catch (error: any) {
      console.error('Error updating project settings:', error);
      toast({
        title: "Error",
        description: "Failed to update project settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (newStatus: ProjectStatus) => {
    // Check if we need additional metadata
    if (['cancelled', 'disputed', 'work_revision_requested'].includes(newStatus)) {
      setShowStatusDialog(true);
      return;
    }

    // Proceed with status update
    const result = await updateProjectStatus(newStatus);
    if (result.success) {
      setEditedSettings(prev => ({ ...prev, status: newStatus }));
      onUpdate();
    }
  };

  const handleStatusDialogConfirm = async () => {
    const metadata = {
      ...(editedSettings.status === 'cancelled' && { cancellation_reason: statusMetadata.cancellation_reason }),
      ...(editedSettings.status === 'disputed' && { dispute_reason: statusMetadata.dispute_reason }),
      ...(editedSettings.status === 'work_revision_requested' && { revision_notes: statusMetadata.revision_notes })
    };

    const result = await updateProjectStatus(editedSettings.status, metadata);
    if (result.success) {
      setShowStatusDialog(false);
      setStatusMetadata({
        cancellation_reason: '',
        dispute_reason: '',
        revision_notes: ''
      });
      onUpdate();
    }
  };

  if (!project) {
    return (
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Project Settings</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-8 text-gray-500">
            <Lock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>You don't have permission to view or edit project settings.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Project Settings</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              value={editedSettings.name}
              onChange={(e) => setEditedSettings(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Project Status</Label>
            <Select
              value={editedSettings.status}
              onValueChange={(value) => {
                if (canTransitionTo(project.status, value as ProjectStatus, project)) {
                  setEditedSettings(prev => ({ ...prev, status: value }));
                  handleStatusChange(value as ProjectStatus);
                } else {
                  toast({
                    title: "Invalid Status Change",
                    description: "This status change is not allowed at this time.",
                    variant: "destructive"
                  });
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="work_submitted">Work Submitted</SelectItem>
                <SelectItem value="work_revision_requested">Revision Requested</SelectItem>
                <SelectItem value="work_approved">Work Approved</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="disputed">Disputed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </CardContent>

      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Additional Information Required</DialogTitle>
            <DialogDescription>
              Please provide additional information for this status change.
            </DialogDescription>
          </DialogHeader>

          {editedSettings.status === 'cancelled' && (
            <div className="space-y-2">
              <Label htmlFor="cancellation_reason">Reason for Cancellation</Label>
              <Textarea
                id="cancellation_reason"
                value={statusMetadata.cancellation_reason}
                onChange={(e) => setStatusMetadata(prev => ({ ...prev, cancellation_reason: e.target.value }))}
                placeholder="Please provide a reason for cancelling this project"
              />
            </div>
          )}

          {editedSettings.status === 'disputed' && (
            <div className="space-y-2">
              <Label htmlFor="dispute_reason">Reason for Dispute</Label>
              <Textarea
                id="dispute_reason"
                value={statusMetadata.dispute_reason}
                onChange={(e) => setStatusMetadata(prev => ({ ...prev, dispute_reason: e.target.value }))}
                placeholder="Please provide details about the dispute"
              />
            </div>
          )}

          {editedSettings.status === 'work_revision_requested' && (
            <div className="space-y-2">
              <Label htmlFor="revision_notes">Revision Notes</Label>
              <Textarea
                id="revision_notes"
                value={statusMetadata.revision_notes}
                onChange={(e) => setStatusMetadata(prev => ({ ...prev, revision_notes: e.target.value }))}
                placeholder="Please provide details about what needs to be revised"
              />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStatusDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleStatusDialogConfirm}>
              Confirm Status Change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ProjectSettings; 