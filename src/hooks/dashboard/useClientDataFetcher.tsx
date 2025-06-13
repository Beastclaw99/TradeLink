import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Project, Application, Payment, Review, Profile, Milestone, Task } from '@/types/database';

export const useClientDataFetcher = (userId: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('client_id', userId);

      if (projectsError) throw projectsError;
      setProjects(projectsData || []);

      // Fetch applications for all projects
      const projectIds = projectsData?.map(p => p.id) || [];
      if (projectIds.length > 0) {
        const { data: applicationsData, error: applicationsError } = await supabase
          .from('applications')
          .select('*')
          .in('project_id', projectIds);

        if (applicationsError) throw applicationsError;
        setApplications(applicationsData || []);
      }

      // Fetch payments for all projects
      if (projectIds.length > 0) {
        const { data: paymentsData, error: paymentsError } = await supabase
          .from('payments')
          .select('*')
          .in('project_id', projectIds);

        if (paymentsError) throw paymentsError;
        setPayments(paymentsData || []);
      }

      // Fetch reviews for all projects
      if (projectIds.length > 0) {
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('*')
          .in('project_id', projectIds);

        if (reviewsError) throw reviewsError;
        setReviews(reviewsData || []);
      }

      // Fetch milestones for all projects
      if (projectIds.length > 0) {
        const { data: milestonesData, error: milestonesError } = await supabase
          .from('milestones')
          .select('*')
          .in('project_id', projectIds);

        if (milestonesError) throw milestonesError;
        setMilestones(milestonesData || []);
      }

      // Fetch tasks for all milestones
      const milestoneIds = milestonesData?.map(m => m.id) || [];
      if (milestoneIds.length > 0) {
        const { data: tasksData, error: tasksError } = await supabase
          .from('tasks')
          .select('*')
          .in('milestone_id', milestoneIds);

        if (tasksError) throw tasksError;
        setTasks(tasksData || []);
      }

    } catch (error: any) {
      console.error('Error fetching data:', error);
      setError(error.message);
      toast({
        title: "Error",
        description: error.message || 'Failed to fetch data',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  return {
    isLoading,
    error,
    profile,
    projects,
    applications,
    payments,
    reviews,
    milestones,
    tasks,
    refreshData: fetchData
  };
}; 