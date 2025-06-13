import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Project, Application, Payment, Review, Profile, Milestone, Task } from '@/types/database';
import { 
  transformProjects, 
  transformApplications, 
  transformPayments, 
  transformReviews 
} from './dataTransformers';

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
        .select(`
          id,
          first_name,
          last_name,
          account_type,
          email,
          phone,
          bio,
          location,
          profile_image_url,
          rating,
          completed_projects,
          response_rate,
          on_time_completion,
          profile_visibility,
          show_email,
          show_phone,
          allow_messages,
          verification_status,
          years_of_experience,
          portfolio_images,
          created_at,
          updated_at,
          business_name,
          business_description,
          service_areas,
          specialties,
          insurance_info,
          license_number,
          is_available,
          role,
          address,
          city,
          state,
          country,
          zip_code
        `)
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch projects with related data
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select(`
          *,
          professional:profiles!projects_professional_id_fkey(
            id,
            first_name,
            last_name,
            profile_image_url,
            rating
          )
        `)
        .eq('client_id', userId);

      if (projectsError) throw projectsError;
      const transformedProjects = transformProjects(projectsData || []);
      setProjects(transformedProjects);

      // Initialize empty arrays for related data
      setApplications([]);
      setPayments([]);
      setReviews([]);
      setMilestones([]);
      setTasks([]);

      // Only fetch related data if there are projects
      if (transformedProjects.length > 0) {
        const projectIds = transformedProjects.map(p => p.id);

        // Fetch applications
        const { data: applicationsData, error: applicationsError } = await supabase
          .from('applications')
          .select(`
            *,
            professional:profiles!applications_professional_id_fkey(
              id,
              first_name,
              last_name,
              profile_image_url,
              rating
            )
          `)
          .in('project_id', projectIds);

        if (applicationsError) throw applicationsError;
        const transformedApplications = transformApplications(applicationsData || []);
        setApplications(transformedApplications);

        // Fetch payments
        const { data: paymentsData, error: paymentsError } = await supabase
          .from('payments')
          .select(`
            *,
            professional:profiles!payments_professional_id_fkey(
              id,
              first_name,
              last_name
            )
          `)
          .in('project_id', projectIds);

        if (paymentsError) throw paymentsError;
        const transformedPayments = transformPayments(paymentsData || []);
        setPayments(transformedPayments);

        // Fetch reviews
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select(`
            *,
            professional:profiles!reviews_professional_id_fkey(
              id,
              first_name,
              last_name
            )
          `)
          .in('project_id', projectIds);

        if (reviewsError) throw reviewsError;
        const transformedReviews = transformReviews(reviewsData || []);
        setReviews(transformedReviews);

        // Fetch milestones
        const { data: milestonesData, error: milestonesError } = await supabase
          .from('project_milestones')
          .select('*')
          .in('project_id', projectIds);

        if (milestonesError) throw milestonesError;
        setMilestones(milestonesData || []);

        // Fetch tasks if there are milestones
        if (milestonesData && milestonesData.length > 0) {
          const milestoneIds = milestonesData.map(m => m.id);
          const { data: tasksData, error: tasksError } = await supabase
            .from('project_tasks')
            .select(`
              *,
              assignee:profiles!project_tasks_assignee_id_fkey(
                id,
                first_name,
                last_name
              )
            `)
            .in('milestone_id', milestoneIds);

          if (tasksError) throw tasksError;
          setTasks(tasksData || []);
        }
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
    projects,
    applications,
    payments,
    reviews,
    profile,
    milestones,
    tasks,
    isLoading,
    error,
    fetchDashboardData: fetchData
  };
}; 