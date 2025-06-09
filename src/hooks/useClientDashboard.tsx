
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Project, Application, Payment, Review, ApplicationProject } from '@/components/dashboard/types';

export const useClientDashboard = (userId: string) => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch client's profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profileError) throw profileError;
      setProfileData(profileData);
      
      // Fetch client's projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('client_id', userId)
        .order('created_at', { ascending: false });
      
      if (projectsError) throw projectsError;
      
      // Transform projects to match Project interface with proper required_skills handling
      const transformedProjects: Project[] = (projectsData || []).map(project => ({
        id: project.id,
        title: project.title,
        description: project.description,
        category: project.category,
        budget: project.budget,
        expected_timeline: project.expected_timeline,
        location: project.location,
        urgency: project.urgency,
        requirements: project.requirements,
        required_skills: Array.isArray(project.recommended_skills) 
          ? project.recommended_skills 
          : project.recommended_skills 
            ? [project.recommended_skills] 
            : [],
        status: project.status,
        created_at: project.created_at,
        updated_at: project.updated_at,
        client_id: project.client_id,
        assigned_to: project.assigned_to,
        professional_id: project.professional_id,
        contract_template_id: project.contract_template_id,
        deadline: project.deadline,
        industry_specific_fields: project.industry_specific_fields,
        location_coordinates: project.location_coordinates,
        project_start_time: project.project_start_time,
        rich_description: project.rich_description,
        scope: project.scope,
        service_contract: project.service_contract,
        sla_terms: project.sla_terms
      }));
      
      setProjects(transformedProjects);
      
      // Fetch applications for client's projects
      const { data: appsData, error: appsError } = await supabase
        .from('applications')
        .select(`
          *,
          project:projects(id, title, status, budget, created_at),
          professional:profiles!applications_professional_id_fkey(first_name, last_name)
        `)
        .in('project_id', projectsData.map(project => project.id) || []);
      
      if (appsError) throw appsError;
      
      // Transform applications to match the Application type
      const transformedApplications: Application[] = (appsData || []).map(app => ({
        id: app.id,
        project_id: app.project_id,
        professional_id: app.professional_id,
        cover_letter: app.cover_letter,
        proposal_message: app.proposal_message,
        bid_amount: app.bid_amount,
        availability: app.availability,
        status: app.status,
        created_at: app.created_at,
        updated_at: app.updated_at,
        project: app.project ? {
          id: app.project.id,
          title: app.project.title,
          status: app.project.status,
          budget: app.project.budget,
          created_at: app.project.created_at
        } as ApplicationProject : undefined,
        professional: app.professional
      }));
      
      setApplications(transformedApplications);
      
      // Fetch payments for client's projects
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select(`
          *,
          project:projects(title),
          professional:profiles!payments_professional_id_fkey(first_name, last_name)
        `)
        .eq('client_id', userId);
      
      if (paymentsError) throw paymentsError;
      
      // Transform payments to include missing fields
      const transformedPayments: Payment[] = (paymentsData || []).map(payment => ({
        id: payment.id,
        amount: payment.amount,
        status: payment.status,
        payment_method: (payment as any).payment_method || null,
        transaction_id: (payment as any).transaction_id || null,
        created_at: payment.created_at,
        paid_at: payment.paid_at,
        client_id: payment.client_id,
        professional_id: payment.professional_id,
        project_id: payment.project_id,
        project: payment.project,
        professional: payment.professional
      }));
      
      setPayments(transformedPayments);
      
      // Fetch reviews submitted by the client
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('*')
        .eq('client_id', userId);
      
      if (reviewsError) throw reviewsError;
      
      // Transform reviews to match the Review type with required properties
      const transformedReviews: Review[] = (reviewsData || []).map(review => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment || '',
        client_id: review.client_id,
        professional_id: review.professional_id,
        project_id: review.project_id,
        created_at: review.created_at,
        updated_at: review.updated_at || review.created_at,
        status: (review.status as 'pending' | 'approved' | 'rejected' | 'reported') || 'pending',
        is_verified: review.is_verified || false,
        communication_rating: review.communication_rating,
        quality_rating: review.quality_rating,
        timeliness_rating: review.timeliness_rating,
        professionalism_rating: review.professionalism_rating,
        verification_method: review.verification_method,
        reported_at: review.reported_at,
        reported_by: review.reported_by,
        report_reason: review.report_reason,
        moderated_at: review.moderated_at,
        moderated_by: review.moderated_by,
        moderation_notes: review.moderation_notes
      }));
      
      setReviews(transformedReviews);
      
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [userId]);

  return {
    projects,
    applications,
    payments,
    reviews,
    profileData,
    isLoading,
    fetchDashboardData
  };
};
