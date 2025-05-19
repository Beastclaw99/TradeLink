
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { FileText, Edit, Trash, Plus } from "lucide-react";
import { Project } from '../types';

interface ProjectsTabProps {
  isLoading: boolean;
  projects: Project[];
  applications: any[];
  editProject: Project | null;
  projectToDelete: string | null;
  editedProject: {
    title: string;
    description: string;
    budget: string;
  };
  isSubmitting: boolean;
  setEditedProject: (project: { title: string; description: string; budget: string }) => void;
  handleEditInitiate: (project: Project) => void;
  handleEditCancel: () => void;
  handleUpdateProject: (project: Project) => void;
  handleDeleteInitiate: (projectId: string) => void;
  handleDeleteCancel: () => void;
  handleDeleteProject: (projectId: string) => void;
}

const ProjectsTab: React.FC<ProjectsTabProps> = ({ 
  isLoading, 
  projects, 
  applications, 
  editProject, 
  projectToDelete,
  editedProject,
  isSubmitting,
  setEditedProject,
  handleEditInitiate,
  handleEditCancel,
  handleUpdateProject,
  handleDeleteInitiate,
  handleDeleteCancel,
  handleDeleteProject
}) => {
  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Your Open Projects</h2>
      {isLoading ? (
        <p>Loading your projects...</p>
      ) : projects.filter(p => p.status === 'open').length === 0 ? (
        <div className="text-center py-8">
          <FileText className="w-12 h-12 mx-auto text-ttc-neutral-400" />
          <p className="mt-4 text-ttc-neutral-600">You don't have any open projects.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => {
              const createTab = document.querySelector('[data-value="create"]');
              if (createTab) {
                (createTab as HTMLElement).click();
              }
            }}
          >
            <Plus className="w-4 h-4 mr-2" /> Post New Project
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {projects.filter(p => p.status === 'open').map(project => (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="mr-2">{project.title}</CardTitle>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8" 
                      onClick={() => handleEditInitiate(project)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-red-500" 
                      onClick={() => handleDeleteInitiate(project.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription className="flex items-center justify-between">
                  <span>Posted on {new Date(project.created_at || '').toLocaleDateString()}</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    Open
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-ttc-neutral-600 mb-4">{project.description}</p>
                <p className="font-medium">Budget: ${project.budget}</p>
                
                <div className="mt-4">
                  <p className="text-sm font-medium">
                    {applications.filter(app => app.project_id === project.id).length} applications
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <h2 className="text-2xl font-bold mb-4 mt-8">Assigned Projects</h2>
      {projects.filter(p => p.status === 'assigned').length === 0 ? (
        <div className="text-center py-8">
          <p className="text-ttc-neutral-600">You don't have any assigned projects.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {projects.filter(p => p.status === 'assigned').map(project => {
            // Find the accepted application for this project
            const acceptedApp = applications.find(app => 
              app.project_id === project.id && app.status === 'accepted'
            );
            
            return (
              <Card key={project.id}>
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                  <CardDescription className="flex items-center justify-between">
                    <span>Posted on {new Date(project.created_at || '').toLocaleDateString()}</span>
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      In Progress
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-ttc-neutral-600 mb-4">{project.description}</p>
                  <p className="font-medium">Budget: ${project.budget}</p>
                  
                  {acceptedApp && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-md">
                      <p className="font-medium">Assigned to:</p>
                      <p>{acceptedApp.professional?.first_name} {acceptedApp.professional?.last_name}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      
      {/* Edit Project Dialog */}
      {editProject && (
        <Card className="mt-6 border-blue-200">
          <CardHeader className="bg-blue-50">
            <CardTitle>Edit Project</CardTitle>
            <CardDescription>Make changes to your project details</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Project Title</Label>
                <Input 
                  id="edit-title" 
                  value={editedProject.title}
                  onChange={e => setEditedProject({...editedProject, title: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea 
                  id="edit-description" 
                  className="min-h-[120px]"
                  value={editedProject.description}
                  onChange={e => setEditedProject({...editedProject, description: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-budget">Budget ($)</Label>
                <Input 
                  id="edit-budget" 
                  type="number" 
                  value={editedProject.budget}
                  onChange={e => setEditedProject({...editedProject, budget: e.target.value})}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handleEditCancel}
            >
              Cancel
            </Button>
            <Button 
              className="bg-ttc-blue-700 hover:bg-ttc-blue-800"
              onClick={() => handleUpdateProject(editProject)}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Project"}
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {/* Delete Project Confirmation Dialog */}
      {projectToDelete && (
        <AlertDialog open={!!projectToDelete} onOpenChange={() => handleDeleteCancel()}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this project?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button variant="outline" onClick={() => handleDeleteCancel()}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => handleDeleteProject(projectToDelete)}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Deleting..." : "Delete Project"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};

export default ProjectsTab;
