import { useState } from 'react';
import { useClientDashboard } from '@/hooks/useClientDashboard';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectsTab from './client/ProjectsTab';
import ApplicationsTab from './client/ApplicationsTab';
import CreateProjectTab from './client/CreateProjectTab';
import PaymentsTab from './client/PaymentsTab';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ClientDashboardProps {
  userId?: string;
  initialTab?: string;
}

export const ClientDashboard = ({ userId: propUserId, initialTab = 'projects' }: ClientDashboardProps) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // Use the userId prop if provided, otherwise fall back to the authenticated user's ID
  const userId = propUserId || user?.id || '';
  
  const {
    projects,
    applications,
    payments,
    reviews,
    profileData,
    isLoading,
    error,
    // Project operations
    editProject,
    projectToDelete,
    editedProject,
    newProject,
    isProjectSubmitting,
    handleEditInitiate,
    handleEditCancel,
    handleUpdateProject,
    handleDeleteInitiate,
    handleDeleteCancel,
    handleDeleteProject,
    // Review operations
    projectToReview,
    reviewData,
    isReviewSubmitting,
    handleReviewInitiate,
    handleReviewCancel,
    handleReviewSubmit,
    setReviewData,
    // Application operations
    handleApplicationUpdate,
    // Data refresh
    fetchDashboardData
  } = useClientDashboard(userId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="create">Create Project</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <ProjectsTab
            isLoading={isLoading}
            projects={projects}
            applications={applications}
            editProject={editProject}
            projectToDelete={projectToDelete}
            editedProject={{
              title: editedProject?.title || '',
              description: editedProject?.description || '',
              budget: typeof editedProject?.budget === 'number' ? editedProject.budget : (editedProject?.budget ? parseFloat(editedProject.budget as any) : null)
            }}
            isSubmitting={isProjectSubmitting}
            setEditedProject={(project) => {
              if (editProject) {
                handleEditInitiate({
                  ...editProject,
                  title: project.title,
                  description: project.description,
                  budget: typeof project.budget === 'number' ? project.budget : (project.budget ? parseFloat(project.budget as any) : null)
                });
              }
            }}
            handleEditInitiate={handleEditInitiate}
            handleEditCancel={handleEditCancel}
            handleUpdateProject={handleUpdateProject}
            handleDeleteInitiate={handleDeleteInitiate}
            handleDeleteCancel={handleDeleteCancel}
            handleDeleteProject={handleDeleteProject}
          />
        </TabsContent>

        <TabsContent value="applications">
          <ApplicationsTab
            isLoading={isLoading}
            projects={projects}
            applications={applications}
            handleApplicationUpdate={handleApplicationUpdate}
          />
        </TabsContent>

        <TabsContent value="create">
          <CreateProjectTab />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentsTab
            isLoading={isLoading}
            projects={projects}
            reviews={reviews}
            applications={applications}
            projectToReview={projectToReview ? projects.find(p => p.id === projectToReview) || null : null}
            reviewData={{
              rating: reviewData?.rating || 0,
              comment: reviewData?.comment || ''
            }}
            isSubmitting={isReviewSubmitting}
            handleReviewInitiate={(project) => handleReviewInitiate(project.id)}
            handleReviewCancel={handleReviewCancel}
            handleReviewSubmit={async () => {
              if (projectToReview && reviewData) {
                await handleReviewSubmit(projectToReview, reviewData);
              }
            }}
            setReviewData={(data) => {
              setReviewData(data);
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
