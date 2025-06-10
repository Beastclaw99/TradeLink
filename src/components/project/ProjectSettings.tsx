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
import { ProjectStatus } from '@/types/projectUpdates';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

interface ProjectSettings {
  name: string;
  description: string;
  status: 'open' | 'assigned' | 'in_progress' | 'work_submitted' | 'work_revision_requested' | 'work_approved' | 'completed' | 'archived' | 'cancelled' | 'disputed';
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
  project: any;
  onUpdate: () => void;
}

const ProjectSettings: React.FC<ProjectSettingsProps> = ({ project, onUpdate }) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [editedSettings, setEditedSettings] = useState({
    name: project.title || '',
    status: project.status || 'open'
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

    const result = await updateProjectStatus(editedSettings.status as ProjectStatus, metadata);
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
    <>
      <Card>
        <CardHeader className="border-b">
          <div className="flex justify-between items-center">
            <CardTitle>Project Settings</CardTitle>
            <Button
              onClick={handleSave}
              disabled={isSaving}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={project.description}
                onChange={(e) => {
                  // Handle description update
                }}
                rows={4}
              />
            </div>
          </div>

          {/* Visibility and Access */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Visibility and Access
            </h3>
            <div className="space-y-2">
              <Label htmlFor="visibility">Project Visibility</Label>
              <Select
                value={project.visibility}
                onValueChange={(value) => {
                  // Handle visibility update
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="team">Team Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Allow Member Invites</Label>
                  <p className="text-sm text-gray-500">Let team members invite new members to the project</p>
                </div>
                <Switch
                  checked={project.permissions.allowMemberInvites}
                  onCheckedChange={(checked) => {
                    // Handle allowMemberInvites update
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Allow File Uploads</Label>
                  <p className="text-sm text-gray-500">Let team members upload files to the project</p>
                </div>
                <Switch
                  checked={project.permissions.allowFileUploads}
                  onCheckedChange={(checked) => {
                    // Handle allowFileUploads update
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Allow Comments</Label>
                  <p className="text-sm text-gray-500">Let team members comment on project items</p>
                </div>
                <Switch
                  checked={project.permissions.allowComments}
                  onCheckedChange={(checked) => {
                    // Handle allowComments update
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Allow Task Creation</Label>
                  <p className="text-sm text-gray-500">Let team members create new tasks</p>
                </div>
                <Switch
                  checked={project.permissions.allowTaskCreation}
                  onCheckedChange={(checked) => {
                    // Handle allowTaskCreation update
                  }}
                />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-gray-500">Receive project updates via email</p>
                </div>
                <Switch
                  checked={project.notifications.email}
                  onCheckedChange={(checked) => {
                    // Handle email notifications update
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>In-App Notifications</Label>
                  <p className="text-sm text-gray-500">Receive notifications within the application</p>
                </div>
                <Switch
                  checked={project.notifications.inApp}
                  onCheckedChange={(checked) => {
                    // Handle in-app notifications update
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mention Notifications</Label>
                  <p className="text-sm text-gray-500">Get notified when someone mentions you</p>
                </div>
                <Switch
                  checked={project.notifications.mentions}
                  onCheckedChange={(checked) => {
                    // Handle mention notifications update
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Project Updates</Label>
                  <p className="text-sm text-gray-500">Receive notifications about project updates</p>
                </div>
                <Switch
                  checked={project.notifications.updates}
                  onCheckedChange={(checked) => {
                    // Handle project updates update
                  }}
                />
              </div>
            </div>
          </div>

          {/* Localization */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Localization
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={project.timezone}
                  onValueChange={(value) => {
                    // Handle timezone update
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Add timezone options here */}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateFormat">Date Format</Label>
                <Select
                  value={project.dateFormat}
                  onValueChange={(value) => {
                    // Handle date format update
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Default Language</Label>
                <Select
                  value={project.defaultLanguage}
                  onValueChange={(value) => {
                    // Handle default language update
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Add language options here */}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Project Tags
            </h3>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={project.tags.join(', ')}
                  onChange={(e) => {
                    // Handle tags update
                  }}
                  placeholder="Add a tag"
                />
                <Button>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {project.tags.map((tag: string) => (
                  <div
                    key={tag}
                    className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    <span>{tag}</span>
                    <button
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Change Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Status Change Details</DialogTitle>
            <DialogDescription>
              Please provide additional information required for this status change.
            </DialogDescription>
          </DialogHeader>

          {editedSettings.status === 'cancelled' && (
            <div className="space-y-4">
              <Label htmlFor="cancellation_reason">Reason for Cancellation</Label>
              <Textarea
                id="cancellation_reason"
                value={statusMetadata.cancellation_reason}
                onChange={(e) => setStatusMetadata(prev => ({
                  ...prev,
                  cancellation_reason: e.target.value
                }))}
                placeholder="Please provide a reason for cancelling the project"
              />
            </div>
          )}

          {editedSettings.status === 'disputed' && (
            <div className="space-y-4">
              <Label htmlFor="dispute_reason">Reason for Dispute</Label>
              <Textarea
                id="dispute_reason"
                value={statusMetadata.dispute_reason}
                onChange={(e) => setStatusMetadata(prev => ({
                  ...prev,
                  dispute_reason: e.target.value
                }))}
                placeholder="Please provide details about the dispute"
              />
            </div>
          )}

          {editedSettings.status === 'work_revision_requested' && (
            <div className="space-y-4">
              <Label htmlFor="revision_notes">Revision Notes</Label>
              <Textarea
                id="revision_notes"
                value={statusMetadata.revision_notes}
                onChange={(e) => setStatusMetadata(prev => ({
                  ...prev,
                  revision_notes: e.target.value
                }))}
                placeholder="Please provide details about the required revisions"
              />
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowStatusDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleStatusDialogConfirm}
              disabled={isUpdating}
            >
              Confirm Status Change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectSettings; 