
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
  userId,
  isLoading,
  projects,
  applications,
  payments,
  reviews,
  skills,
  profile,
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
  updateProfile,
  isEditing,
  setIsEditing,
  isSubmitting,
  onCancelApplication
}) => {
  const handleViewProject = (projectId: string) => {
    // Navigate to project details or handle view logic
    console.log('Viewing project:', projectId);
  };

  const handleUpdateProjectStatus = async (projectId: string, status: string) => {
    // Update project status logic
    console.log('Updating project status:', projectId, status);
  };

  const handleSubmitWork = (projectId: string) => {
    // Submit work logic
    console.log('Submitting work for project:', projectId);
  };

  const handleRequestRevision = (projectId: string) => {
    // Request revision logic
    console.log('Requesting revision for project:', projectId);
  };

  const activeProjects = projects.filter(project => 
    ['assigned', 'in_progress', 'work_submitted', 'work_revision_requested'].includes(project.status || '')
  );

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
          userId={userId}
        />
      </TabsContent>
      
      <TabsContent value="active">
        <ActiveProjectsTab 
          isLoading={isLoading}
          projects={activeProjects}
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
          userId={userId}
          isLoading={isLoading}
          projects={projects}
          applications={applications}
          payments={payments}
          reviews={reviews}
          skills={skills}
          profile={profile}
          markProjectComplete={markProjectComplete}
          calculateAverageRating={calculateAverageRating}
          calculatePaymentTotals={calculatePaymentTotals}
          updateProfile={updateProfile}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          isSubmitting={isSubmitting}
          paymentSummary={calculatePaymentTotals()}
        />
      </TabsContent>
      
      <TabsContent value="reviews">
        <ReviewsTab 
          userId={userId}
          isLoading={isLoading}
          projects={projects}
          applications={applications}
          payments={payments}
          reviews={reviews}
          skills={skills}
          profile={profile}
          markProjectComplete={markProjectComplete}
          calculateAverageRating={calculateAverageRating}
          calculatePaymentTotals={calculatePaymentTotals}
          updateProfile={updateProfile}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          isSubmitting={isSubmitting}
        />
      </TabsContent>
    </Tabs>
  );
};
