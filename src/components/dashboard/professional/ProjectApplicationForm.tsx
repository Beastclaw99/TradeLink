
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
import { DollarSign, Calendar, CheckCircle2, AlertTriangle, Info, Star } from "lucide-react";
import { Project } from '../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

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
  userSkills = []
}) => {
  if (!selectedProject) return null;
  
  const project = projects.find(p => p.id === selectedProject);
  const requiredSkills = Array.isArray(project?.required_skills) ? project.required_skills : [];
  const matchingSkills = userSkills.filter(skill => requiredSkills.includes(skill));
  const missingSkills = requiredSkills.filter(skill => !userSkills.includes(skill));
  const skillMatchPercentage = requiredSkills.length > 0 ? Math.round((matchingSkills.length / requiredSkills.length) * 100) : 100;

  const getBudgetGuidance = () => {
    const clientBudget = project?.budget;
    if (!clientBudget || typeof clientBudget !== 'number') return null;
    
    return {
      competitive: Math.round(clientBudget * 0.8),
      market: clientBudget,
      premium: Math.round(clientBudget * 1.2)
    };
  };

  const budgetGuidance = getBudgetGuidance();

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Apply to Project
        </CardTitle>
        <CardDescription>
          Submit a compelling proposal to win this project. Take time to craft a thoughtful application.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Skills Matching Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">Skills Match</h3>
            <Badge 
              variant={skillMatchPercentage >= 80 ? "default" : skillMatchPercentage >= 50 ? "secondary" : "outline"}
              className={skillMatchPercentage >= 80 ? "bg-green-100 text-green-800" : skillMatchPercentage >= 50 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}
            >
              {skillMatchPercentage}% Match
            </Badge>
          </div>
          
          {matchingSkills.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-green-700 font-medium">✓ Your matching skills:</p>
              <div className="flex flex-wrap gap-2">
                {matchingSkills.map(skill => (
                  <Badge key={skill} variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {missingSkills.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-amber-700 font-medium">⚠ Skills to highlight in your proposal:</p>
              <div className="flex flex-wrap gap-2">
                {missingSkills.map(skill => (
                  <Badge key={skill} variant="outline" className="border-amber-200 text-amber-700">
                    {skill}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-amber-600">
                Explain how your experience relates to these skills in your proposal.
              </p>
            </div>
          )}

          {skillMatchPercentage < 50 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Your skill match is below 50%. Consider explaining how your related experience applies to this project.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <Separator />

        {/* Availability Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Your Availability *
          </label>
          <Select value={availability} onValueChange={setAvailability}>
            <SelectTrigger>
              <SelectValue placeholder="When can you start this project?" />
            </SelectTrigger>
            <SelectContent>
              {AVAILABILITY_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex flex-col">
                    <span className="font-medium">{option.label}</span>
                    <span className="text-xs text-gray-500">{option.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Enhanced Bid Amount Section */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Your Bid Amount (TTD) *
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input 
              type="number"
              placeholder="Enter your competitive bid"
              className="pl-10"
              value={bidAmount === null ? '' : bidAmount}
              onChange={(e) => setBidAmount(e.target.value ? Number(e.target.value) : null)}
            />
          </div>
          
          {budgetGuidance && (
            <div className="bg-blue-50 p-3 rounded-lg space-y-2">
              <p className="text-sm font-medium text-blue-900">Client's Budget: ${project?.budget || 'N/A'}</p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="font-medium text-green-700">${budgetGuidance.competitive}</div>
                  <div className="text-green-600">Competitive</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-blue-700">${budgetGuidance.market}</div>
                  <div className="text-blue-600">Market Rate</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-purple-700">${budgetGuidance.premium}</div>
                  <div className="text-purple-600">Premium</div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Enhanced Proposal Section */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Proposal Message *
          </label>
          <Textarea 
            placeholder="Write a compelling proposal that shows why you're the best fit for this project..."
            className="min-h-[150px]"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
          />
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">💡 Tips for a winning proposal:</p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Explain your relevant experience with similar projects</li>
              <li>• Address how you'll handle the specific requirements</li>
              <li>• Mention your approach and timeline</li>
              <li>• Include any questions about the project</li>
              {missingSkills.length > 0 && (
                <li className="text-amber-600">• Explain how your experience relates to: {missingSkills.join(', ')}</li>
              )}
            </ul>
          </div>
          <div className="text-xs text-gray-500">
            {coverLetter.length}/500 characters (aim for at least 200 for a competitive proposal)
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center bg-gray-50">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={handleApplyToProject}
          disabled={isApplying || !coverLetter.trim() || !bidAmount || !availability}
          size="lg"
          className="px-8"
        >
          {isApplying ? 'Submitting...' : '🚀 Submit Application'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectApplicationForm;
