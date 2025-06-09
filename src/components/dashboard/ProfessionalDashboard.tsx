import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfessionalDashboard } from "@/hooks/useProfessionalDashboard";
import { useApplicationNotifications } from "@/hooks/useApplicationNotifications";
import AvailableProjectsTab from './professional/AvailableProjectsTab';
import ApplicationsTab from './professional/ApplicationsTab';
import ActiveProjectsTab from './professional/ActiveProjectsTab';
import PaymentsTab from './professional/PaymentsTab';
import ReviewsTab from './professional/ReviewsTab';
import ProjectApplicationForm from './professional/ProjectApplicationForm';
import DashboardError from './professional/DashboardError';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProjectList } from '@/components/project/ProjectList';
import { ApplicationList } from '@/components/application/ApplicationList';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface ProfessionalDashboardProps {
  professionalId: string;
}

const ProfessionalDashboard: React.FC<ProfessionalDashboardProps> = ({ professionalId }) => {
  const { toast } = useToast();
  
  // Use the application notifications hook
  useApplicationNotifications();
  
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
    stats,
    recentActivity,
    refreshData
  } = useProfessionalDashboard(professionalId);

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
            professional_id: professionalId,
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
        .eq('assigned_to', professionalId);
      
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
        .eq('id', professionalId)
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

  // Pass shared state and handlers to the tab components
  const sharedProps = {
    professionalId,
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
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-destructive">Error Loading Dashboard</h3>
              <p className="mt-2 text-sm text-muted-foreground">{error}</p>
              <button
                onClick={refreshData}
                className="mt-4 text-sm text-primary hover:underline"
              >
                Try Again
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Professional Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your projects and applications
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardStats stats={stats} />
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentActivity activities={recentActivity} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <button
                onClick={() => window.location.href = '/projects/browse'}
                className="flex items-center justify-center rounded-lg border p-4 hover:bg-accent"
              >
                Browse Projects
              </button>
              <button
                onClick={() => window.location.href = '/applications'}
                className="flex items-center justify-center rounded-lg border p-4 hover:bg-accent"
              >
                View Applications
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Tabs defaultValue="projects" className="w-full">
          <TabsList>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>
          <TabsContent value="projects">
            <ProjectList
              projects={projects}
              onProjectUpdate={refreshData}
            />
          </TabsContent>
          <TabsContent value="applications">
            <ApplicationList
              applications={applications}
              onApplicationUpdate={refreshData}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;
