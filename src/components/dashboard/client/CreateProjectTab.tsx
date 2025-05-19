
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface CreateProjectTabProps {
  newProject: {
    title: string;
    description: string;
    budget: string;
  };
  setNewProject: (project: { title: string; description: string; budget: string }) => void;
  handleCreateProject: (e: React.FormEvent) => Promise<void>;
  isSubmitting: boolean;
}

const CreateProjectTab: React.FC<CreateProjectTabProps> = ({ 
  newProject, 
  setNewProject, 
  handleCreateProject, 
  isSubmitting 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a New Project</CardTitle>
        <CardDescription>
          Fill in the details below to post a new project for professionals.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleCreateProject}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input 
              id="title" 
              placeholder="e.g., Kitchen Renovation" 
              value={newProject.title}
              onChange={(e) => setNewProject({...newProject, title: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Project Description</Label>
            <Textarea 
              id="description" 
              placeholder="Describe your project in detail..." 
              className="min-h-[120px]"
              value={newProject.description}
              onChange={(e) => setNewProject({...newProject, description: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="budget">Budget ($)</Label>
            <Input 
              id="budget" 
              type="number" 
              placeholder="e.g., 5000" 
              value={newProject.budget}
              onChange={(e) => setNewProject({...newProject, budget: e.target.value})}
            />
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-ttc-blue-700 hover:bg-ttc-blue-800"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Project"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CreateProjectTab;
