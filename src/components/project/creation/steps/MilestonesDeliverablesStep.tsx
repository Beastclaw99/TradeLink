import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, Target, FileText, Trash2, Calendar } from 'lucide-react';
import { ProjectData, Milestone } from '../types';
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
    deliverables: []
  });

  const [newDeliverable, setNewDeliverable] = useState<Milestone['deliverables'][0]>({
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
        deliverables: []
      });
    }
  };

  const removeMilestone = (index: number) => {
    const updated = data.milestones.filter((_, i) => i !== index);
    onUpdate({ milestones: updated });
  };

  const addDeliverable = (milestoneIndex: number) => {
    if (newDeliverable.description.trim()) {
      const updatedMilestones = [...data.milestones];
      if (!updatedMilestones[milestoneIndex].deliverables) {
        updatedMilestones[milestoneIndex].deliverables = [];
      }
      updatedMilestones[milestoneIndex].deliverables = [
        ...updatedMilestones[milestoneIndex].deliverables,
        newDeliverable
      ];
      onUpdate({ milestones: updatedMilestones });
      setNewDeliverable({
        description: '',
        deliverable_type: 'note',
        content: ''
      });
    }
  };

  const removeDeliverable = (milestoneIndex: number, deliverableIndex: number) => {
    const updatedMilestones = [...data.milestones];
    if (updatedMilestones[milestoneIndex].deliverables) {
      updatedMilestones[milestoneIndex].deliverables = updatedMilestones[milestoneIndex].deliverables.filter(
        (_, i) => i !== deliverableIndex
      );
      onUpdate({ milestones: updatedMilestones });
    }
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
          </div>
          
          <Button onClick={addMilestone} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Milestone
          </Button>
        </div>

        {/* Display Added Milestones */}
        <div className="space-y-6">
          {(data.milestones || []).map((milestone, milestoneIndex) => (
            <Card key={milestoneIndex}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{milestone.title}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMilestone(milestoneIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{milestone.description}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {new Date(milestone.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <Badge variant="outline" className="border-gray-200 bg-gray-50 text-gray-700">
                    {milestone.status}
                  </Badge>
                </div>

                {/* Deliverables Section */}
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Deliverables
                    </h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addDeliverable(milestoneIndex)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Deliverable
                    </Button>
                  </div>

                  {/* New Deliverable Form */}
                  <div className="grid gap-4 p-4 border rounded-lg bg-gray-50">
                    <div>
                      <Label htmlFor={`deliverable-description-${milestoneIndex}`}>Description</Label>
                      <Input
                        id={`deliverable-description-${milestoneIndex}`}
                        value={newDeliverable.description}
                        onChange={(e) => setNewDeliverable(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="e.g., Final Design Files"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`deliverable-type-${milestoneIndex}`}>Type</Label>
                      <Select
                        value={newDeliverable.deliverable_type}
                        onValueChange={(value) => setNewDeliverable(prev => ({ ...prev, deliverable_type: value as 'file' | 'note' | 'link' }))}
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
                      <Label htmlFor={`deliverable-content-${milestoneIndex}`}>Content</Label>
                      <Textarea
                        id={`deliverable-content-${milestoneIndex}`}
                        value={newDeliverable.content}
                        onChange={(e) => setNewDeliverable(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Enter deliverable content..."
                      />
                    </div>
                  </div>

                  {/* Display Deliverables */}
                  <div className="space-y-2">
                    {(milestone.deliverables || []).map((deliverable, deliverableIndex) => (
                      <div key={deliverableIndex} className="flex items-center justify-between p-2 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="capitalize">
                            {deliverable.deliverable_type}
                          </Badge>
                          <span className="text-sm">{deliverable.description}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDeliverable(milestoneIndex, deliverableIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
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