import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, X, Target, FileText } from 'lucide-react';
import { ProjectData, Milestone, Deliverable } from '../types';

interface MilestonesDeliverablesStepProps {
  data: ProjectData;
  onUpdate: (data: Partial<ProjectData>) => void;
}

const MilestonesDeliverablesStep: React.FC<MilestonesDeliverablesStepProps> = ({ data, onUpdate }) => {
  const [newMilestone, setNewMilestone] = useState<Milestone>({
    title: '',
    description: '',
    due_date: '',
    requires_deliverable: false
  });

  const [newDeliverable, setNewDeliverable] = useState<Deliverable>({
    description: '',
    deliverable_type: 'note',
    content: ''
  });

  const addMilestone = () => {
    if (newMilestone.title.trim()) {
      onUpdate({
        milestones: [...(data.milestones || []), { ...newMilestone }]
      });
      setNewMilestone({
        title: '',
        description: '',
        due_date: '',
        requires_deliverable: false
      });
    }
  };

  const removeMilestone = (index: number) => {
    const updated = data.milestones.filter((_, i) => i !== index);
    onUpdate({ milestones: updated });
  };

  const addDeliverable = () => {
    if (newDeliverable.description.trim()) {
      onUpdate({
        deliverables: [...(data.deliverables || []), { ...newDeliverable }]
      });
      setNewDeliverable({
        description: '',
        deliverable_type: 'note',
        content: ''
      });
    }
  };

  const removeDeliverable = (index: number) => {
    const updated = data.deliverables.filter((_, i) => i !== index);
    onUpdate({ deliverables: updated });
  };

  return (
    <div className="space-y-8">
      {/* Milestones Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-medium">Project Milestones</h3>
        </div>
        
        <div className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="milestone-title">Milestone Title</Label>
              <Input
                id="milestone-title"
                value={newMilestone.title}
                onChange={(e) => setNewMilestone(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Initial Consultation"
              />
            </div>
            
            <div>
              <Label htmlFor="milestone-description">Description</Label>
              <Textarea
                id="milestone-description"
                value={newMilestone.description}
                onChange={(e) => setNewMilestone(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what needs to be completed in this milestone..."
              />
            </div>
            
            <div>
              <Label htmlFor="milestone-due-date">Due Date</Label>
              <Input
                id="milestone-due-date"
                type="date"
                value={newMilestone.due_date}
                onChange={(e) => setNewMilestone(prev => ({ ...prev, due_date: e.target.value }))}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="requires-deliverable"
                checked={newMilestone.requires_deliverable}
                onCheckedChange={(checked) => 
                  setNewMilestone(prev => ({ ...prev, requires_deliverable: checked }))
                }
              />
              <Label htmlFor="requires-deliverable">Requires Deliverable</Label>
            </div>
          </div>
          
          <Button onClick={addMilestone} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Milestone
          </Button>
        </div>

        {/* Display Added Milestones */}
        <div className="space-y-3">
          {(data.milestones || []).map((milestone, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{milestone.title}</h4>
                    {milestone.description && (
                      <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      {milestone.due_date && (
                        <span>Due: {new Date(milestone.due_date).toLocaleDateString()}</span>
                      )}
                      {milestone.requires_deliverable && (
                        <Badge variant="outline">Requires Deliverable</Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMilestone(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Deliverables Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-medium">Project Deliverables</h3>
        </div>
        
        <div className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="deliverable-description">Description</Label>
              <Textarea
                id="deliverable-description"
                value={newDeliverable.description}
                onChange={(e) => setNewDeliverable(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the deliverable..."
              />
            </div>
            
            <div>
              <Label htmlFor="deliverable-type">Type</Label>
              <select
                id="deliverable-type"
                value={newDeliverable.deliverable_type}
                onChange={(e) => setNewDeliverable(prev => ({ 
                  ...prev, 
                  deliverable_type: e.target.value as 'file' | 'note' | 'link' 
                }))}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="note">Note</option>
                <option value="link">External Link</option>
                <option value="file">File Upload</option>
              </select>
            </div>

            {newDeliverable.deliverable_type === 'link' && (
              <div>
                <Label htmlFor="deliverable-link">Link URL</Label>
                <Input
                  id="deliverable-link"
                  type="url"
                  value={newDeliverable.content}
                  onChange={(e) => setNewDeliverable(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
            )}
          </div>
          
          <Button onClick={addDeliverable} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Deliverable
          </Button>
        </div>

        {/* Display Added Deliverables */}
        <div className="space-y-3">
          {(data.deliverables || []).map((deliverable, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{deliverable.description}</h4>
                      <Badge variant="outline" className="capitalize">
                        {deliverable.deliverable_type}
                      </Badge>
                    </div>
                    {deliverable.content && (
                      <p className="text-sm text-gray-600 mt-1">{deliverable.content}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDeliverable(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MilestonesDeliverablesStep; 