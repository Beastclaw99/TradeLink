
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Settings,
  Bell,
  Archive,
  Trash2,
} from 'lucide-react';

interface ProjectSettingsProps {
  projectId: string;
  settings: ProjectSettingsData;
  onUpdateSettings: (settings: Partial<ProjectSettingsData>) => void;
  onArchiveProject: () => void;
  onDeleteProject: () => void;
  canManageProject: boolean;
}

interface ProjectSettingsData {
  isPublic: boolean;
  allowComments: boolean;
  emailNotifications: boolean;
  slackNotifications: boolean;
  autoAssignTasks: boolean;
  requireApproval: boolean;
  trackTime: boolean;
  timezone: string;
  language: string;
  currency: string;
  budget: number;
  description: string;
  tags: string[];
}

const ProjectSettings: React.FC<ProjectSettingsProps> = ({
  settings,
  onUpdateSettings,
  onArchiveProject,
  onDeleteProject,
  canManageProject
}) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (key: keyof ProjectSettingsData, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSaveSettings = () => {
    onUpdateSettings(localSettings);
    setHasChanges(false);
  };

  const handleArchive = () => {
    if (window.confirm('Are you sure you want to archive this project?')) {
      onArchiveProject();
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      onDeleteProject();
    }
  };

  if (!canManageProject) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">You don't have permission to manage project settings.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            General Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Project Description</Label>
            <Textarea
              id="description"
              value={localSettings.description}
              onChange={(e) => handleSettingChange('description', e.target.value)}
              placeholder="Enter project description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={localSettings.timezone}
                onValueChange={(value) => handleSettingChange('timezone', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="EST">EST</SelectItem>
                  <SelectItem value="PST">PST</SelectItem>
                  <SelectItem value="GMT">GMT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select
                value={localSettings.language}
                onValueChange={(value) => handleSettingChange('language', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={localSettings.currency}
                onValueChange={(value) => handleSettingChange('currency', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="CAD">CAD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budget</Label>
              <Input
                id="budget"
                type="number"
                value={localSettings.budget}
                onChange={(e) => handleSettingChange('budget', parseFloat(e.target.value) || 0)}
                placeholder="Enter budget"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-gray-500">Receive updates via email</p>
            </div>
            <Switch
              checked={localSettings.emailNotifications}
              onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Slack Notifications</Label>
              <p className="text-sm text-gray-500">Send updates to Slack channel</p>
            </div>
            <Switch
              checked={localSettings.slackNotifications}
              onCheckedChange={(checked) => handleSettingChange('slackNotifications', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Project Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Public Project</Label>
              <p className="text-sm text-gray-500">Allow public viewing of project</p>
            </div>
            <Switch
              checked={localSettings.isPublic}
              onCheckedChange={(checked) => handleSettingChange('isPublic', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Allow Comments</Label>
              <p className="text-sm text-gray-500">Enable commenting on project items</p>
            </div>
            <Switch
              checked={localSettings.allowComments}
              onCheckedChange={(checked) => handleSettingChange('allowComments', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-assign Tasks</Label>
              <p className="text-sm text-gray-500">Automatically assign tasks to team members</p>
            </div>
            <Switch
              checked={localSettings.autoAssignTasks}
              onCheckedChange={(checked) => handleSettingChange('autoAssignTasks', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Require Approval</Label>
              <p className="text-sm text-gray-500">Require approval for task completion</p>
            </div>
            <Switch
              checked={localSettings.requireApproval}
              onCheckedChange={(checked) => handleSettingChange('requireApproval', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Time Tracking</Label>
              <p className="text-sm text-gray-500">Enable time tracking for tasks</p>
            </div>
            <Switch
              checked={localSettings.trackTime}
              onCheckedChange={(checked) => handleSettingChange('trackTime', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleArchive}
            className="flex items-center gap-2"
          >
            <Archive className="h-4 w-4" />
            Archive Project
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete Project
          </Button>
        </div>
        <Button
          onClick={handleSaveSettings}
          disabled={!hasChanges}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default ProjectSettings;
