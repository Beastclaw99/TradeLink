
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { DollarSign, FileText, Clock, User } from 'lucide-react';
import { Project } from '../types';

interface ProjectApplicationFormProps {
  selectedProject: string;
  projects: Project[];
  coverLetter: string;
  setCoverLetter: (value: string) => void;
  bidAmount: number | null;
  setBidAmount: (value: number | null) => void;
  availability: string;
  setAvailability: (value: string) => void;
  isApplying: boolean;
  handleApplyToProject: () => Promise<void>;
  onCancel: () => void;
  userSkills?: string[];
}

const ProjectApplicationForm: React.FC<ProjectApplicationFormProps> = ({
  selectedProject,
  projects,
  coverLetter,
  setCoverLetter,
  bidAmount,
  setBidAmount,
  availability,
  setAvailability,
  isApplying,
  handleApplyToProject,
  onCancel,
  userSkills
}) => {
  const project = projects.find(p => p.id === selectedProject);

  if (!project) {
    return null;
  }

  const getMatchingSkills = () => {
    if (!project.recommended_skills || !userSkills) return [];
    
    let projectSkills: string[] = [];
    try {
      projectSkills = Array.isArray(project.recommended_skills) 
        ? project.recommended_skills 
        : JSON.parse(project.recommended_skills as any);
    } catch {
      projectSkills = [];
    }
    
    return projectSkills.filter(skill => 
      userSkills.some(userSkill => 
        userSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    );
  };

  const matchingSkills = getMatchingSkills();

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Apply to: {project.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Project Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Project Details</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {project.budget && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-400" />
                <span>Budget: ${project.budget.toLocaleString()}</span>
              </div>
            )}
            {project.timeline && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span>Timeline: {project.timeline}</span>
              </div>
            )}
          </div>
          {project.description && (
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{project.description}</p>
          )}
        </div>

        {/* Skill Match */}
        {matchingSkills.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Your Matching Skills</h4>
            <div className="flex flex-wrap gap-2">
              {matchingSkills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Application Form */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="bidAmount">Your Bid Amount ($)</Label>
            <Input
              id="bidAmount"
              type="number"
              placeholder="Enter your bid amount"
              value={bidAmount || ''}
              onChange={(e) => setBidAmount(e.target.value ? Number(e.target.value) : null)}
              className="mt-1"
            />
            {project.budget && bidAmount && (
              <p className="text-sm text-gray-500 mt-1">
                {bidAmount <= project.budget 
                  ? `✓ Within budget (${Math.round((bidAmount / project.budget) * 100)}% of budget)`
                  : `⚠ Above budget (+${Math.round(((bidAmount - project.budget) / project.budget) * 100)}%)`
                }
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="availability">Your Availability</Label>
            <Select value={availability} onValueChange={setAvailability}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select your availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Available immediately</SelectItem>
                <SelectItem value="within_week">Within a week</SelectItem>
                <SelectItem value="within_two_weeks">Within 2 weeks</SelectItem>
                <SelectItem value="within_month">Within a month</SelectItem>
                <SelectItem value="flexible">Flexible schedule</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="coverLetter">Cover Letter</Label>
            <Textarea
              id="coverLetter"
              placeholder="Explain why you're the right fit for this project..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="mt-1 min-h-[120px]"
            />
            <p className="text-sm text-gray-500 mt-1">
              {coverLetter.length}/1000 characters
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isApplying}
          >
            Cancel
          </Button>
          <Button
            onClick={handleApplyToProject}
            disabled={isApplying || !bidAmount || !coverLetter.trim() || !availability}
            className="flex-1"
          >
            {isApplying ? 'Submitting...' : 'Submit Application'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectApplicationForm;
