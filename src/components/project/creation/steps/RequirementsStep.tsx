
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

const SUGGESTED_SKILLS = [
  'Plumbing',
  'Electrical Work',
  'Carpentry',
  'Painting',
  'Tiling',
  'Roofing',
  'Landscaping',
  'Masonry',
  'HVAC',
  'Flooring Installation',
  'Kitchen Installation',
  'Bathroom Renovation',
  'Drywall',
  'Insulation',
  'Concrete Work',
  'Fence Installation',
  'Pool Maintenance',
  'Appliance Installation',
  'Home Security',
  'Solar Installation'
];

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
              <Label>Quick Add - Common Skills</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {SUGGESTED_SKILLS.map((skill) => (
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

            <div className="space-y-2">
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
