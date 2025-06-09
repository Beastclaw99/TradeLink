import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ProjectData } from '../types';

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
  const [newSkill, setNewSkill] = useState('');

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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Recommended Skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Add skills that would be helpful for professionals working on your project. 
              This helps match you with the right professionals. Don't worry if you're not sure - 
              professionals can suggest additional skills when they apply.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div>
              <Label>Quick Add - {data.category ? `${data.category.charAt(0).toUpperCase() + data.category.slice(1)} Skills` : 'Common Skills'}</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {suggestedSkills.map((skill) => (
                  <Button
                    key={skill}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addSuggestedSkill(skill)}
                    disabled={data.recommendedSkills.includes(skill)}
                    className="text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {skill}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="custom-skill">Add Custom Skill</Label>
              <div className="flex gap-2">
                <Input
                  id="custom-skill"
                  placeholder="e.g., Pool cleaning, Smart home setup"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill(newSkill);
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => addSkill(newSkill)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Selected Skills ({data.recommendedSkills.length})</Label>
              <div className="flex flex-wrap gap-2 mt-2 min-h-[2rem] p-2 border rounded-md bg-gray-50">
                {data.recommendedSkills.length === 0 ? (
                  <span className="text-gray-500 text-sm">No skills selected yet</span>
                ) : (
                  data.recommendedSkills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequirementsStep;
