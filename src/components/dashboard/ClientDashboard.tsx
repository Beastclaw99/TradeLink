
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectsTab from './client/ProjectsTab';
import ApplicationsTab from './client/ApplicationsTab';
import CreateProjectTab from './client/CreateProjectTab';
import PaymentsTab from './client/PaymentsTab';
import ProfileTab from './client/ProfileTab';
import { Project, Application, Payment } from './types';

interface ClientDashboardProps {
  userId: string;
  initialTab?: string;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ userId, initialTab = 'projects' }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [projects, setProjects] = useState<Project[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [editedProject, setEditedProject] = useState({
    title: '',
    description: '',
    budget: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    fetchDashboardData();
  }, [userId]);
  
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch client's projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('client_id', userId)
        .order('created_at', { ascending: false });
      
      if (projectsError) throw projectsError;
      setProjects(projectsData || []);
      
      // Fetch applications for client's projects
      const { data: appsData, error: appsError } = await supabase
        .from('applications')
        .select(`
          *,
          project:projects(title, status, budget),
          professional:profiles!applications_professional_id_fkey(first_name, last_name)
        `)
        .in('project_id', projectsData.map(project => project.id) || []);
      
      if (appsError) throw appsError;
      setApplications(appsData || []);
      
      // Fetch payments for client's projects
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select(`
          *,
          project:projects(title),
          professional:profiles!payments_professional_id_fkey(first_name, last_name)
        `)
        .eq('client_id', userId);
      
      if (paymentsError) throw paymentsError;
      setPayments(paymentsData || []);
      
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateProject = async (projectData: { title: string, description: string, budget: string }) => {
    try {
      setIsSubmitting(true);
      
      const { data, error } = await supabase
        .from('projects')
        .insert([
          {
            title: projectData.title,
            description: projectData.description,
            budget: parseFloat(projectData.budget),
            client_id: userId,
            status: 'open'
          }
        ])
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Project Created",
        description: "Your new project has been created successfully!"
      });
      
      // Refresh projects data
      fetchDashboardData();
      
      // Switch to projects tab
      setActiveTab('projects');
      
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
    setEditProject(project);
    setEditedProject({
      title: project.title,
      description: project.description || '',
      budget: project.budget?.toString() || ''
    });
  };
  
  const handleEditCancel = () => {
    setEditProject(null);
    setEditedProject({
      title: '',
      description: '',
      budget: ''
    });
  };
  
  const handleUpdateProject = async (project: Project) => {
    try {
      setIsSubmitting(true);
      
      const { data, error } = await supabase
        .from('projects')
        .update({
          title: editedProject.title,
          description: editedProject.description,
          budget: parseFloat(editedProject.budget),
        })
        .eq('id', project.id)
        .eq('client_id', userId)
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Project Updated",
        description: "Your project has been updated successfully!"
      });
      
      // Refresh projects data
      fetchDashboardData();
      
      // Reset edit state
      handleEditCancel();
      
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
    setProjectToDelete(projectId);
  };
  
  const handleDeleteCancel = () => {
    setProjectToDelete(null);
  };
  
  const handleDeleteProject = async (projectId: string) => {
    try {
      setIsSubmitting(true);
      
      // First check if the project has any applications
      const { data: apps, error: appsError } = await supabase
        .from('applications')
        .select('id')
        .eq('project_id', projectId);
      
      if (appsError) throw appsError;
      
      // If there are applications, delete them first
      if (apps && apps.length > 0) {
        const { error: deleteAppsError } = await supabase
          .from('applications')
          .delete()
          .eq('project_id', projectId);
        
        if (deleteAppsError) throw deleteAppsError;
      }
      
      // Now delete the project
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)
        .eq('client_id', userId);
      
      if (error) throw error;
      
      toast({
        title: "Project Deleted",
        description: "Your project has been deleted successfully!"
      });
      
      // Refresh projects data
      fetchDashboardData();
      
      // Reset delete state
      handleDeleteCancel();
      
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
  
  const handleApplicationUpdate = async (
    applicationId: string, 
    newStatus: string, 
    projectId: string, 
    professionalId: string
  ) => {
    try {
      setIsSubmitting(true);
      
      // Start a transaction
      if (newStatus === 'accepted') {
        // If accepting, update project to assigned
        const { error: projectError } = await supabase
          .from('projects')
          .update({
            status: 'assigned',
            assigned_to: professionalId
          })
          .eq('id', projectId)
          .eq('client_id', userId);
        
        if (projectError) throw projectError;
        
        // Reject all other applications for this project
        const { error: rejectError } = await supabase
          .from('applications')
          .update({ status: 'rejected' })
          .eq('project_id', projectId)
          .neq('id', applicationId);
        
        if (rejectError) throw rejectError;
      }
      
      // Update the specific application status
      const { error: appError } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', applicationId);
      
      if (appError) throw appError;
      
      toast({
        title: `Application ${newStatus === 'accepted' ? 'Accepted' : 'Rejected'}`,
        description: newStatus === 'accepted' 
          ? "The professional has been assigned to your project."
          : "The application has been rejected."
      });
      
      // Refresh data
      fetchDashboardData();
      
    } catch (error: any) {
      console.error('Error updating application:', error);
      toast({
        title: "Error",
        description: "Failed to update application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Set the active tab based on initialTab prop
  useEffect(() => {
    if (initialTab && ['projects', 'applications', 'create', 'payments', 'profile'].includes(initialTab)) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  
  // Props to pass to tab components
  const projectsTabProps = {
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
  };
  
  const applicationsTabProps = {
    isLoading,
    projects,
    applications,
    handleApplicationUpdate
  };
  
  const createProjectTabProps = {
    isSubmitting,
    handleCreateProject
  };
  
  const paymentsTabProps = {
    isLoading,
    payments
  };
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-6">
        <TabsTrigger value="projects" data-value="projects">Your Projects</TabsTrigger>
        <TabsTrigger value="applications" data-value="applications">Applications</TabsTrigger>
        <TabsTrigger value="create" data-value="create">Post New Project</TabsTrigger>
        <TabsTrigger value="payments" data-value="payments">Payments</TabsTrigger>
        <TabsTrigger value="profile" data-value="profile">Profile</TabsTrigger>
      </TabsList>
      
      <TabsContent value="projects">
        <ProjectsTab {...projectsTabProps} />
      </TabsContent>
      
      <TabsContent value="applications">
        <ApplicationsTab {...applicationsTabProps} />
      </TabsContent>
      
      <TabsContent value="create">
        <CreateProjectTab {...createProjectTabProps} />
      </TabsContent>
      
      <TabsContent value="payments">
        <PaymentsTab {...paymentsTabProps} />
      </TabsContent>
      
      <TabsContent value="profile">
        <ProfileTab userId={userId} />
      </TabsContent>
    </Tabs>
  );
};

export default ClientDashboard;
