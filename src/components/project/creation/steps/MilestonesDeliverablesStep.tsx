import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, Target, FileText, Trash2, Calendar } from 'lucide-react';
import { ProjectData, Milestone, Deliverable } from '../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MilestonesDeliverablesStepProps {
  data: ProjectData;
  onUpdate: (data: Partial<ProjectData>) => void;
}

const MilestonesDeliverablesStep: React.FC<MilestonesDeliverablesStepProps> = ({ data, onUpdate }) => {
  const [newMilestone, setNewMilestone] = useState<Omit<Milestone, 'id'>>({
    title: '',
    description: '',
    dueDate: '',
    status: 'not_started',
    progress: 0,
    tasks: [],
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
        milestones: [...(data.milestones || []), { 
          ...newMilestone,
          id: crypto.randomUUID() // Generate ID for new milestone
        }]
      });
      setNewMilestone({
        title: '',
        description: '',
        dueDate: '',
        status: 'not_started',
        progress: 0,
        tasks: [],
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
                value={newMilestone.dueDate}
                onChange={(e) => setNewMilestone(prev => ({ ...prev, dueDate: e.target.value }))}
              />
            </div>
            
            <div className="flex items-center gap-2">
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
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{milestone.title}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMilestone(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{milestone.description}</p>
                <div className="mt-2 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {new Date(milestone.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  {milestone.requires_deliverable && (
                    <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                      Requires Deliverable
                    </Badge>
                  )}
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
              <Input
                id="deliverable-description"
                value={newDeliverable.description}
                onChange={(e) => setNewDeliverable(prev => ({ ...prev, description: e.target.value }))}
                placeholder="e.g., Final Design Files"
              />
            </div>
            
            <div>
              <Label htmlFor="deliverable-type">Type</Label>
              <Select
                value={newDeliverable.deliverable_type}
                onValueChange={(value) => setNewDeliverable(prev => ({ ...prev, deliverable_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="note">Note</SelectItem>
                  <SelectItem value="file">File</SelectItem>
                  <SelectItem value="link">Link</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="deliverable-content">Content</Label>
              <Textarea
                id="deliverable-content"
                value={newDeliverable.content}
                onChange={(e) => setNewDeliverable(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Enter deliverable content..."
              />
            </div>
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
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{deliverable.description}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDeliverable(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Badge variant="outline" className="mb-2">
                  {deliverable.deliverable_type}
                </Badge>
                <p className="text-sm text-gray-600">{deliverable.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MilestonesDeliverablesStep; 