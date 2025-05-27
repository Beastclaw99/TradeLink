import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { DollarSign, Calendar, CheckCircle2 } from "lucide-react";
import { Project } from '../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

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

const AVAILABILITY_OPTIONS = [
  { value: 'immediate', label: 'Immediate' },
  { value: 'within_week', label: 'Within a Week' },
  { value: 'within_two_weeks', label: 'Within Two Weeks' },
  { value: 'within_month', label: 'Within a Month' },
  { value: 'flexible', label: 'Flexible' }
];

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
  if (!selectedProject) return null;
  
  const project = projects.find(p => p.id === selectedProject);
  const requiredSkills = Array.isArray(project?.required_skills) ? project.required_skills : [];
  const matchingSkills = userSkills.filter(skill => requiredSkills.includes(skill));
  const missingSkills = requiredSkills.filter(skill => !userSkills.includes(skill));
  
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Apply to Project</CardTitle>
        <CardDescription>
          Submit your proposal and bid amount for this project.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Skills Verification */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Required Skills</h3>
          <div className="space-y-2">
            {matchingSkills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {matchingSkills.map(skill => (
                  <Badge key={skill} variant="secondary" className="bg-green-100 text-green-800">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    {skill}
                  </Badge>
                ))}
              </div>
            )}
            {missingSkills.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-amber-600 mb-2">Missing Skills:</p>
                <div className="flex flex-wrap gap-2">
                  {missingSkills.map(skill => (
                    <Badge key={skill} variant="outline" className="border-amber-200 text-amber-700">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Availability Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Availability</label>
          <Select value={availability} onValueChange={setAvailability}>
            <SelectTrigger>
              <SelectValue placeholder="Select your availability" />
            </SelectTrigger>
            <SelectContent>
              {AVAILABILITY_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Bid Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Bid Amount ($)</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input 
              type="number"
              placeholder="Enter your bid amount"
              className="pl-10"
              value={bidAmount === null ? '' : bidAmount}
              onChange={(e) => setBidAmount(e.target.value ? Number(e.target.value) : null)}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Client's budget: ${project?.budget || 'N/A'}
          </p>
        </div>
        
        {/* Proposal Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Proposal Message</label>
          <Textarea 
            placeholder="Describe your experience, skills, and why you're interested in this project..."
            className="min-h-[150px]"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
          />
          <div className="text-xs text-gray-500 mt-1 space-y-1">
            <p>Include in your proposal:</p>
            <ul className="list-disc list-inside">
              <li>Your relevant experience with similar projects</li>
              <li>Why you're interested in this specific project</li>
              <li>Your approach to completing the work</li>
              <li>Any questions you have about the project</li>
            </ul>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end gap-3">
        <Button 
          variant="outline" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          className="bg-ttc-blue-700 hover:bg-ttc-blue-800"
          onClick={handleApplyToProject}
          disabled={isApplying || !availability || !bidAmount || !coverLetter.trim()}
        >
          {isApplying ? "Submitting..." : "Submit Application"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectApplicationForm;
