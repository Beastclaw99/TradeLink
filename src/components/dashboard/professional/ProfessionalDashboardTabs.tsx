
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AvailableProjectsTab } from './AvailableProjectsTab';
import ApplicationsTab from './ApplicationsTab';
import ActiveProjectsTab from './ActiveProjectsTab';
import PaymentsTab from './PaymentsTab';
import ReviewsTab from './ReviewsTab';
import ProjectApplicationForm from './ProjectApplicationForm';
import { Project, Application, Payment, Review } from '../types';

interface ProfessionalDashboardTabsProps {
  userId: string;
  isLoading: boolean;
  projects: Project[];
  applications: Application[];
  payments: Payment[];
  reviews: Review[];
  skills?: string[];
  profile: any;
  coverLetter: string;
  setCoverLetter: (value: string) => void;
  bidAmount: number | null;
  setBidAmount: (value: number | null) => void;
  selectedProject: string | null;
  setSelectedProject: (projectId: string | null) => void;
  availability: string;
  setAvailability: (value: string) => void;
  isApplying: boolean;
  handleApplyToProject: () => Promise<void>;
  markProjectComplete: (projectId: string) => Promise<void>;
  calculateAverageRating: () => number;
  calculatePaymentTotals: () => { total: number; pending: number; completed: number };
  updateProfile: (data: any) => void;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  isSubmitting: boolean;
  onCancelApplication: () => void;
}

export const ProfessionalDashboardTabs: React.FC<ProfessionalDashboardTabsProps> = ({
  isLoading,
  projects,
  applications,
  payments,
  reviews,
  skills,
  coverLetter,
  setCoverLetter,
  bidAmount,
  setBidAmount,
  selectedProject,
  setSelectedProject,
  availability,
  setAvailability,
  isApplying,
  handleApplyToProject,
  markProjectComplete,
  calculateAverageRating,
  calculatePaymentTotals,
  isSubmitting,
  onCancelApplication
}) => {
  // Helper functions for project actions
  const handleViewProject = (projectId: string) => {
    console.log('Viewing project:', projectId);
  };

  const handleUpdateProjectStatus = async (projectId: string, status: string) => {
    console.log('Updating project status:', projectId, status);
  };

  const handleSubmitWork = (projectId: string) => {
    console.log('Submitting work for project:', projectId);
  };

  const handleRequestRevision = (projectId: string) => {
    console.log('Requesting revision for project:', projectId);
  };

  return (
    <Tabs defaultValue="featured">
      <TabsList className="mb-6">
        <TabsTrigger value="featured" data-value="featured">Available Projects</TabsTrigger>
        <TabsTrigger value="applications" data-value="applications">Your Applications</TabsTrigger>
        <TabsTrigger value="active" data-value="active">Active Projects</TabsTrigger>
        <TabsTrigger value="payments" data-value="payments">Payments</TabsTrigger>
        <TabsTrigger value="reviews" data-value="reviews">Reviews</TabsTrigger>
      </TabsList>
      
      <TabsContent value="featured">
        <AvailableProjectsTab 
          isLoading={isLoading}
          projects={projects}
          applications={applications}
          skills={skills}
          setSelectedProject={setSelectedProject}
          setBidAmount={setBidAmount}
        />
        {selectedProject && (
          <ProjectApplicationForm
            selectedProject={selectedProject}
            projects={projects}
            coverLetter={coverLetter}
            setCoverLetter={setCoverLetter}
            bidAmount={bidAmount}
            setBidAmount={setBidAmount}
            availability={availability}
            setAvailability={setAvailability}
            isApplying={isApplying}
            handleApplyToProject={handleApplyToProject}
            onCancel={onCancelApplication}
            userSkills={skills}
          />
        )}
      </TabsContent>
      
      <TabsContent value="applications">
        <ApplicationsTab 
          isLoading={isLoading} 
          applications={applications}
          projects={projects}
        />
      </TabsContent>
      
      <TabsContent value="active">
        <ActiveProjectsTab 
          isLoading={isLoading}
          projects={projects.filter(p => ['assigned', 'in_progress', 'work_submitted', 'work_revision_requested'].includes(p.status || ''))}
          onViewProject={handleViewProject}
          onUpdateProjectStatus={handleUpdateProjectStatus}
          onSubmitWork={handleSubmitWork}
          onRequestRevision={handleRequestRevision}
          markProjectComplete={markProjectComplete}
          isSubmitting={isSubmitting}
        />
      </TabsContent>
      
      <TabsContent value="payments">
        <PaymentsTab 
          isLoading={isLoading}
          payments={payments}
          paymentSummary={calculatePaymentTotals()}
        />
      </TabsContent>
      
      <TabsContent value="reviews">
        <ReviewsTab 
          isLoading={isLoading}
          reviews={reviews}
          averageRating={calculateAverageRating()}
          totalReviews={reviews.length}
        />
      </TabsContent>
    </Tabs>
  );
};
