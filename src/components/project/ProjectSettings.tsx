import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import {
  Settings,
  Save,
  X,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

interface ProjectSettingsProps {
  project: any;
  onUpdateProject: (updates: any) => Promise<void>;
  isOwner: boolean;
}

const ProjectSettings: React.FC<ProjectSettingsProps> = ({
  project,
  onUpdateProject,
  isOwner
}) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: project.title || '',
    description: project.description || '',
    status: project.status || 'active',
    visibility: project.visibility || 'private'
  });

  const handleSave = async () => {
    try {
      await onUpdateProject(formData);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Project settings updated successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update project settings.",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSwitchChange = (field: string) => (checked: boolean) => {
    setFormData(prev => ({ ...prev, [field]: checked }));
  };

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Project Settings
          </CardTitle>
          {isOwner && (
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? "outline" : "default"}
            >
              {isEditing ? <X className="h-4 w-4 mr-2" /> : <Settings className="h-4 w-4 mr-2" />}
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Basic Information</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Project Title</Label>
              {isEditing ? (
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              ) : (
                <p className="text-sm text-gray-600 mt-1">{formData.title}</p>
              )}
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              {isEditing ? (
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              ) : (
                <p className="text-sm text-gray-600 mt-1">{formData.description}</p>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Privacy Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Privacy & Access</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Project Visibility</Label>
                <p className="text-sm text-gray-500">Control who can see this project</p>
              </div>
              <Switch
                checked={formData.visibility === 'public'}
                onCheckedChange={handleSwitchChange('visibility')}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectSettings;
