
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

const ProfessionalDashboard: React.FC<ProfessionalDashboardProps> = ({ userId }) => {
  const { toast } = useToast();
  
  const {
    projects,
    applications,
    payments,
    reviews,
    skills,
    profile,
    isLoading,
    error,
    fetchDashboardData,
    calculateAverageRating,
    calculatePaymentTotals,
  } = useProfessionalDashboard(userId);

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

  // Fix the return type mismatch for calculateAverageRating
  const wrappedCalculateAverageRating = (): number => {
    const result = calculateAverageRating();
    return typeof result === 'string' ? parseFloat(result) || 0 : result;
  };

  // Fix the return type mismatch for calculatePaymentTotals
  const wrappedCalculatePaymentTotals = () => {
    const totals = calculatePaymentTotals();
    return {
      total: totals.received + totals.pending,
      pending: totals.pending,
      completed: totals.received
    };
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
      calculateAverageRating={wrappedCalculateAverageRating}
      calculatePaymentTotals={wrappedCalculatePaymentTotals}
      updateProfile={updateProfile}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
      isSubmitting={isSubmitting}
      onCancelApplication={cancelApplication}
    />
  );
};

export default ProfessionalDashboard;
