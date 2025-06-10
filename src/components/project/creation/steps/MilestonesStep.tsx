import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, X, Upload, FileText } from 'lucide-react';
import { ProjectData, Milestone } from '../types';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface MilestonesStepProps {
  data: ProjectData;
  onUpdate: (data: Partial<ProjectData>) => void;
}

const MilestonesStep: React.FC<MilestonesStepProps> = ({ data, onUpdate }) => {
  const { toast } = useToast();
  const [newMilestone, setNewMilestone] = useState<Partial<Milestone>>({
    title: '',
    description: '',
    due_date: '',
    amount: 0,
    deliverables: []
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleAddMilestone = () => {
    if (!newMilestone.title || !newMilestone.description || !newMilestone.due_date) return;

    const updatedMilestones = [...(data.milestones || []), newMilestone as Milestone];
    onUpdate({ milestones: updatedMilestones });
    setNewMilestone({
      title: '',
      description: '',
      due_date: '',
      amount: 0,
      deliverables: []
    });
  };

  const handleRemoveMilestone = (index: number) => {
    const updatedMilestones = data.milestones?.filter((_, i) => i !== index);
    onUpdate({ milestones: updatedMilestones });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async (milestoneIndex: number) => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `deliverables/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('project-files')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('project-files')
        .getPublicUrl(filePath);

      const updatedMilestones = [...(data.milestones || [])];
      updatedMilestones[milestoneIndex].deliverables = [
        ...(updatedMilestones[milestoneIndex].deliverables || []),
        {
          description: selectedFile.name,
          file_url: publicUrl,
          deliverable_type: 'file'
        }
      ];

      onUpdate({ milestones: updatedMilestones });
      setSelectedFile(null);
      
      toast({
        title: "File Uploaded",
        description: "Deliverable has been uploaded successfully."
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "Failed to upload file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Project Milestones</h3>
        <p className="text-gray-600 mb-6">
          Break down your project into manageable milestones. For each milestone, you can specify
          deliverables and upload supporting documents.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* New Milestone Form */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Milestone Title</Label>
                  <Input
                    value={newMilestone.title}
                    onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                    placeholder="e.g., Design Phase"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={newMilestone.due_date}
                    onChange={(e) => setNewMilestone({ ...newMilestone, due_date: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={newMilestone.description}
                  onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                  placeholder="Describe what needs to be completed in this milestone"
                />
              </div>

              <div className="space-y-2">
                <Label>Amount ($)</Label>
                <Input
                  type="number"
                  value={newMilestone.amount}
                  onChange={(e) => setNewMilestone({ ...newMilestone, amount: Number(e.target.value) })}
                  placeholder="Enter milestone amount"
                />
              </div>

              <Button onClick={handleAddMilestone} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Milestone
              </Button>
            </div>

            {/* Milestones List */}
            {data.milestones && data.milestones.length > 0 && (
              <div className="space-y-4">
                <Label>Current Milestones</Label>
                {data.milestones.map((milestone, index) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{milestone.title}</h4>
                          <p className="text-sm text-gray-600">{milestone.description}</p>
                          <p className="text-sm text-gray-500">
                            Due: {new Date(milestone.due_date).toLocaleDateString()}
                          </p>
                          <p className="text-sm font-medium">${milestone.amount}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveMilestone(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Deliverables Section */}
                      <div className="space-y-2">
                        <Label>Deliverables</Label>
                        <div className="flex gap-2">
                          <Input
                            type="file"
                            onChange={handleFileChange}
                            accept=".pdf,.doc,.docx,.txt,.zip"
                          />
                          <Button
                            onClick={() => handleFileUpload(index)}
                            disabled={!selectedFile || isUploading}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            {isUploading ? 'Uploading...' : 'Upload'}
                          </Button>
                        </div>

                        {milestone.deliverables && milestone.deliverables.length > 0 && (
                          <div className="space-y-2 mt-2">
                            {milestone.deliverables.map((deliverable, dIndex) => (
                              <div key={dIndex} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                <FileText className="h-4 w-4 text-blue-600" />
                                <span className="text-sm">{deliverable.description}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MilestonesStep; 