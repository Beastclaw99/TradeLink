import React, { useState } from 'react';
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
import { DollarSign, Calendar, CheckCircle2, AlertTriangle, Info, Star } from "lucide-react";
import { Project } from '../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

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
  { value: 'immediate', label: 'Immediate', description: 'Can start right away' },
  { value: 'within_week', label: 'Within a Week', description: 'Available to start within 7 days' },
  { value: 'within_two_weeks', label: 'Within Two Weeks', description: 'Available within 14 days' },
  { value: 'within_month', label: 'Within a Month', description: 'Available within 30 days' },
  { value: 'flexible', label: 'Flexible', description: 'Timeline negotiable' }
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
  userSkills
}) => {
  const project = projects.find(p => p.id === selectedProject);
  const [errors, setErrors] = useState<{
    coverLetter?: string;
    bidAmount?: string;
    availability?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!coverLetter.trim()) {
      newErrors.coverLetter = 'Cover letter is required';
    } else if (coverLetter.length < 100) {
      newErrors.coverLetter = 'Cover letter must be at least 100 characters';
    }
    
    if (!bidAmount) {
      newErrors.bidAmount = 'Bid amount is required';
    } else if (bidAmount <= 0) {
      newErrors.bidAmount = 'Bid amount must be greater than 0';
    } else if (project?.budget && bidAmount > project.budget * 1.5) {
      newErrors.bidAmount = 'Bid amount cannot exceed 150% of project budget';
    }
    
    if (!availability.trim()) {
      newErrors.availability = 'Availability is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      handleApplyToProject();
    }
  };

  if (!project) return null;

  const projectSkills = project.recommended_skills ? JSON.parse(project.recommended_skills) as string[] : [];
  const matchingSkills = projectSkills.filter(skill => userSkills?.includes(skill));
  const missingSkills = projectSkills.filter(skill => !userSkills?.includes(skill));

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Apply for Project</CardTitle>
        <CardDescription>
          Submit your application for "{project.title}"
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Skills Match Section */}
          <div>
            <h4 className="text-sm font-medium mb-2">Skills Match</h4>
            <div className="space-y-2">
              {matchingSkills.length > 0 && (
                <div>
                  <p className="text-sm text-green-600">Matching Skills:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {matchingSkills.map((skill, index) => (
                      <Badge key={index} variant="default">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {missingSkills.length > 0 && (
                <div>
                  <p className="text-sm text-amber-600">Missing Skills:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {missingSkills.map((skill, index) => (
                      <Badge key={index} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Cover Letter */}
          <div className="space-y-2">
            <Label htmlFor="coverLetter">Cover Letter</Label>
            <Textarea
              id="coverLetter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Explain why you're the best fit for this project..."
              className={errors.coverLetter ? "border-red-500" : ""}
            />
            {errors.coverLetter && (
              <p className="text-sm text-red-500">{errors.coverLetter}</p>
            )}
          </div>

          {/* Bid Amount */}
          <div className="space-y-2">
            <Label htmlFor="bidAmount">Bid Amount (USD)</Label>
            <Input
              id="bidAmount"
              type="number"
              value={bidAmount || ''}
              onChange={(e) => setBidAmount(Number(e.target.value))}
              placeholder="Enter your bid amount"
              className={errors.bidAmount ? "border-red-500" : ""}
            />
            {errors.bidAmount && (
              <p className="text-sm text-red-500">{errors.bidAmount}</p>
            )}
            {project.budget && (
              <p className="text-sm text-gray-500">
                Project Budget: ${project.budget.toLocaleString()}
              </p>
            )}
          </div>

          {/* Availability */}
          <div className="space-y-2">
            <Label htmlFor="availability">Availability</Label>
            <Textarea
              id="availability"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              placeholder="Describe your availability for this project..."
              className={errors.availability ? "border-red-500" : ""}
            />
            {errors.availability && (
              <p className="text-sm text-red-500">{errors.availability}</p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isApplying}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isApplying}
        >
          {isApplying ? 'Submitting...' : 'Submit Application'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectApplicationForm;
