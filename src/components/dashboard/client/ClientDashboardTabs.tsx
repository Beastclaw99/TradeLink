
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProjectsTab from './ProjectsTab';
import ApplicationsTab from './ApplicationsTab';
import PaymentsTab from './PaymentsTab';
import ReviewsTab from './ReviewsTab';
import { Application, Project, Payment, Review, Profile } from '@/types/database';

interface ClientDashboardTabsProps {
  userId: string;
  isLoading: boolean;
  projects: Project[];
  applications: Application[];
  payments: Payment[];
  reviews: Review[];
  profile: Profile | null;
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
  editedProject: Project | null;
  projectToDelete: string | null;
  isProjectSubmitting: boolean;
  handleEditInitiate: (project: Project) => void;
  handleEditCancel: () => void;
  handleUpdateProject: (project: Project) => Promise<void>;
  handleDeleteInitiate: (projectId: string) => void;
  handleDeleteCancel: () => void;
  handleDeleteProject: (projectId: string) => Promise<void>;
  projectToReview: Application | null;
  reviewData: {
    rating: number;
    comment: string;
    professional_id: string;
  };
  isReviewSubmitting: boolean;
  handleReviewInitiate: (application: Application) => void;
  handleReviewCancel: () => void;
  handleReviewSubmit: () => Promise<void>;
  setReviewData: (data: { rating: number; comment: string; professional_id: string }) => void;
  handleApplicationUpdate: (applicationId: string, status: 'accepted' | 'rejected') => Promise<void>;
  calculateAverageRating: () => number;
  calculatePaymentTotals: () => { total: number; pending: number; completed: number };
}

export const ClientDashboardTabs: React.FC<ClientDashboardTabsProps> = ({
  userId,
  isLoading,
  projects,
  applications,
  payments,
  reviews,
  profile,
  selectedProject,
  setSelectedProject,
  editedProject,
  projectToDelete,
  isProjectSubmitting,
  handleEditInitiate,
  handleEditCancel,
  handleUpdateProject,
  handleDeleteInitiate,
  handleDeleteCancel,
  handleDeleteProject,
  projectToReview,
  reviewData,
  isReviewSubmitting,
  handleReviewInitiate,
  handleReviewCancel,
  handleReviewSubmit,
  setReviewData,
  handleApplicationUpdate,
  calculateAverageRating,
  calculatePaymentTotals
}) => {
  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Client Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your projects and track progress</p>
      </div>

      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="mt-6">
          <ProjectsTab
            isLoading={isLoading}
            projects={projects}
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
            editedProject={editedProject}
            projectToDelete={projectToDelete}
            isProjectSubmitting={isProjectSubmitting}
            handleEditInitiate={handleEditInitiate}
            handleEditCancel={handleEditCancel}
            handleUpdateProject={handleUpdateProject}
            handleDeleteInitiate={handleDeleteInitiate}
            handleDeleteCancel={handleDeleteCancel}
            handleDeleteProject={handleDeleteProject}
            userId={userId}
          />
        </TabsContent>

        <TabsContent value="applications" className="mt-6">
          <ApplicationsTab
            isLoading={isLoading}
            projects={projects}
            applications={applications}
            handleApplicationUpdate={handleApplicationUpdate}
            userId={userId}
          />
        </TabsContent>

        <TabsContent value="payments" className="mt-6">
          <PaymentsTab
            isLoading={isLoading}
            payments={payments}
            calculatePaymentTotals={calculatePaymentTotals}
          />
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <ReviewsTab
            isLoading={isLoading}
            reviews={reviews}
            applications={applications}
            projectToReview={projectToReview}
            reviewData={reviewData}
            isReviewSubmitting={isReviewSubmitting}
            handleReviewInitiate={handleReviewInitiate}
            handleReviewCancel={handleReviewCancel}
            handleReviewSubmit={handleReviewSubmit}
            setReviewData={setReviewData}
            calculateAverageRating={calculateAverageRating}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
