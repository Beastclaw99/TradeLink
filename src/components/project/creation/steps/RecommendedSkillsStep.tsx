
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ProjectData } from '../types';
import { useToast } from '@/components/ui/use-toast';

interface RecommendedSkillsStepProps {
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

const RecommendedSkillsStep: React.FC<RecommendedSkillsStepProps> = ({ data, onUpdate }) => {
  const { toast } = useToast();
  const [newSkill, setNewSkill] = useState('');

  // Ensure we have a valid skills array - handle both camelCase and snake_case
  const currentSkills = data.recommended_skills || data.recommendedSkills || [];
  
  console.log('RecommendedSkillsStep data:', data);
  console.log('Current skills:', currentSkills);

  const addSkill = (skill: string) => {
    if (skill.trim() && !currentSkills.includes(skill.trim())) {
      onUpdate({
        recommended_skills: [...currentSkills, skill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    const updatedSkills = currentSkills.filter((_, i) => i !== index);
    onUpdate({ recommended_skills: updatedSkills });
  };

  const addSuggestedSkill = (skill: string) => {
    if (!currentSkills.includes(skill)) {
      onUpdate({
        recommended_skills: [...currentSkills, skill]
      });
    }
  };

  // Get suggested skills based on the selected category
  const suggestedSkills = data.category ? CATEGORY_SKILLS[data.category] || CATEGORY_SKILLS.other : CATEGORY_SKILLS.other;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Recommended Skills</h3>
        <p className="text-gray-600 mb-6">
          Select skills that would be beneficial for your project. These skills help professionals understand what expertise would be valuable for your project.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Suggested Skills */}
            <div className="space-y-2">
              <Label>Recommended Skills for {data.category ? data.category.charAt(0).toUpperCase() + data.category.slice(1) : 'Your Project'}</Label>
              <p className="text-sm text-gray-500 mb-2">Click on a skill to add it to your recommendations</p>
              <div className="flex flex-wrap gap-2">
                {suggestedSkills.map((skill) => (
                  <Badge
                    key={skill}
                    variant={currentSkills.includes(skill) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => addSuggestedSkill(skill)}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Custom Skills */}
            <div className="space-y-2">
              <Label>Add Additional Skills</Label>
              <p className="text-sm text-gray-500 mb-2">Add any other skills that would be beneficial for your project</p>
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Enter a skill..."
                  onKeyPress={(e) => e.key === 'Enter' && addSkill(newSkill)}
                />
                <Button onClick={() => addSkill(newSkill)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>

            {/* Selected Skills */}
            {currentSkills.length > 0 && (
              <div className="space-y-2">
                <Label>Your Recommended Skills</Label>
                <p className="text-sm text-gray-500 mb-2">These are the skills you've selected as beneficial for your project</p>
                <div className="flex flex-wrap gap-2">
                  {currentSkills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-destructive transition-colors"
                        onClick={() => removeSkill(index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Info Alert */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Recommended skills help professionals understand what expertise would be valuable for your project. 
                These are not strict requirements but rather guidelines for the ideal candidate.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecommendedSkillsStep;
