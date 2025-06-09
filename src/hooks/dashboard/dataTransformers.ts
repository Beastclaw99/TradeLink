
import { Project, Application, Payment, Review, ApplicationProject } from '@/components/dashboard/types';

export const transformProjects = (projects: any[]): Project[] => {
  return projects.map(project => ({
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
      : (typeof project.recommended_skills === 'string' 
         ? project.recommended_skills.split(',').map((s: string) => s.trim())
         : []),
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
    sla_terms: project.sla_terms,
    client: project.client
  }));
};

export const transformApplications = (appsData: any[]): Application[] => {
  return (appsData || []).map(app => ({
    id: app.id,
    project_id: app.project_id,
    professional_id: app.professional_id,
    cover_letter: app.cover_letter,
    proposal_message: app.proposal_message || app.cover_letter || '',
    bid_amount: app.bid_amount,
    availability: app.availability,
    status: app.status,
    created_at: app.created_at,
    updated_at: app.updated_at || app.created_at,
    professional: app.professional ? {
      id: app.professional.id,
      first_name: app.professional.first_name,
      last_name: app.professional.last_name,
      email: app.professional.email,
      phone: app.professional.phone,
      bio: app.professional.bio,
      rating: app.professional.rating,
      hourly_rate: app.professional.hourly_rate,
      profile_image: app.professional.profile_image,
      skills: app.professional.skills,
      years_experience: app.professional.years_experience,
      location: app.professional.location,
      verification_status: app.professional.verification_status
    } : undefined,
    project: app.project ? {
      id: app.project.id,
      title: app.project.title,
      status: app.project.status,
      budget: app.project.budget,
      created_at: app.project.created_at
    } as ApplicationProject : undefined
  }));
};

export const transformPayments = (paymentsData: any[]): Payment[] => {
  return (paymentsData || []).map(payment => ({
    id: payment.id,
    amount: payment.amount,
    status: payment.status,
    payment_method_id: payment.payment_method_id || null,
    transaction_id: payment.transaction_id || null,
    created_at: payment.created_at || new Date().toISOString(),
    paid_at: payment.paid_at,
    client_id: payment.client_id,
    professional_id: payment.professional_id,
    project_id: payment.project_id,
    project: payment.project ? {
      id: payment.project.id,
      title: payment.project.title,
      status: payment.project.status
    } : undefined
  }));
};

export const transformReviews = (reviewsData: any[]): Review[] => {
  return (reviewsData || []).map(review => ({
    id: review.id,
    rating: review.rating,
    comment: review.comment || '',
    client_id: review.client_id,
    professional_id: review.professional_id,
    project_id: review.project_id,
    created_at: review.created_at,
    updated_at: review['updated at'] || review.updated_at || review.created_at,
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
};
