
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Plus, Lightbulb } from 'lucide-react';
import { ProjectData } from '@/types/project';

interface RecommendedSkillsStepProps {
  data: ProjectData;
  onUpdate: (data: Partial<ProjectData>) => void;
}

const RecommendedSkillsStep: React.FC<RecommendedSkillsStepProps> = ({ data, onUpdate }) => {
  const [newSkill, setNewSkill] = useState('');
  
  // Safely handle recommended_skills that might be null/undefined
  const currentSkills = data?.recommended_skills || [];

  const predefinedSkills = [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'PHP', 'C#',
    'HTML/CSS', 'Vue.js', 'Angular', 'MySQL', 'PostgreSQL', 'MongoDB', 'AWS',
    'Docker', 'Kubernetes', 'Git', 'REST API', 'GraphQL', 'Mobile Development',
    'UI/UX Design', 'Photoshop', 'Figma', 'Project Management', 'SEO', 'Digital Marketing',
    'Content Writing', 'Data Analysis', 'Machine Learning', 'DevOps'
  ];

  const handleAddSkill = (skill: string) => {
    if (skill.trim() && !currentSkills.includes(skill.trim())) {
      const updatedSkills = [...currentSkills, skill.trim()];
      onUpdate({ recommended_skills: updatedSkills });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updatedSkills = currentSkills.filter(skill => skill !== skillToRemove);
    onUpdate({ recommended_skills: updatedSkills });
  };

  const handleAddCustomSkill = () => {
    if (newSkill.trim()) {
      handleAddSkill(newSkill);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomSkill();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Recommended Skills</h3>
        <p className="text-gray-600 mb-6">
          Select the skills that would be most valuable for professionals working on this project. 
          This helps match you with the right talent.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Skills for Your Project
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current selected skills */}
          {currentSkills.length > 0 && (
            <div>
              <Label className="text-sm font-medium">Selected Skills</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {currentSkills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleRemoveSkill(skill)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Add custom skill */}
          <div>
            <Label htmlFor="custom-skill">Add Custom Skill</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="custom-skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter a skill..."
                className="flex-1"
              />
              <Button 
                onClick={handleAddCustomSkill}
                disabled={!newSkill.trim()}
                size="sm"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Predefined skills */}
          <div>
            <Label className="text-sm font-medium">Suggested Skills</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {predefinedSkills
                .filter(skill => !currentSkills.includes(skill))
                .map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => handleAddSkill(skill)}
                  >
                    {skill}
                    <Plus className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
            </div>
          </div>

          {currentSkills.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Lightbulb className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No skills selected yet</p>
              <p className="text-sm">Choose from suggested skills or add your own</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RecommendedSkillsStep;
