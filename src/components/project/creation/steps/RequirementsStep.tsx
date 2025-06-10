import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Info, Upload, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ProjectData } from '../types';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface RequirementsStepProps {
  data: ProjectData;
  onUpdate: (data: Partial<ProjectData>) => void;
}

const CATEGORY_SKILLS: Record<string, string[]> = {
  plumbing: [
    'Pipe Installation',
    'Leak Repair',
    'Fixture Installation',
    'Drain Cleaning',
    'Water Heater Installation',
    'Bathroom Plumbing',
    'Kitchen Plumbing',
    'Emergency Plumbing',
    'Pipe Fitting',
    'Water Pressure Testing'
  ],
  electrical: [
    'Wiring Installation',
    'Circuit Repair',
    'Lighting Installation',
    'Electrical Panel Upgrade',
    'Outlet Installation',
    'Switch Installation',
    'Emergency Electrical',
    'Electrical Safety Inspection',
    'Generator Installation',
    'Smart Home Wiring'
  ],
  carpentry: [
    'Cabinet Installation',
    'Door Installation',
    'Window Installation',
    'Furniture Assembly',
    'Wood Framing',
    'Trim Work',
    'Custom Shelving',
    'Deck Building',
    'Stair Installation',
    'Wood Repair'
  ],
  painting: [
    'Interior Painting',
    'Exterior Painting',
    'Wall Preparation',
    'Color Consultation',
    'Cabinet Painting',
    'Deck Staining',
    'Wallpaper Installation',
    'Texture Application',
    'Mural Painting',
    'Paint Removal'
  ],
  masonry: [
    'Brick Laying',
    'Concrete Work',
    'Stone Installation',
    'Patio Construction',
    'Retaining Wall',
    'Chimney Repair',
    'Foundation Work',
    'Stucco Application',
    'Tile Setting',
    'Masonry Repair'
  ],
  roofing: [
    'Roof Installation',
    'Roof Repair',
    'Gutter Installation',
    'Skylight Installation',
    'Roof Inspection',
    'Shingle Replacement',
    'Metal Roofing',
    'Roof Coating',
    'Roof Ventilation',
    'Emergency Roof Repair'
  ],
  landscaping: [
    'Garden Design',
    'Lawn Maintenance',
    'Tree Planting',
    'Irrigation Installation',
    'Patio Design',
    'Outdoor Lighting',
    'Fence Installation',
    'Garden Maintenance',
    'Landscape Design',
    'Plant Care'
  ],
  other: [
    'General Handyman',
    'Home Maintenance',
    'Appliance Installation',
    'Furniture Assembly',
    'Moving Assistance',
    'Cleaning Services',
    'Home Organization',
    'Window Installation',
    'Door Installation',
    'General Repairs'
  ]
};

const RequirementsStep: React.FC<RequirementsStepProps> = ({ data, onUpdate }) => {
  const { toast } = useToast();
  const [newSkill, setNewSkill] = useState('');
  const [newRequirement, setNewRequirement] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const addSkill = (skill: string) => {
    if (skill.trim() && !data.recommendedSkills.includes(skill.trim())) {
      onUpdate({
        recommendedSkills: [...data.recommendedSkills, skill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    const updatedSkills = data.recommendedSkills.filter((_, i) => i !== index);
    onUpdate({ recommendedSkills: updatedSkills });
  };

  const addSuggestedSkill = (skill: string) => {
    if (!data.recommendedSkills.includes(skill)) {
      onUpdate({
        recommendedSkills: [...data.recommendedSkills, skill]
      });
    }
  };

  // Get suggested skills based on the selected category
  const suggestedSkills = data.category ? CATEGORY_SKILLS[data.category] || CATEGORY_SKILLS.other : CATEGORY_SKILLS.other;

  const handleAddRequirement = () => {
    if (!newRequirement.trim()) return;
    
    const updatedRequirements = [...(data.requirements || []), newRequirement.trim()];
    onUpdate({ requirements: updatedRequirements });
    setNewRequirement('');
  };

  const handleRemoveRequirement = (index: number) => {
    const updatedRequirements = data.requirements?.filter((_, i) => i !== index);
    onUpdate({ requirements: updatedRequirements });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `requirements/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('project-files')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('project-files')
        .getPublicUrl(filePath);

      // Add the file URL as a requirement
      const updatedRequirements = [
        ...(data.requirements || []),
        `[File] ${selectedFile.name}: ${publicUrl}`
      ];
      
      onUpdate({ requirements: updatedRequirements });
      setSelectedFile(null);
      
      toast({
        title: "File Uploaded",
        description: "Requirement document has been uploaded successfully."
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
        <h3 className="text-lg font-semibold mb-4">Project Requirements</h3>
        <p className="text-gray-600 mb-6">
          List all the requirements and specifications for your project. You can add text requirements
          or upload requirement documents.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Text Requirements */}
            <div className="space-y-2">
              <Label>Add Text Requirement</Label>
              <div className="flex gap-2">
                <Input
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  placeholder="Enter a requirement..."
                  onKeyPress={(e) => e.key === 'Enter' && handleAddRequirement()}
                />
                <Button onClick={handleAddRequirement}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                  </Button>
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label>Upload Requirement Document</Label>
              <div className="flex gap-2">
                <Input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.txt"
                />
                <Button
                  onClick={handleFileUpload}
                  disabled={!selectedFile || isUploading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isUploading ? 'Uploading...' : 'Upload'}
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                Supported formats: PDF, DOC, DOCX, TXT
              </p>
            </div>

            {/* Requirements List */}
            {data.requirements && data.requirements.length > 0 && (
              <div className="space-y-2">
                <Label>Current Requirements</Label>
            <div className="space-y-2">
                  {data.requirements.map((req, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        {req.startsWith('[File]') ? (
                          <FileText className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Info className="h-4 w-4 text-gray-600" />
                        )}
                        <span className="text-sm">
                          {req.startsWith('[File]') ? req.split(': ')[0].replace('[File] ', '') : req}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveRequirement(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequirementsStep;
