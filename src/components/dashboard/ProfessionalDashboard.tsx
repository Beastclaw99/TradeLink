
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Star, Briefcase, FileText } from "lucide-react";
import { 
  Project, 
  Application, 
  Payment, 
  Review
} from './types';
import { Badge } from "@/components/ui/badge";
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
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, [userId]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // First get the professional's profile to get their skills
      const { data: userProfileData, error: userProfileError } = await supabase
        .from('profiles')
        .select('skills')
        .eq('id', userId)
        .single();
      
      if (userProfileError) throw userProfileError;
      
      // Set skills array or default to empty array
      const userSkills = userProfileData?.skills || [];
      setSkills(userSkills);
      
      // Fetch projects that match skills (if skills are available) and are open
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select(`
          *,
          client:profiles!projects_client_id_fkey(first_name, last_name)
        `)
        .eq('status', 'open');
      
      if (projectsError) throw projectsError;
      
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
      
      if (appsError) throw appsError;
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
        
      if (assignedProjectsError) throw assignedProjectsError;
      
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
      
      if (paymentsError) throw paymentsError;
      
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
      
      if (reviewsError) throw reviewsError;
      setReviews(reviewsData || []);
      
      // Fetch the professional's profile
      const { data: profileInfo, error: profileFetchError } = await supabase
        .from('profiles')
        .select('first_name, last_name, skills, created_at')
        .eq('id', userId)
        .single();
      
      if (profileFetchError) throw profileFetchError;
      
      setProfile(profileInfo);
      
    } catch (error: any) {
      console.error('Error fetching data:', error);
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
    if (!selectedProject || !coverLetter.trim()) {
      toast({
        title: "Missing information",
        description: "Please write a cover letter for your application",
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
        return;
      }
      
      const { data, error } = await supabase
        .from('applications')
        .insert([
          {
            project_id: selectedProject,
            professional_id: userId,
            cover_letter: coverLetter,
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

  return (
    <Tabs defaultValue="featured">
      <TabsList className="mb-6">
        <TabsTrigger value="featured">Available Projects</TabsTrigger>
        <TabsTrigger value="applications">Your Applications</TabsTrigger>
        <TabsTrigger value="active">Active Projects</TabsTrigger>
        <TabsTrigger value="payments">Payments</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
        <TabsTrigger value="profile">Profile</TabsTrigger>
      </TabsList>
      
      <TabsContent value="featured">
        <AvailableProjectsTab {...sharedProps} />
      </TabsContent>
      
      <TabsContent value="applications">
        <ApplicationsTab {...sharedProps} />
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
