
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Project, 
  Application, 
  Payment, 
  Review
} from './types';
import AvailableProjectsTab from './professional/AvailableProjectsTab';
import ApplicationsTab from './professional/ApplicationsTab';
import ActiveProjectsTab from './professional/ActiveProjectsTab';
import PaymentsTab from './professional/PaymentsTab';
import ReviewsTab from './professional/ReviewsTab';
import ProfileTab from './professional/ProfileTab';

interface ProfessionalDashboardProps {
  userId: string;
}

const ProfessionalDashboard: React.FC<ProfessionalDashboardProps> = ({ userId }) => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [bidAmount, setBidAmount] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, [userId]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Fetching professional dashboard data for user:', userId);
      
      // First get the professional's profile to get their skills
      const { data: userProfileData, error: userProfileError } = await supabase
        .from('profiles')
        .select('skills, first_name, last_name, created_at')
        .eq('id', userId)
        .single();
      
      if (userProfileError) {
        console.error('Profile fetch error:', userProfileError);
        throw userProfileError;
      }
      
      console.log('Profile data:', userProfileData);
      
      // Set skills array or default to empty array
      const userSkills = userProfileData?.skills || [];
      setSkills(userSkills);
      setProfile(userProfileData);
      
      // Fetch projects that match skills (if skills are available) and are open
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select(`
          *,
          client:profiles!projects_client_id_fkey(first_name, last_name)
        `)
        .eq('status', 'open');
      
      if (projectsError) {
        console.error('Projects fetch error:', projectsError);
        throw projectsError;
      }
      
      console.log('Projects data:', projectsData);
      
      // Filter projects by skills if skills are available
      let filteredProjects = projectsData || [];
      if (userSkills.length > 0) {
        // This is a simple filter - in real world you might want more complex matching
        filteredProjects = projectsData.filter((project: any) => {
          const projTags = project.tags || [];
          return userSkills.some((skill: string) => 
            projTags.includes(skill) || 
            project.title.toLowerCase().includes(skill.toLowerCase()) ||
            project.description?.toLowerCase().includes(skill.toLowerCase())
          );
        });
      }
      
      setProjects(filteredProjects);
      
      // Fetch applications made by the professional
      const { data: appsData, error: appsError } = await supabase
        .from('applications')
        .select(`
          *,
          project:projects(title, status, budget)
        `)
        .eq('professional_id', userId);
      
      if (appsError) {
        console.error('Applications fetch error:', appsError);
        throw appsError;
      }
      
      console.log('Applications data:', appsData);
      setApplications(appsData || []);
      
      // Fetch assigned projects (status = "assigned" and assigned_to = userId)
      const { data: assignedProjectsData, error: assignedProjectsError } = await supabase
        .from('projects')
        .select(`
          *,
          client:profiles!projects_client_id_fkey(first_name, last_name)
        `)
        .eq('assigned_to', userId)
        .eq('status', 'assigned');
        
      if (assignedProjectsError) {
        console.error('Assigned projects fetch error:', assignedProjectsError);
        throw assignedProjectsError;
      }
      
      console.log('Assigned projects data:', assignedProjectsData);
      
      // Add assigned projects to the professional's view
      if (assignedProjectsData && assignedProjectsData.length > 0) {
        setProjects(prev => [...prev, ...assignedProjectsData]);
      }
      
      // Fetch payments for the professional
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select(`
          *,
          project:projects(title)
        `)
        .eq('professional_id', userId);
      
      if (paymentsError) {
        console.error('Payments fetch error:', paymentsError);
        throw paymentsError;
      }
      
      console.log('Payments data:', paymentsData);
      
      // Ensure each payment has a created_at field
      const paymentsWithDates = (paymentsData || []).map(payment => ({
        ...payment,
        created_at: payment.created_at || new Date().toISOString()
      }));
      
      setPayments(paymentsWithDates);
      
      // Fetch reviews for the professional
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('*')
        .eq('professional_id', userId);
      
      if (reviewsError) {
        console.error('Reviews fetch error:', reviewsError);
        throw reviewsError;
      }
      
      console.log('Reviews data:', reviewsData);
      setReviews(reviewsData || []);
      
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again later.');
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    return (total / reviews.length).toFixed(1);
  };

  const calculatePaymentTotals = () => {
    const received = payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);
    
    const pending = payments
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0);
    
    return { received, pending };
  };

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
            proposal_message: coverLetter, // Using the same field for both for backward compatibility
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
      
      setProfile(updatedProfileInfo);
      
      toast({
        title: "Profile updated",
        description: "Your skills have been updated successfully!",
      });
      
      setIsEditing(false);
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
    return (
      <div className="bg-red-50 border border-red-200 p-4 rounded-md mb-6">
        <p className="text-red-700">{error}</p>
        <Button 
          onClick={fetchDashboardData} 
          variant="outline" 
          className="mt-2"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Try Again"}
        </Button>
      </div>
    );
  }

  return (
    <Tabs defaultValue="featured">
      <TabsList className="mb-6">
        <TabsTrigger value="featured" data-value="featured">Available Projects</TabsTrigger>
        <TabsTrigger value="applications" data-value="applications">Your Applications</TabsTrigger>
        <TabsTrigger value="active" data-value="active">Active Projects</TabsTrigger>
        <TabsTrigger value="payments" data-value="payments">Payments</TabsTrigger>
        <TabsTrigger value="reviews" data-value="reviews">Reviews</TabsTrigger>
        <TabsTrigger value="profile" data-value="profile">Profile</TabsTrigger>
      </TabsList>
      
      <TabsContent value="featured">
        <AvailableProjectsTab {...sharedProps} />
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
      
      <TabsContent value="profile">
        <ProfileTab {...sharedProps} />
      </TabsContent>
    </Tabs>
  );
};

export default ProfessionalDashboard;
