
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Database } from '@/integrations/supabase/types';
import { 
  transformProjects, 
  transformApplications, 
  transformPayments, 
  transformReviews,
  transformClient
} from './dataTransformers';

type Project = Database['public']['Tables']['projects']['Row'];
type Application = Database['public']['Tables']['applications']['Row'];
type Payment = Database['public']['Tables']['payments']['Row'];
type Review = Database['public']['Tables']['reviews']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

export const useClientDataFetcher = (userId: string) => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching client dashboard data for user:', userId);
      
      // Fetch client profile with all necessary fields
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select(`
          id,
          first_name,
          last_name,
          account_type,
          email,
          phone,
          location,
          profile_image_url,
          rating,
          bio,
          created_at,
          updated_at,
          verification_status,
          profile_visibility,
          show_email,
          show_phone,
          allow_messages,
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
      
      if (profileError) {
        console.error('Profile fetch error:', profileError);
        throw profileError;
      }
      
      if (!profileData) {
        throw new Error('Profile not found');
      }
      
      console.log('Profile data:', profileData);
      setProfile(transformClient(profileData));
      
      // Fetch client's projects with related data
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select(`
          *,
          client:profiles!projects_client_id_fkey (
            id,
            first_name,
            last_name,
            profile_image_url
          ),
          professional:profiles!projects_professional_id_fkey (
            id,
            first_name,
            last_name,
            rating,
            profile_image_url
          ),
          milestones:project_milestones (
            id,
            title,
            description,
            due_date,
            status
          ),
          deliverables:project_deliverables (
            id,
            description,
            deliverable_type,
            content,
            file_url,
            status,
            created_at
          )
        `)
        .eq('client_id', userId)
        .order('created_at', { ascending: false });
      
      if (projectsError) {
        console.error('Projects fetch error:', projectsError);
        throw projectsError;
      }

      // Transform and set projects
      const transformedProjects = transformProjects(projectsData || []);
      setProjects(transformedProjects);
      
      // Fetch applications for client's projects with professional details
      if (transformedProjects.length > 0) {
        const projectIds = transformedProjects.map(p => p.id);
        
        const { data: applicationsData, error: applicationsError } = await supabase
          .from('applications')
          .select(`
            *,
            professional:profiles!applications_professional_id_fkey (
              id,
              first_name,
              last_name,
              rating,
              profile_image_url
            ),
            project:projects!applications_project_id_fkey (
              id,
              title,
              status,
              budget,
              created_at
            )
          `)
          .in('project_id', projectIds)
          .order('created_at', { ascending: false });
        
        if (applicationsError) {
          console.error('Applications fetch error:', applicationsError);
          throw applicationsError;
        }
        
        setApplications(transformApplications(applicationsData || []));
      } else {
        setApplications([]);
      }
      
      // Fetch payments
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select(`
          *,
          project:projects(
            id,
            title,
            status,
            budget
          ),
          professional:profiles!payments_professional_id_fkey(
            id,
            first_name,
            last_name,
            profile_image_url
          )
        `)
        .eq('client_id', userId);
      
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
        .eq('client_id', userId);
      
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
    profile,
    isLoading,
    error,
    fetchDashboardData
  };
};
