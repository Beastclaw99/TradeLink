
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';

interface RequirementsStepProps {
  data: any;
  onUpdate: (data: any) => void;
}

const RequirementsStep: React.FC<RequirementsStepProps> = ({ data, onUpdate }) => {
  const [newRequirement, setNewRequirement] = useState('');
  const [newSkill, setNewSkill] = useState('');

  const addRequirement = () => {
    if (newRequirement.trim()) {
      onUpdate({ requirements: [...(data.requirements || []), newRequirement.trim()] });
      setNewRequirement('');
    }
  };

  const removeRequirement = (index: number) => {
    const updated = data.requirements.filter((_: any, i: number) => i !== index);
    onUpdate({ requirements: updated });
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      onUpdate({ skills: [...(data.skills || []), newSkill.trim()] });
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    const updated = data.skills.filter((_: any, i: number) => i !== index);
    onUpdate({ skills: updated });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium">Project Requirements</Label>
          <p className="text-sm text-gray-600 mb-3">
            List specific requirements for this project
          </p>
        </div>
        
        <div className="flex gap-2">
          <Input
            value={newRequirement}
            onChange={(e) => setNewRequirement(e.target.value)}
            placeholder="e.g., Must have own tools"
            onKeyPress={(e) => e.key === 'Enter' && addRequirement()}
          />
          <Button onClick={addRequirement} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
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

      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium">Required Skills</Label>
          <p className="text-sm text-gray-600 mb-3">
            Specify skills needed for this project
          </p>
        </div>
        
        <div className="flex gap-2">
          <Input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="e.g., Pipe installation"
            onKeyPress={(e) => e.key === 'Enter' && addSkill()}
          />
          <Button onClick={addSkill} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {(data.skills || []).map((skill: string, index: number) => (
            <Badge key={index} variant="outline" className="flex items-center gap-1">
              {skill}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => removeSkill(index)}
              />
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RequirementsStep;
