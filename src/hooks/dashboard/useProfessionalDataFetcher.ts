import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Database } from '@/integrations/supabase/types';
import { 
  transformProjects, 
  transformApplications, 
  transformPayments, 
  transformReviews 
} from './dataTransformers';
import { filterProjectsBySkills } from './projectFilters';

type Project = Database['public']['Tables']['projects']['Row'];
type Application = Database['public']['Tables']['applications']['Row'];
type Payment = Database['public']['Tables']['payments']['Row'];
type Review = Database['public']['Tables']['reviews']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];
type ProjectStatus = Database['public']['Enums']['project_status_enum'];

export const useProfessionalDataFetcher = (userId: string) => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching professional dashboard data for user:', userId);
      
      // Fetch profile with all necessary fields
      const { data: userProfileData, error: userProfileError } = await supabase
        .from('profiles')
        .select(`
          id,
          first_name,
          last_name,
          account_type,
          skills,
          rating,
          bio,
          phone,
          email,
          location,
          hourly_rate,
          availability,
          certifications,
          completed_projects,
          response_rate,
          on_time_completion,
          profile_visibility,
          show_email,
          show_phone,
          allow_messages,
          profile_image_url,
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
      
      if (userProfileError) {
        console.error('Profile fetch error:', userProfileError);
        throw userProfileError;
      }
      
      if (!userProfileData) {
        throw new Error('Profile not found');
      }
      
      console.log('Profile data:', userProfileData);
      
      const userSkills = userProfileData?.skills || [];
      setSkills(userSkills);
      setProfile(userProfileData);
      
      // Fetch open projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select(`
          *,
          client:profiles!projects_client_id_fkey(
            id,
            first_name,
            last_name,
            profile_image_url,
            rating
          )
        `)
        .eq('status', 'open' as ProjectStatus);
      
      if (projectsError) {
        console.error('Projects fetch error:', projectsError);
        throw projectsError;
      }
      
      console.log('Projects data:', projectsData);
      
      const filteredProjects = filterProjectsBySkills(projectsData || [], userSkills);
      
      // Fetch assigned projects
      const { data: assignedProjectsData, error: assignedProjectsError } = await supabase
        .from('projects')
        .select(`
          *,
          client:profiles!projects_client_id_fkey(
            id,
            first_name,
            last_name,
            profile_image_url,
            rating
          )
        `)
        .eq('assigned_to', userId)
        .in('status', ['assigned', 'in_progress', 'completed'] as ProjectStatus[]);
        
      if (assignedProjectsError) {
        console.error('Assigned projects fetch error:', assignedProjectsError);
        throw assignedProjectsError;
      }
      
      console.log('Assigned projects data:', assignedProjectsData);
      
      const allProjects = [
        ...transformProjects(filteredProjects), 
        ...transformProjects(assignedProjectsData || [])
      ];
      setProjects(allProjects);
      
      // Fetch applications
      try {
        const { data: appsData, error: appsError } = await supabase
          .from('applications')
          .select(`
            id,
            created_at,
            status,
            bid_amount,
            cover_letter,
            professional_id,
            project_id,
            availability,
            proposal_message,
            updated_at,
            project:projects (
              id,
              title,
              status,
              budget,
              created_at
            )
          `)
          .eq('professional_id', userId);
        
        if (appsError) {
          console.error('Applications fetch error:', appsError);
          throw appsError;
        }
        
        const transformedApps = transformApplications(appsData || []);
        setApplications(transformedApps);
      } catch (error) {
        console.error('Error fetching applications:', error);
        throw error;
      }
      
      // Fetch payments
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select(`
          *,
          project:projects (
            id,
            title
          ),
          professional:profiles!payments_professional_id_fkey (
            id,
            first_name,
            last_name
          )
        `)
        .eq('professional_id', userId);
      
      if (paymentsError) {
        console.error('Payments fetch error:', paymentsError);
        throw paymentsError;
      }
      
      const transformedPayments = transformPayments(paymentsData || []);
      setPayments(transformedPayments);
      
      // Fetch reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('*')
        .eq('professional_id', userId);
      
      if (reviewsError) {
        console.error('Reviews fetch error:', reviewsError);
        throw reviewsError;
      }
      
      const transformedReviews = transformReviews(reviewsData || []);
      setReviews(transformedReviews);
      
    } catch (error: any) {
      console.error('Dashboard data fetch error:', error);
      setError(error.message);
      toast({
        title: "Error",
        description: error.message || 'Failed to fetch dashboard data',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    projects,
    applications,
    payments,
    reviews,
    skills,
    profile,
    isLoading,
    error,
    fetchDashboardData
  };
};
