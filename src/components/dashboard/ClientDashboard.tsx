import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectsTab from './client/ProjectsTab';
import ApplicationsTab from './client/ApplicationsTab';
import CreateProjectTab from './client/CreateProjectTab';
import PaymentsTab from './client/PaymentsTab';
import { useClientDashboard } from '@/hooks/useClientDashboard';
import { useProjectOperations } from '@/hooks/useProjectOperations';
import { useReviewOperations } from '@/hooks/useReviewOperations';
import { useApplicationOperations } from '@/hooks/useApplicationOperations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProjectList } from '@/components/project/ProjectList';
import { ApplicationList } from '@/components/application/ApplicationList';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface ClientDashboardProps {
  clientId: string;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({ clientId }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('projects');

  // Use custom hooks for data fetching and operations
  const { 
    projects, 
    applications, 
    payments, 
    reviews, 
    profileData, 
    isLoading, 
    fetchDashboardData, 
    error,
    stats,
    recentActivity,
    refreshData
  } = useClientDashboard(clientId);
  
  const { 
    editProject, 
    projectToDelete, 
    editedProject, 
    newProject, 
    isSubmitting: isProjectSubmitting, 
    setEditedProject, 
    setNewProject, 
    handleCreateProject, 
    handleEditInitiate, 
    handleEditCancel, 
    handleUpdateProject, 
    handleDeleteInitiate, 
    handleDeleteCancel, 
    handleDeleteProject 
  } = useProjectOperations(clientId, fetchDashboardData);
  
  const { 
    projectToReview, 
    reviewData, 
    isSubmitting: isReviewSubmitting, 
    setReviewData, 
    handleReviewInitiate, 
    handleReviewCancel, 
    handleReviewSubmit 
  } = useReviewOperations(clientId, applications, fetchDashboardData);
  
  const { 
    isProcessing, 
    handleApplicationUpdate 
  } = useApplicationOperations(clientId, fetchDashboardData);
  
  // Set the active tab based on initialTab prop
  useEffect(() => {
    if (activeTab && ['projects', 'applications', 'create', 'payments'].includes(activeTab)) {
      setActiveTab(activeTab);
    }
  }, [activeTab]);
  
  // Props to pass to tab components
  const projectsTabProps = {
    isLoading,
    projects,
    applications,
    editProject,
    projectToDelete,
    editedProject,
    isSubmitting: isProjectSubmitting,
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
  
  const paymentsTabProps = {
    isLoading,
    projects,
    reviews,
    applications,
    projectToReview,
    reviewData,
    isSubmitting: isReviewSubmitting,
    handleReviewInitiate,
    handleReviewCancel,
    handleReviewSubmit,
    setReviewData
  };
  
  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-destructive">Error Loading Dashboard</h3>
              <p className="mt-2 text-sm text-muted-foreground">{error}</p>
              <button
                onClick={refreshData}
                className="mt-4 text-sm text-primary hover:underline"
              >
                Try Again
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Client Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your projects and applications
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardStats stats={stats} />
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentActivity activities={recentActivity} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <button
                onClick={() => window.location.href = '/projects/new'}
                className="flex items-center justify-center rounded-lg border p-4 hover:bg-accent"
              >
                Create New Project
              </button>
              <button
                onClick={() => window.location.href = '/applications'}
                className="flex items-center justify-center rounded-lg border p-4 hover:bg-accent"
              >
                View Applications
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="projects" data-value="projects">Your Projects</TabsTrigger>
            <TabsTrigger value="applications" data-value="applications">Applications</TabsTrigger>
            <TabsTrigger value="create" data-value="create">Post New Project</TabsTrigger>
            <TabsTrigger value="payments" data-value="payments">Payments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="projects">
            <ProjectList
              projects={projects}
              onProjectUpdate={refreshData}
            />
          </TabsContent>
          
          <TabsContent value="applications">
            <ApplicationList
              applications={applications}
              onApplicationUpdate={refreshData}
            />
          </TabsContent>
          
          <TabsContent value="create">
            <CreateProjectTab />
          </TabsContent>
          
          <TabsContent value="payments">
            <PaymentsTab {...paymentsTabProps} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientDashboard;
