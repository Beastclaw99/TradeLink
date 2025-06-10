
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  Clock, 
  MapPin, 
  User, 
  FileText,
  X
} from "lucide-react";
import { Project } from '../types';

interface ProjectApplicationFormProps {
  selectedProject: string | null;
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

  const projectSkills = project.required_skills ? JSON.parse(project.required_skills as string) as string[] : [];
  const matchingSkills = projectSkills.filter(skill => userSkills.includes(skill));

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Apply to Project: {project.title}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Project Details */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span>Budget: ${project.budget || 'Not specified'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span>Timeline: {project.expected_timeline || 'Not specified'}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-red-600" />
              <span>Location: {project.location || 'Not specified'}</span>
            </div>
          </div>
          
          {projectSkills.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Required Skills:</span>
                <span className="text-sm text-green-600 font-medium">
                  {matchingSkills.length}/{projectSkills.length} matching
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {projectSkills.map((skill) => (
                  <Badge
                    key={skill}
                    variant={userSkills.includes(skill) ? "default" : "secondary"}
                  >
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
            <Label htmlFor="bidAmount">Your Bid Amount ($)</Label>
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
            <Label htmlFor="availability">Availability</Label>
            <Select value={availability} onValueChange={setAvailability}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select your availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediately">Available Immediately</SelectItem>
                <SelectItem value="within_week">Within 1 Week</SelectItem>
                <SelectItem value="within_month">Within 1 Month</SelectItem>
                <SelectItem value="flexible">Flexible</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="coverLetter">Cover Letter / Proposal</Label>
            <Textarea
              id="coverLetter"
              placeholder="Tell the client why you're the right person for this project..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={6}
              className="mt-1"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center gap-3 pt-4">
          <Button 
            onClick={handleApplyToProject}
            disabled={isApplying || !coverLetter.trim() || !bidAmount}
            className="flex-1"
          >
            <User className="h-4 w-4 mr-2" />
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
