
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
import { FileText, Plus, Check, X } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  budget: number;
  status: string;
  created_at: string;
}

interface Application {
  id: string;
  project_id: string;
  professional_id: string;
  status: string;
  cover_letter: string;
  created_at: string;
  professional: {
    first_name: string;
    last_name: string;
  };
}

interface ClientDashboardProps {
  userId: string;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ userId }) => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newProject, setNewProject] = useState({
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
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('client_id', userId)
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;
      
      // Set projects
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
        .insert([
          {
            title: newProject.title,
            description: newProject.description,
            budget: parseFloat(newProject.budget),
            status: 'open',
            client_id: userId
          }
        ])
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

  const handleApplicationUpdate = async (applicationId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', applicationId);
      
      if (error) throw error;
      
      toast({
        title: "Application Updated",
        description: `Application has been ${newStatus}`
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

  return (
    <Tabs defaultValue="projects">
      <TabsList className="mb-6">
        <TabsTrigger value="projects">Your Projects</TabsTrigger>
        <TabsTrigger value="applications">Applications</TabsTrigger>
        <TabsTrigger value="create">Create Project</TabsTrigger>
        <TabsTrigger value="payments">Payments</TabsTrigger>
      </TabsList>
      
      <TabsContent value="projects">
        <h2 className="text-2xl font-bold mb-4">Your Posted Projects</h2>
        {isLoading ? (
          <p>Loading your projects...</p>
        ) : projects.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 mx-auto text-ttc-neutral-400" />
            <p className="mt-4 text-ttc-neutral-600">You haven't posted any projects yet.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => document.querySelector('[data-value="create"]')?.click()}
            >
              <Plus className="w-4 h-4 mr-2" /> Post Your First Project
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map(project => (
              <Card key={project.id}>
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                  <CardDescription className="flex items-center justify-between">
                    <span>Posted on {new Date(project.created_at).toLocaleDateString()}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      project.status === 'open' ? 'bg-green-100 text-green-800' : 
                      project.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {project.status.replace('_', ' ')}
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
      </TabsContent>
      
      <TabsContent value="applications">
        <h2 className="text-2xl font-bold mb-4">Applications to Your Projects</h2>
        {isLoading ? (
          <p>Loading applications...</p>
        ) : applications.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-ttc-neutral-600">No applications received yet.</p>
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
              {applications.map(app => {
                const project = projects.find(p => p.id === app.project_id);
                return (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">{project?.title || 'Unknown Project'}</TableCell>
                    <TableCell>
                      {app.professional?.first_name} {app.professional?.last_name}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{app.cover_letter}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        app.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {app.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {app.status === 'pending' && (
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                            onClick={() => handleApplicationUpdate(app.id, 'accepted')}
                          >
                            <Check className="w-4 h-4 mr-1" /> Accept
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
                            onClick={() => handleApplicationUpdate(app.id, 'rejected')}
                          >
                            <X className="w-4 h-4 mr-1" /> Reject
                          </Button>
                        </div>
                      )}
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
      
      <TabsContent value="payments">
        <h2 className="text-2xl font-bold mb-4">Payment Management</h2>
        {isLoading ? (
          <p>Loading payment information...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects
                .filter(project => project.status === 'in_progress' || project.status === 'paid')
                .map(project => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.title}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        project.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'
                      }`}>
                        {project.status === 'in_progress' ? 'Payment Due' : 'Paid'}
                      </span>
                    </TableCell>
                    <TableCell>${project.budget}</TableCell>
                    <TableCell>
                      {project.status === 'in_progress' && (
                        <Button 
                          variant="outline"
                          className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                          onClick={() => markProjectAsPaid(project.id)}
                        >
                          Mark as Paid
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              
              {projects.filter(project => project.status === 'in_progress' || project.status === 'paid').length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    No active projects requiring payment.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default ClientDashboard;
