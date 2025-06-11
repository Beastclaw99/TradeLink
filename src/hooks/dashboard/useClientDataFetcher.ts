import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Project, Application, Payment, Review } from '@/components/dashboard/types';
import { 
  transformProjects, 
  transformApplications, 
  transformPayments, 
  transformReviews,
  transformClient
} from './dataTransformers';

export const useClientDataFetcher = (userId: string) => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
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
          profile_image,
          rating,
          total_reviews,
          bio,
          company_name,
          company_size,
          industry,
          website,
          social_media_links,
          notification_preferences,
          language_preferences,
          timezone,
          payment_methods,
          preferred_payment_method,
          tax_information,
          bank_account_details,
          stripe_customer_id,
          created_at,
          updated_at,
          verification_status,
          profile_visibility,
          show_email,
          show_phone,
          allow_messages,
          project_preferences,
          budget_preferences,
          timeline_preferences,
          location_preferences,
          industry_preferences,
          professional_preferences,
          communication_preferences,
          payment_preferences,
          contract_preferences,
          insurance_preferences,
          compliance_preferences,
          security_preferences,
          privacy_preferences,
          data_preferences,
          backup_preferences,
          recovery_preferences,
          support_preferences,
          maintenance_preferences,
          upgrade_preferences,
          downgrade_preferences,
          cancellation_preferences,
          refund_preferences,
          dispute_preferences,
          arbitration_preferences,
          mediation_preferences,
          litigation_preferences,
          settlement_preferences,
          resolution_preferences,
          satisfaction_preferences,
          feedback_preferences,
          review_preferences,
          rating_preferences,
          recommendation_preferences,
          referral_preferences,
          networking_preferences,
          collaboration_preferences,
          partnership_preferences,
          alliance_preferences,
          joint_venture_preferences,
          merger_preferences,
          acquisition_preferences,
          divestiture_preferences,
          restructuring_preferences,
          reorganization_preferences,
          transformation_preferences,
          innovation_preferences,
          research_preferences,
          development_preferences,
          testing_preferences,
          deployment_preferences,
          maintenance_preferences,
          support_preferences,
          training_preferences,
          documentation_preferences,
          reporting_preferences,
          analytics_preferences,
          metrics_preferences,
          kpi_preferences,
          okr_preferences,
          goal_preferences,
          objective_preferences,
          strategy_preferences,
          tactic_preferences,
          plan_preferences,
          execution_preferences,
          implementation_preferences,
          operation_preferences,
          management_preferences,
          leadership_preferences,
          governance_preferences
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
      
      // Fetch client's projects with related data (without the problematic tasks relationship)
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select(`
          *,
          client:client_id (
            id,
            first_name,
            last_name,
            profile_image
          ),
          professional:professional_id (
            id,
            first_name,
            last_name,
            rating,
            profile_image
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
          ),
          applications:applications (
            id,
            status,
            bid_amount,
            cover_letter,
            proposal_message,
            availability,
            created_at,
            updated_at,
            professional:profiles!applications_professional_id_fkey (
              id,
              first_name,
              last_name,
              rating,
              profile_image
            )
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
      
      // Extract and transform applications from projects
      const allApplications = (projectsData || [])
        .flatMap(project => 
          (project.applications || []).map(app => ({
            ...app,
            project: {
              id: project.id,
              title: project.title,
              status: project.status,
              budget: project.budget,
              created_at: project.created_at
            }
          }))
        );
      
      setApplications(transformApplications(allApplications));
      
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
            profile_image
          )
        `)
        .eq('client_id', userId)
        .order('created_at', { ascending: false });
      
      if (paymentsError) {
        console.error('Payments fetch error:', paymentsError);
        throw paymentsError;
      }
      
      setPayments(transformPayments(paymentsData || []));
      
      // Fetch reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select(`
          *,
          project:projects(
            id,
            title,
            status
          ),
          professional:profiles!reviews_professional_id_fkey(
            id,
            first_name,
            last_name,
            profile_image
          )
        `)
        .eq('client_id', userId)
        .order('created_at', { ascending: false });
      
      if (reviewsError) {
        console.error('Reviews fetch error:', reviewsError);
        throw reviewsError;
      }
      
      setReviews(transformReviews(reviewsData || []));
      
    } catch (error: any) {
      console.error('Dashboard data fetch error:', error);
      setError(error.message || 'Failed to load dashboard data');
      toast({
        title: "Error",
        description: error.message || 'Failed to load dashboard data',
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
