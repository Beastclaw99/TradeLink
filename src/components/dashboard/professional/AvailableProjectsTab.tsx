
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { DollarSign, Briefcase } from "lucide-react";
import { Project, Application } from '../types';

interface AvailableProjectsTabProps {
  isLoading: boolean;
  projects: Project[];
  applications: Application[];
  skills: string[];
  selectedProject: string | null;
  setSelectedProject: (id: string | null) => void;
  coverLetter: string;
  setCoverLetter: (letter: string) => void;
  bidAmount: number | null;
  setBidAmount: (amount: number | null) => void;
  isApplying: boolean;
  handleApplyToProject: () => Promise<void>;
}

const AvailableProjectsTab: React.FC<AvailableProjectsTabProps> = ({
  isLoading,
  projects,
  applications,
  skills,
  selectedProject,
  setSelectedProject,
  coverLetter,
  setCoverLetter,
  bidAmount,
  setBidAmount,
  isApplying,
  handleApplyToProject
}) => {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Available Projects</h2>
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span 
                key={index} 
                className="px-2 py-1 bg-ttc-blue-50 text-ttc-blue-700 text-xs rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>
      
      {isLoading ? (
        <p>Loading projects...</p>
      ) : projects.filter(p => p.status === 'open').length === 0 ? (
        <div className="text-center py-8">
          <Briefcase className="w-12 h-12 mx-auto text-ttc-neutral-400" />
          <p className="mt-4 text-ttc-neutral-600">No matching projects available at the moment.</p>
          {skills.length === 0 && (
            <p className="mt-2 text-sm text-ttc-neutral-500">
              Add skills to your profile to see matching projects.
            </p>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {projects.filter(p => p.status === 'open').map(project => {
            // Check if user has already applied to this project
            const hasApplied = applications.some(app => 
              app.project_id === project.id && 
              app.status !== 'withdrawn'
            );
            
            return (
              <Card key={project.id}>
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                  <CardDescription className="flex items-center justify-between">
                    <span>Posted on {new Date(project.created_at || '').toLocaleDateString()}</span>
                    <span>by {project.client?.first_name} {project.client?.last_name}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-ttc-neutral-600 mb-4">{project.description}</p>
                  <p className="font-medium">Budget: ${project.budget}</p>
                </CardContent>
                <CardFooter>
                  {hasApplied ? (
                    <Button variant="outline" disabled className="w-full">
                      Already Applied
                    </Button>
                  ) : (
                    <Button 
                      className="w-full bg-ttc-blue-700 hover:bg-ttc-blue-800"
                      onClick={() => {
                        setSelectedProject(project.id);
                        if (project.budget) {
                          setBidAmount(project.budget);
                        }
                      }}
                    >
                      Apply for this Project
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
      
      {selectedProject && (
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
                Client's budget: ${projects.find(p => p.id === selectedProject)?.budget || 'N/A'}
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
              onClick={() => {
                setSelectedProject(null);
                setCoverLetter('');
                setBidAmount(null);
              }}
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
      )}
    </>
  );
};

export default AvailableProjectsTab;
