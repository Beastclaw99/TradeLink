
import { Project, Application, Payment, Review, ApplicationProject } from '@/components/dashboard/types';

export const transformProjects = (projects: any[]): Project[] => {
  return projects.map(project => ({
    id: project.id,
    title: project.title,
    description: project.description,
    status: project.status,
    created_at: project.created_at,
    updated_at: project.updated_at,
    client_id: project.client_id,
    professional_id: project.professional_id,
    assigned_to: project.assigned_to,
    budget: project.budget,
    category: project.category,
    location: project.location,
    expected_timeline: project.expected_timeline,
    deadline: project.deadline,
    project_start_time: project.project_start_time,
    urgency: project.urgency,
    requirements: project.requirements,
    recommended_skills: project.recommended_skills,
    scope: project.scope,
    rich_description: project.rich_description,
    service_contract: project.service_contract,
    sla_terms: project.sla_terms,
    industry_specific_fields: project.industry_specific_fields,
    location_coordinates: project.location_coordinates,
    contract_template_id: project.contract_template_id,
    payment_id: project.payment_id,
    payment_required: project.payment_required,
    payment_status: project.payment_status,
    payment_due_date: project.payment_due_date,
    client: project.client ? {
      id: project.client.id || project.client_id,
      first_name: project.client.first_name,
      last_name: project.client.last_name,
      email: project.client.email
    } : undefined,
    professional: project.professional ? {
      id: project.professional.id || project.professional_id,
      first_name: project.professional.first_name,
      last_name: project.professional.last_name,
      skills: project.professional.skills,
      rating: project.professional.rating
    } : undefined
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
    project: app.project ? {
      id: app.project.id,
      title: app.project.title,
      status: app.project.status,
      budget: app.project.budget,
      created_at: app.project.created_at
    } as ApplicationProject : undefined,
    professional: app.professional ? {
      id: app.professional.id || app.professional_id,
      first_name: app.professional.first_name,
      last_name: app.professional.last_name,
      skills: app.professional.skills,
      rating: app.professional.rating
    } : undefined
  }));
};

export const transformPayments = (paymentsData: any[]): Payment[] => {
  return (paymentsData || []).map(payment => ({
    id: payment.id,
    amount: payment.amount,
    status: payment.status,
    payment_method_id: payment.payment_method_id,
    transaction_id: payment.transaction_id,
    created_at: payment.created_at || new Date().toISOString(),
    paid_at: payment.paid_at,
    client_id: payment.client_id,
    professional_id: payment.professional_id,
    project_id: payment.project_id,
    currency: payment.currency,
    payment_url: payment.payment_url,
    metadata: payment.metadata,
    project: payment.project,
    professional: payment.professional
  }));
};

export const transformReviews = (reviewsData: any[]): Review[] => {
  return (reviewsData || []).map(review => ({
    id: review.id,
    rating: review.rating,
    comment: review.comment,
    client_id: review.client_id,
    professional_id: review.professional_id,
    project_id: review.project_id,
    created_at: review.created_at,
    updated_at: review.updated_at || review.created_at,
    quality_rating: review.quality_rating,
    communication_rating: review.communication_rating,
    timeliness_rating: review.timeliness_rating,
    professionalism_rating: review.professionalism_rating,
    is_verified: review.is_verified,
    verification_method: review.verification_method,
    status: review.status,
    reported_by: review.reported_by,
    reported_at: review.reported_at,
    report_reason: review.report_reason,
    moderated_by: review.moderated_by,
    moderated_at: review.moderated_at,
    moderation_notes: review.moderation_notes
  }));
};
