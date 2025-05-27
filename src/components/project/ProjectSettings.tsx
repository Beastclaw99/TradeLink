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

interface ProjectSettings {
  name: string;
  description: string;
  status: 'active' | 'on_hold' | 'completed' | 'cancelled';
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
  settings: ProjectSettings;
  isClient: boolean;
  onUpdateSettings: (settings: Partial<ProjectSettings>) => Promise<void>;
  availableTimezones: string[];
  availableLanguages: string[];
}

const ProjectSettings: React.FC<ProjectSettingsProps> = ({
  settings,
  isClient,
  onUpdateSettings,
  availableTimezones,
  availableLanguages
}) => {
  const { toast } = useToast();
  const [editedSettings, setEditedSettings] = useState<ProjectSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [newTag, setNewTag] = useState('');

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdateSettings(editedSettings);
      toast({
        title: "Success",
        description: "Project settings updated successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update project settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;

    setEditedSettings(prev => ({
      ...prev,
      tags: [...prev.tags, newTag.trim()]
    }));
    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditedSettings(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  if (!isClient) {
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
                onValueChange={(value) => setEditedSettings(prev => ({ ...prev, status: value as ProjectSettings['status'] }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="on_hold">On Hold</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={editedSettings.description}
              onChange={(e) => setEditedSettings(prev => ({ ...prev, description: e.target.value }))}
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
              value={editedSettings.visibility}
              onValueChange={(value) => setEditedSettings(prev => ({ ...prev, visibility: value as ProjectSettings['visibility'] }))}
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
                checked={editedSettings.permissions.allowMemberInvites}
                onCheckedChange={(checked) => setEditedSettings(prev => ({
                  ...prev,
                  permissions: { ...prev.permissions, allowMemberInvites: checked }
                }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Allow File Uploads</Label>
                <p className="text-sm text-gray-500">Let team members upload files to the project</p>
              </div>
              <Switch
                checked={editedSettings.permissions.allowFileUploads}
                onCheckedChange={(checked) => setEditedSettings(prev => ({
                  ...prev,
                  permissions: { ...prev.permissions, allowFileUploads: checked }
                }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Allow Comments</Label>
                <p className="text-sm text-gray-500">Let team members comment on project items</p>
              </div>
              <Switch
                checked={editedSettings.permissions.allowComments}
                onCheckedChange={(checked) => setEditedSettings(prev => ({
                  ...prev,
                  permissions: { ...prev.permissions, allowComments: checked }
                }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Allow Task Creation</Label>
                <p className="text-sm text-gray-500">Let team members create new tasks</p>
              </div>
              <Switch
                checked={editedSettings.permissions.allowTaskCreation}
                onCheckedChange={(checked) => setEditedSettings(prev => ({
                  ...prev,
                  permissions: { ...prev.permissions, allowTaskCreation: checked }
                }))}
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
                checked={editedSettings.notifications.email}
                onCheckedChange={(checked) => setEditedSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, email: checked }
                }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>In-App Notifications</Label>
                <p className="text-sm text-gray-500">Receive notifications within the application</p>
              </div>
              <Switch
                checked={editedSettings.notifications.inApp}
                onCheckedChange={(checked) => setEditedSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, inApp: checked }
                }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Mention Notifications</Label>
                <p className="text-sm text-gray-500">Get notified when someone mentions you</p>
              </div>
              <Switch
                checked={editedSettings.notifications.mentions}
                onCheckedChange={(checked) => setEditedSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, mentions: checked }
                }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Project Updates</Label>
                <p className="text-sm text-gray-500">Receive notifications about project updates</p>
              </div>
              <Switch
                checked={editedSettings.notifications.updates}
                onCheckedChange={(checked) => setEditedSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, updates: checked }
                }))}
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
                value={editedSettings.timezone}
                onValueChange={(value) => setEditedSettings(prev => ({ ...prev, timezone: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {availableTimezones.map((timezone) => (
                    <SelectItem key={timezone} value={timezone}>
                      {timezone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateFormat">Date Format</Label>
              <Select
                value={editedSettings.dateFormat}
                onValueChange={(value) => setEditedSettings(prev => ({ ...prev, dateFormat: value }))}
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
                value={editedSettings.defaultLanguage}
                onValueChange={(value) => setEditedSettings(prev => ({ ...prev, defaultLanguage: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {availableLanguages.map((language) => (
                    <SelectItem key={language} value={language}>
                      {language}
                    </SelectItem>
                  ))}
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
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
              />
              <Button onClick={handleAddTag}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {editedSettings.tags.map((tag) => (
                <div
                  key={tag}
                  className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-sm"
                >
                  <span>{tag}</span>
                  <button
                    onClick={() => handleRemoveTag(tag)}
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
  );
};

export default ProjectSettings; 