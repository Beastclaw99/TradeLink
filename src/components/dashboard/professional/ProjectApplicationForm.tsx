
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MapPin, DollarSign, Calendar, X } from 'lucide-react';
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
  userSkills = []
}) => {
  const project = projects.find(p => p.id === selectedProject);
  
  if (!project) return null;

  const projectTimeline = project.expected_timeline || project.timeline || 'Not specified';
  const matchingSkills = userSkills.filter(skill => 
    project.recommended_skills?.includes(skill)
  );

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Apply to Project</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Project Overview */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
          <p className="text-gray-600 mb-3">{project.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span>Budget: ${project.budget?.toLocaleString() || 'Not specified'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span>Timeline: {projectTimeline}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-red-600" />
              <span>Location: {project.location || 'Not specified'}</span>
            </div>
          </div>

          {matchingSkills.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-medium text-green-700 mb-2">
                Your matching skills:
              </p>
              <div className="flex flex-wrap gap-1">
                {matchingSkills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Application Form */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="coverLetter">Cover Letter *</Label>
            <Textarea
              id="coverLetter"
              placeholder="Tell the client why you're the perfect fit for this project..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={4}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="bidAmount">Your Bid Amount (TTD) *</Label>
            <Input
              id="bidAmount"
              type="number"
              placeholder="Enter your bid amount"
              value={bidAmount || ''}
              onChange={(e) => setBidAmount(e.target.value ? Number(e.target.value) : null)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="availability">Availability *</Label>
            <Select value={availability} onValueChange={setAvailability}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="When can you start?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediately">Immediately</SelectItem>
                <SelectItem value="within_week">Within a week</SelectItem>
                <SelectItem value="within_month">Within a month</SelectItem>
                <SelectItem value="flexible">Flexible</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button 
            onClick={handleApplyToProject}
            disabled={isApplying || !coverLetter.trim() || !bidAmount || !availability}
            className="flex-1"
          >
            {isApplying ? 'Submitting...' : 'Submit Application'}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectApplicationForm;
