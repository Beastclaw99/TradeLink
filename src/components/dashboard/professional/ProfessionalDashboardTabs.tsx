
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AvailableProjectsTab } from './AvailableProjectsTab';
import ApplicationsTab from './ApplicationsTab';
import ActiveProjectsTab from './ActiveProjectsTab';
import PaymentsTab from './PaymentsTab';
import ReviewsTab from './ReviewsTab';
import ProjectApplicationForm from './ProjectApplicationForm';
import { Project, Application, Payment, Review } from '../types';

interface ProjectWithMilestones extends Project {
  timeline: string;
  spent: number;
}

interface ProfessionalDashboardTabsProps {
  isLoading: boolean;
  projects: Project[];
  applications: Application[];
  payments: Payment[];
  reviews: Review[];
  skills?: string[];
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
    // Navigate to project details or show project details
    console.log('Viewing project:', projectId);
  };

  const handleUpdateProjectStatus = async (projectId: string, status: string) => {
    // Update project status
    console.log('Updating project status:', projectId, status);
  };

  const handleSubmitWork = (projectId: string) => {
    // Submit work for project
    console.log('Submitting work for project:', projectId);
  };

  const handleRequestRevision = (projectId: string) => {
    // Request revision for project
    console.log('Requesting revision for project:', projectId);
  };

  // Transform projects to include required timeline and spent properties
  const projectsWithMilestones: ProjectWithMilestones[] = projects.map(project => ({
    ...project,
    timeline: project.timeline || 'Not specified',
    spent: typeof project.spent === 'number' ? project.spent : 0
  }));

  // Transform reviews to ensure rating is never null
  const reviewsWithRatings = reviews.map(review => ({
    ...review,
    rating: review.rating || 0
  }));

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
          projects={projectsWithMilestones.filter(p => ['assigned', 'in_progress', 'work_submitted', 'work_revision_requested'].includes(p.status || ''))}
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
          reviews={reviewsWithRatings}
          averageRating={calculateAverageRating()}
          totalReviews={reviews.length}
        />
      </TabsContent>
    </Tabs>
  );
};
