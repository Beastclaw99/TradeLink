
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
  setBidAmount: (value: number) => void;
  selectedProject: string | null;
  setSelectedProject: (projectId: string | null) => void;
  availability: string;
  setAvailability: (value: string) => void;
  isApplying: boolean;
  handleApplyToProject: () => void;
  markProjectComplete: (projectId: string) => void;
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
  const sharedProps = {
    userId,
    isLoading,
    projects,
    applications,
    payments,
    reviews,
    skills,
    profile,
    markProjectComplete,
    calculateAverageRating,
    calculatePaymentTotals,
    updateProfile,
    isEditing,
    setIsEditing,
    isSubmitting
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
          userId={userId}
        />
      </TabsContent>
      
      <TabsContent value="active">
        <ActiveProjectsTab {...sharedProps} />
      </TabsContent>
      
      <TabsContent value="payments">
        <PaymentsTab {...sharedProps} />
      </TabsContent>
      
      <TabsContent value="reviews">
        <ReviewsTab {...sharedProps} />
      </TabsContent>
    </Tabs>
  );
};
