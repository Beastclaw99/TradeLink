
import React from 'react';
import { useProfessionalDashboard } from "@/hooks/useProfessionalDashboard";
import { useProfessionalProjectActions } from "@/hooks/dashboard/useProfessionalProjectActions";
import { useProfessionalProfileActions } from "@/hooks/dashboard/useProfessionalProfileActions";
import { ProfessionalDashboardTabs } from './professional/ProfessionalDashboardTabs';
import DashboardError from './professional/DashboardError';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ProfessionalDashboardProps {
  userId: string;
}

// Helper function to convert database project to expected Project type
const convertToProjectType = (dbProject: any): any => ({
  ...dbProject,
  expected_timeline: dbProject.timeline, // Map timeline to expected_timeline
  milestones: [],
  updates: [],
  applications: [],
  reviews: [],
  disputes: [],
  invoices: [],
  messages: [],
  notifications: []
});

const ProfessionalDashboard: React.FC<ProfessionalDashboardProps> = ({ userId }) => {
  const { toast } = useToast();
  
  const {
    projects: rawProjects,
    applications: rawApplications,
    payments,
    reviews: rawReviews,
    skills,
    profile,
    isLoading,
    error,
    fetchDashboardData,
    calculateAverageRating,
    calculatePaymentTotals,
  } = useProfessionalDashboard(userId);

  // Convert projects to expected format
  const projects = rawProjects.map(convertToProjectType);

  // Convert applications to ensure proper types with null safety and provide defaults
  const applications = rawApplications.map(app => ({
    ...app,
    project_id: app.project_id || '',
    professional_id: app.professional_id || '',
    status: app.status as 'pending' | 'accepted' | 'rejected' | 'withdrawn' | null,
    created_at: app.created_at || new Date().toISOString(),
    updated_at: app.updated_at || new Date().toISOString() // Provide default for null updated_at
  }));

  // Convert reviews to ensure proper types with null safety
  const reviews = rawReviews.map(review => ({
    ...review,
    status: (review.status as 'pending' | 'rejected' | 'approved' | 'reported' | null) || 'pending',
    is_verified: review.is_verified || false
  }));

  const {
    isApplying,
    coverLetter,
    setCoverLetter,
    bidAmount,
    setBidAmount,
    selectedProject,
    setSelectedProject,
    availability,
    setAvailability,
    handleApplyToProject,
    cancelApplication
  } = useProfessionalProjectActions(userId, fetchDashboardData);

  const {
    isEditing,
    setIsEditing,
    isSubmitting,
    updateProfile
  } = useProfessionalProfileActions(userId, fetchDashboardData);

  const markProjectComplete = async (projectId: string) => {
    try {
      // First check if all milestones are complete
      const { data: milestones, error: milestonesError } = await supabase
        .from('project_milestones')
        .select('*')
        .eq('project_id', projectId);
        
      if (milestonesError) throw milestonesError;
      
      const incompleteMilestones = milestones?.filter(m => !m.is_complete);
      if (incompleteMilestones?.length > 0) {
        toast({
          title: "Cannot Complete Project",
          description: "All milestones must be completed before marking the project as complete.",
          variant: "destructive"
        });
        return;
      }
      
      // Update project status
      const { error } = await supabase
        .from('projects')
        .update({ 
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId)
        .eq('assigned_to', userId);
      
      if (error) throw error;
      
      toast({
        title: "Project Completed",
        description: "The project has been marked as completed. The client can now leave a review."
      });
      
      fetchDashboardData();
    } catch (error: any) {
      console.error('Error completing project:', error);
      toast({
        title: "Error",
        description: "Failed to mark project as completed.",
        variant: "destructive"
      });
    }
  };

  if (error) {
    return <DashboardError error={error} isLoading={isLoading} onRetry={fetchDashboardData} />;
  }

  return (
    <ProfessionalDashboardTabs
      userId={userId}
      isLoading={isLoading}
      projects={projects}
      applications={applications}
      payments={payments}
      reviews={reviews}
      skills={skills}
      profile={profile}
      coverLetter={coverLetter}
      setCoverLetter={setCoverLetter}
      bidAmount={bidAmount}
      setBidAmount={setBidAmount}
      selectedProject={selectedProject}
      setSelectedProject={setSelectedProject}
      availability={availability}
      setAvailability={setAvailability}
      isApplying={isApplying}
      handleApplyToProject={handleApplyToProject}
      markProjectComplete={markProjectComplete}
      calculateAverageRating={calculateAverageRating}
      calculatePaymentTotals={calculatePaymentTotals}
      updateProfile={updateProfile}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
      isSubmitting={isSubmitting}
      onCancelApplication={cancelApplication}
    />
  );
};

export default ProfessionalDashboard;
