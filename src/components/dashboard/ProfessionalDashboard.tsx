import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfessionalDashboard } from "@/hooks/useProfessionalDashboard";
import AvailableProjectsTab from './professional/AvailableProjectsTab';
import ApplicationsTab from './professional/ApplicationsTab';
import ActiveProjectsTab from './professional/ActiveProjectsTab';
import PaymentsTab from './professional/PaymentsTab';
import ReviewsTab from './professional/ReviewsTab';
import ProjectApplicationForm from './professional/ProjectApplicationForm';
import DashboardError from './professional/DashboardError';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProfessionalDashboardProps {
  userId: string;
}

const ProfessionalDashboard: React.FC<ProfessionalDashboardProps> = ({ userId }) => {
  const { toast } = useToast();
  const [isApplying, setIsApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [bidAmount, setBidAmount] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [availability, setAvailability] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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

  const handleApplyToProject = async () => {
    if (!selectedProject || !coverLetter.trim() || bidAmount === null) {
      toast({
        title: "Missing information",
        description: "Please provide both a bid amount and proposal message",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsApplying(true);
      
      // Check if project is still open before applying
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('status')
        .eq('id', selectedProject)
        .single();
        
      if (projectError) throw projectError;
      
      if (projectData.status !== 'open') {
        toast({
          title: "Project Unavailable",
          description: "This project is no longer accepting applications.",
          variant: "destructive"
        });
        setSelectedProject(null);
        setCoverLetter('');
        setBidAmount(null);
        setAvailability('');
        return;
      }
      
      const { data, error } = await supabase
        .from('applications')
        .insert([
          {
            project_id: selectedProject,
            professional_id: userId,
            cover_letter: coverLetter,
            bid_amount: bidAmount,
            proposal_message: coverLetter,
            availability: availability,
            status: 'pending'
          }
        ])
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully!"
      });
      
      // Reset form
      setCoverLetter('');
      setSelectedProject(null);
      setBidAmount(null);
      setAvailability('');
      
      // Refresh data
      fetchDashboardData();
      
    } catch (error: any) {
      console.error('Error applying to project:', error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsApplying(false);
    }
  };

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

  const updateProfile = async (data: { 
    skills?: string[];
    hourly_rate?: number;
    availability?: string;
    bio?: string;
    location?: string;
    show_email?: boolean;
    show_phone?: boolean;
    allow_messages?: boolean;
  }) => {
    try {
      setIsSubmitting(true);
      
      // Update profile with all provided fields
      const { data: updatedProfileInfo, error: profileUpdateError } = await supabase
        .from('profiles')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();
      
      if (profileUpdateError) throw profileUpdateError;
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully!",
      });
      
      setIsEditing(false);
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelApplication = () => {
    setSelectedProject(null);
    setCoverLetter('');
    setBidAmount(null);
    setAvailability('');
  };

  // Pass shared state and handlers to the tab components
  const sharedProps = {
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
    isApplying,
    handleApplyToProject,
    markProjectComplete,
    calculateAverageRating,
    calculatePaymentTotals,
    updateProfile,
    isEditing,
    setIsEditing,
    isSubmitting
  };

  if (error) {
    return <DashboardError error={error} isLoading={isLoading} onRetry={fetchDashboardData} />;
  }

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
        <AvailableProjectsTab {...sharedProps} />
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
            onCancel={cancelApplication}
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

export default ProfessionalDashboard;
