import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProjectData } from '../types';

// Skill recommendations based on category
const skillRecommendations: Record<string, string[]> = {
  'home-improvement': [
    'Carpentry',
    'Plumbing',
    'Electrical',
    'Painting',
    'General Contracting'
  ],
  'cleaning': [
    'House Cleaning',
    'Deep Cleaning',
    'Window Cleaning',
    'Carpet Cleaning',
    'Post-Construction Cleaning'
  ],
  'landscaping': [
    'Lawn Maintenance',
    'Garden Design',
    'Tree Services',
    'Irrigation',
    'Outdoor Lighting'
  ],
  // Add more categories as needed
};

interface RequirementsStepProps {
  data: ProjectData;
  onUpdate: (data: Partial<ProjectData>) => void;
}

const RequirementsStep: React.FC<RequirementsStepProps> = ({ data, onUpdate }) => {
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (newSkill.trim()) {
      onUpdate({
        recommended_skills: [...data.recommended_skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    const updatedSkills = data.recommended_skills.filter((_, i) => i !== index);
    onUpdate({ recommended_skills: updatedSkills });
  };

  const addRecommendedSkill = (skill: string) => {
    if (!data.recommended_skills.includes(skill)) {
      onUpdate({
        recommended_skills: [...data.recommended_skills, skill]
      });
    }
  };

  const recommendedSkills = data.category ? skillRecommendations[data.category] || [] : [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Recommended Skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {data.category && (
            <div className="space-y-2">
              <Label>Recommended Skills for {data.category}</Label>
              <p className="text-sm text-muted-foreground">
                Click on a skill to add it to your project requirements
              </p>
              <div className="flex flex-wrap gap-2">
                {recommendedSkills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary/10"
                    onClick={() => addRecommendedSkill(skill)}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="skills">Custom Skills</Label>
            <p className="text-sm text-muted-foreground">
              Add any additional skills that are not listed above
            </p>
            <div className="flex gap-2">
              <Input
                id="skills"
                placeholder="Add a custom skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={addSkill}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {data.recommended_skills.map((skill, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequirementsStep;
