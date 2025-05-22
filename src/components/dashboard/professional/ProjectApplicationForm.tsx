
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
import { DollarSign } from "lucide-react";
import { Project } from '../types';

interface ProjectApplicationFormProps {
  selectedProject: string | null;
  projects: Project[];
  coverLetter: string;
  setCoverLetter: (value: string) => void;
  bidAmount: number | null;
  setBidAmount: (value: number | null) => void;
  isApplying: boolean;
  handleApplyToProject: () => Promise<void>;
  onCancel: () => void;
}

const ProjectApplicationForm: React.FC<ProjectApplicationFormProps> = ({
  selectedProject,
  projects,
  coverLetter,
  setCoverLetter,
  bidAmount,
  setBidAmount,
  isApplying,
  handleApplyToProject,
  onCancel
}) => {
  if (!selectedProject) return null;
  
  const project = projects.find(p => p.id === selectedProject);
  
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Apply to Project</CardTitle>
        <CardDescription>
          Submit your proposal and bid amount for this project.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Bid Amount ($)</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input 
              type="number"
              placeholder="Enter your bid amount"
              className="pl-10"
              value={bidAmount || ''}
              onChange={(e) => setBidAmount(e.target.value ? Number(e.target.value) : null)}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Client's budget: ${project?.budget || 'N/A'}
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Proposal Message</label>
          <Textarea 
            placeholder="Describe your experience, skills, and why you're interested in this project..."
            className="min-h-[150px]"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-1">
            Include details about your relevant experience and why you're the right fit for this project.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          className="bg-ttc-blue-700 hover:bg-ttc-blue-800"
          onClick={handleApplyToProject}
          disabled={isApplying}
        >
          {isApplying ? "Submitting..." : "Submit Application"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectApplicationForm;
