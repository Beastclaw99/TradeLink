
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { FileText, Plus, Check, X, Edit, Trash, Star } from "lucide-react";
import { Project, Application, Review } from './types';

interface ClientDashboardProps {
  userId: string;
  initialTab?: string;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ userId, initialTab = 'projects' }) => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [projectToReview, setProjectToReview] = useState<Project | null>(null);
  const [reviewData, setReviewData] = useState({ rating: 0, comment: '' });
  
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    budget: ''
  });
  
  const [editedProject, setEditedProject] = useState({
    title: '',
    description: '',
    budget: ''
  });

  useEffect(() => {
    fetchProjects();
  }, [userId]);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      
      // Fetch projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('client_id', userId)
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;
      setProjects(projectsData || []);
      
      // Fetch applications for all projects
      if (projectsData && projectsData.length > 0) {
        const projectIds = projectsData.map(project => project.id);
        
        const { data: applicationsData, error: applicationsError } = await supabase
          .from('applications')
          .select(`
            *,
            professional:profiles(first_name, last_name)
          `)
          .in('project_id', projectIds);
          
        if (applicationsError) throw applicationsError;
        setApplications(applicationsData || []);
        
        // Fetch reviews for completed projects
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('*')
          .in('project_id', projectIds);
          
        if (reviewsError) throw reviewsError;
        setReviews(reviewsData || []);
      }
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load your projects. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newProject.title || !newProject.description || !newProject.budget) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const { data, error } = await supabase
        .from('projects')
        .insert({
          title: newProject.title,
          description: newProject.description,
          budget: parseFloat(newProject.budget),
          status: 'open',
          client_id: userId
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Project Created",
        description: "Your new project has been posted successfully!"
      });
      
      // Reset form
      setNewProject({
        title: '',
        description: '',
        budget: ''
      });
      
      // Refresh projects list
      fetchProjects();
    } catch (error: any) {
      console.error('Error creating project:', error);
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleEditInitiate = (project: Project) => {
    // Only allow editing if project is still open
    if (project.status !== 'open') {
      toast({
        title: "Cannot Edit",
        description: "Projects that are assigned or completed cannot be edited.",
        variant: "destructive"
      });
      return;
    }
    
    setEditProject(project);
    setEditedProject({
      title: project.title,
      description: project.description || '',
      budget: project.budget ? project.budget.toString() : ''
    });
  };
  
  const handleEditCancel = () => {
    setEditProject(null);
  };
  
  const handleUpdateProject = async (project: Project) => {
    if (!editedProject.title || !editedProject.description || !editedProject.budget) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    // Double check that project is still in 'open' status
    if (project.status !== 'open') {
      toast({
        title: "Cannot Edit",
        description: "This project has changed status and can no longer be edited.",
        variant: "destructive"
      });
      setEditProject(null);
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('projects')
        .update({
          title: editedProject.title,
          description: editedProject.description,
          budget: parseFloat(editedProject.budget),
        })
        .eq('id', project.id)
        .eq('status', 'open');
      
      if (error) throw error;
      
      toast({
        title: "Project Updated",
        description: "Your project has been updated successfully!"
      });
      
      setEditProject(null);
      fetchProjects();
    } catch (error: any) {
      console.error('Error updating project:', error);
      toast({
        title: "Error",
        description: "Failed to update project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteInitiate = (projectId: string) => {
    // Check if project can be deleted
    const project = projects.find(p => p.id === projectId);
    if (project && project.status !== 'open') {
      toast({
        title: "Cannot Delete",
        description: "Projects that are assigned or completed cannot be deleted.",
        variant: "destructive"
      });
      return;
    }
    
    setProjectToDelete(projectId);
  };
  
  const handleDeleteCancel = () => {
    setProjectToDelete(null);
  };
  
  const handleDeleteProject = async (projectId: string) => {
    try {
      setIsSubmitting(true);
      
      // Double-check that project is still in 'open' status
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('status')
        .eq('id', projectId)
        .single();
        
      if (projectError) throw projectError;
      
      if (projectData.status !== 'open') {
        toast({
          title: "Cannot Delete",
          description: "This project has changed status and can no longer be deleted.",
          variant: "destructive"
        });
        setProjectToDelete(null);
        return;
      }
      
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)
        .eq('status', 'open');
      
      if (error) throw error;
      
      toast({
        title: "Project Deleted",
        description: "Your project has been deleted successfully!"
      });
      
      setProjectToDelete(null);
      fetchProjects();
    } catch (error: any) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApplicationUpdate = async (applicationId: string, newStatus: string, projectId: string, professionalId: string) => {
    try {
      // First, update the application status
      const { error: appUpdateError } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', applicationId);
      
      if (appUpdateError) throw appUpdateError;
      
      // If accepting, also update project status and assigned_to
      if (newStatus === 'accepted') {
        const { error: projectUpdateError } = await supabase
          .from('projects')
          .update({ 
            status: 'assigned',
            assigned_to: professionalId
          })
          .eq('id', projectId);
        
        if (projectUpdateError) throw projectUpdateError;
        
        // Reject all other applications for this project
        const { error: rejectError } = await supabase
          .from('applications')
          .update({ status: 'rejected' })
          .eq('project_id', projectId)
          .neq('id', applicationId);
          
        if (rejectError) throw rejectError;
      }
      
      toast({
        title: "Application Updated",
        description: newStatus === 'accepted' 
          ? "Professional has been assigned to this project." 
          : "Application has been rejected."
      });
      
      // Refresh data
      fetchProjects();
    } catch (error: any) {
      console.error('Error updating application:', error);
      toast({
        title: "Error",
        description: "Failed to update application status.",
        variant: "destructive"
      });
    }
  };

  const markProjectAsPaid = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: 'paid' })
        .eq('id', projectId);
      
      if (error) throw error;
      
      toast({
        title: "Payment Recorded",
        description: "The project has been marked as paid"
      });
      
      // Refresh data
      fetchProjects();
    } catch (error: any) {
      console.error('Error marking project as paid:', error);
      toast({
        title: "Error",
        description: "Failed to update payment status.",
        variant: "destructive"
      });
    }
  };
  
  const handleReviewInitiate = (project: Project) => {
    // Check if project is completed and doesn't have a review yet
    if (project.status !== 'completed') {
      toast({
        title: "Cannot Review Yet",
        description: "You can only review completed projects.",
        variant: "destructive"
      });
      return;
    }
    
    // Check if review already exists
    const existingReview = reviews.find(r => r.project_id === project.id);
    if (existingReview) {
      toast({
        title: "Review Exists",
        description: "You have already submitted a review for this project.",
        variant: "destructive"
      });
      return;
    }
    
    setProjectToReview(project);
    setReviewData({ rating: 0, comment: '' });
  };
  
  const handleReviewCancel = () => {
    setProjectToReview(null);
  };
  
  const handleReviewSubmit = async () => {
    if (!projectToReview || reviewData.rating === 0) {
      toast({
        title: "Missing Information",
        description: "Please provide a rating before submitting.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Get the professional_id for the project
      const { data: applicationData, error: applicationError } = await supabase
        .from('applications')
        .select('professional_id')
        .eq('project_id', projectToReview.id)
        .eq('status', 'accepted')
        .single();
        
      if (applicationError) throw applicationError;
      
      const professional_id = applicationData.professional_id;
      
      // Create the review
      const { error: reviewError } = await supabase
        .from('reviews')
        .insert({
          project_id: projectToReview.id,
          client_id: userId,
          professional_id: professional_id,
          rating: reviewData.rating,
          comment: reviewData.comment,
        });
        
      if (reviewError) throw reviewError;
      
      // Update project status to indicate it's been reviewed
      const { error: projectError } = await supabase
        .from('projects')
        .update({ status: 'archived' })
        .eq('id', projectToReview.id);
        
      if (projectError) throw projectError;
      
      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback!"
      });
      
      setProjectToReview(null);
      fetchProjects();
    } catch (error: any) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Tabs defaultValue={initialTab}>
      <TabsList className="mb-6">
        <TabsTrigger value="projects">Your Projects</TabsTrigger>
        <TabsTrigger value="applications">Applications</TabsTrigger>
        <TabsTrigger value="create">Create Project</TabsTrigger>
        <TabsTrigger value="completed">Completed Projects</TabsTrigger>
      </TabsList>
      
      <TabsContent value="projects">
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
      </TabsContent>
      
      <TabsContent value="applications">
        <h2 className="text-2xl font-bold mb-4">Applications to Your Projects</h2>
        {isLoading ? (
          <p>Loading applications...</p>
        ) : applications.filter(app => app.status === 'pending').length === 0 ? (
          <div className="text-center py-8">
            <p className="text-ttc-neutral-600">No pending applications at the moment.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Applicant</TableHead>
                <TableHead>Cover Letter</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications
                .filter(app => app.status === 'pending')
                .map(app => {
                  const project = projects.find(p => p.id === app.project_id);
                  // Only show applications for projects that are still open
                  if (!project || project.status !== 'open') return null;
                  
                  return (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{project?.title || 'Unknown Project'}</TableCell>
                      <TableCell>
                        {app.professional ? `${app.professional.first_name} ${app.professional.last_name}` : 'Unknown Applicant'}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{app.cover_letter}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                            onClick={() => handleApplicationUpdate(
                              app.id, 
                              'accepted', 
                              app.project_id || '', 
                              app.professional_id || ''
                            )}
                          >
                            <Check className="w-4 h-4 mr-1" /> Accept
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
                            onClick={() => handleApplicationUpdate(
                              app.id, 
                              'rejected', 
                              app.project_id || '', 
                              app.professional_id || ''
                            )}
                          >
                            <X className="w-4 h-4 mr-1" /> Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        )}
        
        <h2 className="text-2xl font-bold mb-4 mt-8">Past Applications</h2>
        {applications.filter(app => app.status !== 'pending').length === 0 ? (
          <div className="text-center py-8">
            <p className="text-ttc-neutral-600">No past applications.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Applicant</TableHead>
                <TableHead>Applied On</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications
                .filter(app => app.status !== 'pending')
                .map(app => {
                  const project = projects.find(p => p.id === app.project_id);
                  
                  return (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{project?.title || 'Unknown Project'}</TableCell>
                      <TableCell>
                        {app.professional ? `${app.professional.first_name} ${app.professional.last_name}` : 'Unknown Applicant'}
                      </TableCell>
                      <TableCell>{new Date(app.created_at || '').toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          app.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {app.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        )}
      </TabsContent>
      
      <TabsContent value="create">
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
      </TabsContent>
      
      <TabsContent value="completed">
        <h2 className="text-2xl font-bold mb-4">Completed Projects</h2>
        {isLoading ? (
          <p>Loading completed projects...</p>
        ) : projects.filter(p => p.status === 'completed' || p.status === 'archived').length === 0 ? (
          <div className="text-center py-8">
            <p className="text-ttc-neutral-600">You don't have any completed projects yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {projects
              .filter(p => p.status === 'completed' || p.status === 'archived')
              .map(project => {
                // Find the accepted application for this project to get professional info
                const acceptedApp = applications.find(app => 
                  app.project_id === project.id && app.status === 'accepted'
                );
                
                // Check if this project has a review
                const hasReview = reviews.some(r => r.project_id === project.id);
                
                return (
                  <Card key={project.id}>
                    <CardHeader>
                      <CardTitle>{project.title}</CardTitle>
                      <CardDescription className="flex items-center justify-between">
                        <span>Completed</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          project.status === 'archived' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {project.status === 'archived' ? 'Reviewed' : 'Completed'}
                        </span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-ttc-neutral-600 mb-4">{project.description}</p>
                      <p className="font-medium">Budget: ${project.budget}</p>
                      
                      {acceptedApp && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-md">
                          <p className="font-medium">Completed by:</p>
                          <p>{acceptedApp.professional?.first_name} {acceptedApp.professional?.last_name}</p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      {!hasReview && project.status === 'completed' ? (
                        <Button 
                          className="w-full bg-yellow-600 hover:bg-yellow-700"
                          onClick={() => handleReviewInitiate(project)}
                        >
                          <Star className="w-4 h-4 mr-2" /> Leave a Review
                        </Button>
                      ) : hasReview ? (
                        <p className="text-sm text-center w-full text-green-600">
                          Review submitted
                        </p>
                      ) : (
                        <p className="text-sm text-center w-full text-gray-500">
                          Project archived
                        </p>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
          </div>
        )}
        
        {/* Review Dialog */}
        {projectToReview && (
          <Card className="mt-6 border-yellow-200">
            <CardHeader className="bg-yellow-50">
              <CardTitle>Leave a Review</CardTitle>
              <CardDescription>
                Share your experience with the professional who completed your project.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="rating" className="block mb-2">Rating</Label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Button 
                        key={star}
                        type="button"
                        variant="ghost"
                        size="sm"
                        className={`p-1 ${reviewData.rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                        onClick={() => setReviewData(prev => ({ ...prev, rating: star }))}
                      >
                        <Star className={`h-8 w-8 ${reviewData.rating >= star ? 'fill-yellow-500' : ''}`} />
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="review-comment">Your Comments</Label>
                  <Textarea 
                    id="review-comment" 
                    className="min-h-[120px]"
                    placeholder="Share details about your experience working with this professional..."
                    value={reviewData.comment}
                    onChange={e => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handleReviewCancel}
              >
                Cancel
              </Button>
              <Button 
                className="bg-yellow-600 hover:bg-yellow-700"
                onClick={handleReviewSubmit}
                disabled={isSubmitting || reviewData.rating === 0}
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </CardFooter>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default ClientDashboard;
