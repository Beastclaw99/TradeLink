import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfessionalDashboard } from "@/hooks/useProfessionalDashboard";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ProfessionalSidebar from './ProfessionalSidebar';
import { ProjectList } from './professional/ProjectList';
import { ApplicationList } from './professional/ApplicationList';
import { PaymentList } from './professional/PaymentList';
import { ReviewList } from './professional/ReviewList';
import ProjectApplicationForm from './professional/ProjectApplicationForm';
import DashboardError from './professional/DashboardError';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

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
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  
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
    editProject,
    projectToDelete,
    editedProject,
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
    handleApplicationUpdate,
  } = useProfessionalDashboard(userId);

  const { user } = useAuth();

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
      const { error } = await supabase
        .from('projects')
        .update({ status: 'completed' })
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

  const updateProfile = async (data: { skills: string[] }) => {
    try {
      setIsSubmitting(true);
      
      // Update profile with new skills
      const { data: updatedProfileInfo, error: profileUpdateError } = await supabase
        .from('profiles')
        .update({
          skills: data.skills,
        })
        .eq('id', userId)
        .select()
        .single();
      
      if (profileUpdateError) throw profileUpdateError;
      
      toast({
        title: "Profile updated",
        description: "Your skills have been updated successfully!",
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

  if (error) {
    return <DashboardError error={error} isLoading={isLoading} onRetry={fetchDashboardData} />;
  }

  return (
    <div className="flex h-screen">
      <ProfessionalSidebar onExpand={setIsSidebarExpanded} />
      <main className={cn(
        "flex-1 overflow-y-auto p-8 transition-all duration-300",
        isSidebarExpanded ? "mr-64" : "mr-16"
      )}>
        <Tabs defaultValue="available" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="available">Available Projects</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="active">Active Projects</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="available">
            <ProjectList
              projects={projects.filter(p => p.status === 'open')}
              isLoading={isLoading}
              onApply={setSelectedProject}
            />
          </TabsContent>

          <TabsContent value="applications">
            <ApplicationList
              applications={applications}
              isLoading={isLoading}
              onApplicationUpdate={handleApplicationUpdate}
            />
          </TabsContent>

          <TabsContent value="active">
            <ProjectList
              projects={projects.filter(p => p.status === 'assigned' || p.status === 'in-progress')}
              isLoading={isLoading}
              onComplete={markProjectComplete}
            />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentList
              payments={payments}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>

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
      </main>
    </div>
  );
};

export default ProfessionalDashboard;
