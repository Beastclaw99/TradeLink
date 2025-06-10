import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectsTab from './client/ProjectsTab';
import ApplicationsTab from './client/ApplicationsTab';
import CreateProjectTab from './client/CreateProjectTab';
import PaymentsTab from './client/PaymentsTab';
import { useClientDashboard } from '@/hooks/useClientDashboard';
import { Project } from './types';

interface ClientDashboardProps {
  userId: string;
  initialTab?: string;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ userId, initialTab = 'projects' }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(initialTab);

  // Use consolidated hook for all dashboard functionality
  const { 
    // Data
    projects, 
    applications, 
    payments, 
    reviews, 
    profile, 
    isLoading,
    error,
    
    // Project state
    selectedProject,
    setSelectedProject,
    editedProject,
    projectToDelete,
    isProjectSubmitting,
    
    // Review state
    projectToReview,
    reviewData,
    isReviewSubmitting,
    
    // Actions
    fetchDashboardData,
    handleApplicationUpdate,
    handleEditInitiate,
    handleEditCancel,
    handleUpdateProject,
    handleDeleteInitiate,
    handleDeleteCancel,
    handleDeleteProject,
    handleReviewInitiate,
    handleReviewCancel,
    handleReviewSubmit,
    setReviewData,
    
    // Calculations
    calculateAverageRating,
    calculatePaymentTotals
  } = useClientDashboard(userId);
  
  // Set the active tab based on initialTab prop
  useEffect(() => {
    if (initialTab && ['projects', 'applications', 'create', 'payments'].includes(initialTab)) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  
  // Props to pass to tab components
  const projectsTabProps = {
    isLoading,
    projects,
    applications,
    editProject: editedProject,
    projectToDelete,
    editedProject: {
      title: editedProject?.title || '',
      description: editedProject?.description || '',
      budget: editedProject?.budget?.toString() || ''
    },
    isSubmitting: isProjectSubmitting,
    setEditedProject: (project: { title: string; description: string; budget: string }) => {
      if (editedProject) {
        handleEditInitiate({
          ...editedProject,
          title: project.title,
          description: project.description,
          budget: parseFloat(project.budget)
        });
      }
    },
    handleEditInitiate,
    handleEditCancel,
    handleUpdateProject,
    handleDeleteInitiate,
    handleDeleteCancel,
    handleDeleteProject,
    selectedProject,
    setSelectedProject,
    handleAddMilestone: async (projectId: string, milestone: any) => {
      // Implement milestone handling
      await fetchDashboardData();
    },
    handleEditMilestone: async (projectId: string, milestoneId: string, updates: any) => {
      // Implement milestone handling
      await fetchDashboardData();
    },
    handleDeleteMilestone: async (projectId: string, milestoneId: string) => {
      // Implement milestone handling
      await fetchDashboardData();
    },
    fetchProjectDetails: async (projectId: string) => {
      const project = projects.find((p: Project) => p.id === projectId);
      if (!project) return null;
      return project;
    },
    error,
    onEditProject: handleEditInitiate,
    onDeleteProject: handleDeleteInitiate,
    profile
  };
  
  const applicationsTabProps = {
    isLoading,
    projects,
    applications,
    handleApplicationUpdate,
    profile
  };
  
  const paymentsTabProps = {
    isLoading,
    projects,
    reviews,
    applications,
    projectToReview: projectToReview ? projects.find((p: Project) => p.id === projectToReview.project_id) || null : null,
    reviewData: {
      rating: reviewData.rating,
      comment: reviewData.comment
    },
    isSubmitting: isReviewSubmitting,
    handleReviewInitiate: (project: Project) => {
      const application = applications.find((app: any) => app.project_id === project.id);
      if (application) {
        handleReviewInitiate(application);
      }
    },
    handleReviewCancel,
    handleReviewSubmit,
    setReviewData: (data: { rating: number; comment: string }) => {
      setReviewData({
        ...reviewData,
        rating: data.rating,
        comment: data.comment
      });
    }
  };
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-6">
        <TabsTrigger value="projects" data-value="projects">Your Projects</TabsTrigger>
        <TabsTrigger value="applications" data-value="applications">Applications</TabsTrigger>
        <TabsTrigger value="create" data-value="create">Post New Project</TabsTrigger>
        <TabsTrigger value="payments" data-value="payments">Payments</TabsTrigger>
      </TabsList>
      
      <TabsContent value="projects">
        <ProjectsTab {...projectsTabProps} />
      </TabsContent>
      
      <TabsContent value="applications">
        <ApplicationsTab {...applicationsTabProps} />
      </TabsContent>
      
      <TabsContent value="create">
        <CreateProjectTab />
      </TabsContent>
      
      <TabsContent value="payments">
        <PaymentsTab {...paymentsTabProps} />
      </TabsContent>
    </Tabs>
  );
};

export default ClientDashboard;
