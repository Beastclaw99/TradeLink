
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Project } from '../types';
import { DollarSign, MapPin, Calendar, Briefcase, Star } from "lucide-react";

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
  userSkills: string[];
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
  
  if (!project) return null;

  // Get project skills safely
  const projectSkills = Array.isArray(project.required_skills) ? project.required_skills : [];

  // Calculate skill match
  const matchingSkills = projectSkills.filter(skill => 
    userSkills.some(userSkill => 
      userSkill.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(userSkill.toLowerCase())
    )
  );

  const skillMatchPercentage = projectSkills.length > 0 
    ? Math.round((matchingSkills.length / projectSkills.length) * 100) 
    : 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Apply to Project
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Project Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
            <p className="text-gray-700 mb-3">{project.description}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span>${project.budget?.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-600" />
                <span>{project.location || 'Remote'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>{project.expected_timeline || 'Flexible'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-600" />
                <span>{skillMatchPercentage}% Match</span>
              </div>
            </div>

            {/* Skills Section */}
            {projectSkills.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-sm mb-2">Required Skills:</h4>
                <div className="flex flex-wrap gap-2">
                  {projectSkills.map((skill, index) => {
                    const isMatching = matchingSkills.includes(skill);
                    return (
                      <Badge 
                        key={index} 
                        variant={isMatching ? "default" : "outline"}
                        className={isMatching ? "bg-green-100 text-green-800" : ""}
                      >
                        {skill}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Application Form */}
          <div className="grid gap-4">
            <div>
              <Label htmlFor="bidAmount">Your Bid Amount ($)</Label>
              <Input
                id="bidAmount"
                type="number"
                placeholder="Enter your bid amount"
                value={bidAmount || ''}
                onChange={(e) => setBidAmount(e.target.value ? Number(e.target.value) : null)}
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <Label htmlFor="availability">Your Availability</Label>
              <Input
                id="availability"
                placeholder="e.g., Available immediately, 2 weeks notice, etc."
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="coverLetter">Proposal Message</Label>
              <Textarea
                id="coverLetter"
                placeholder="Explain why you're the right fit for this project. Highlight relevant experience and how you plan to approach the work..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={6}
                className="resize-none"
              />
              <p className="text-sm text-gray-500 mt-1">
                {coverLetter.length}/500 characters (minimum 100 recommended)
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isApplying}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleApplyToProject}
              disabled={isApplying || !coverLetter.trim() || bidAmount === null}
              className="flex-1"
            >
              {isApplying ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectApplicationForm;
