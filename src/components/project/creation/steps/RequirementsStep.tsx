
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { ProjectData } from '@/types';

interface RequirementsStepProps {
  data: ProjectData;
  onUpdate: (data: Partial<ProjectData>) => void;
}

const SUGGESTED_SKILLS = [
  'Plumbing', 'Electrical', 'Carpentry', 'Painting', 'Drywall',
  'Flooring', 'Roofing', 'HVAC', 'Landscaping', 'Masonry',
  'Tile Work', 'Kitchen Renovation', 'Bathroom Renovation'
];

const RequirementsStep: React.FC<RequirementsStepProps> = ({ data, onUpdate }) => {
  const [newRequirement, setNewRequirement] = useState('');
  const [newSkill, setNewSkill] = useState('');

  const addRequirement = () => {
    if (newRequirement.trim()) {
      const updatedRequirements = [...(data.requirements || []), newRequirement.trim()];
      onUpdate({ requirements: updatedRequirements });
      setNewRequirement('');
    }
  };

  const removeRequirement = (index: number) => {
    const updatedRequirements = (data.requirements || []).filter((_: string, i: number) => i !== index);
    onUpdate({ requirements: updatedRequirements });
  };

  const addSkill = (skill: string) => {
    if (!data.recommended_skills.includes(skill)) {
      const updatedSkills = [...data.recommended_skills, skill];
      onUpdate({ recommended_skills: updatedSkills });
    }
    setNewSkill('');
  };

  const removeSkill = (skillToRemove: string) => {
    const updatedSkills = data.recommended_skills.filter(skill => skill !== skillToRemove);
    onUpdate({ recommended_skills: updatedSkills });
  };

  const addCustomSkill = () => {
    if (newSkill.trim()) {
      addSkill(newSkill.trim());
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Project Requirements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Specific Requirements</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a requirement"
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addRequirement()}
              />
              <Button type="button" onClick={addRequirement} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {(data.requirements || []).map((req: string, index: number) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {req}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeRequirement(index)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Required Skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Add Custom Skill</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter a skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCustomSkill()}
              />
              <Button type="button" onClick={addCustomSkill} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Suggested Skills</Label>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_SKILLS.map((skill: string) => (
                <Badge
                  key={skill}
                  variant={data.recommended_skills.includes(skill) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => 
                    data.recommended_skills.includes(skill) 
                      ? removeSkill(skill) 
                      : addSkill(skill)
                  }
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Selected Skills</Label>
            <div className="flex flex-wrap gap-2">
              {data.recommended_skills.map((skill: string, index: number) => (
                <Badge key={index} variant="default" className="flex items-center gap-1">
                  {skill}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeSkill(skill)}
                  />
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
