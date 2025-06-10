
import { Project, Application, Payment, Review, Professional } from '@/components/dashboard/types';

export const transformProjects = (data: any[]): Project[] => {
  return (data || []).map(project => ({
    id: project.id,
    title: project.title || '',
    description: project.description,
    category: project.category,
    budget: project.budget,
    expected_timeline: project.expected_timeline,
    location: project.location,
    urgency: project.urgency,
    requirements: project.requirements,
    required_skills: project.required_skills,
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

export const transformApplications = (data: any[]): Application[] => {
  return (data || []).map(app => ({
    id: app.id,
    project_id: app.project_id,
    professional_id: app.professional_id,
    cover_letter: app.cover_letter,
    proposal_message: app.proposal_message,
    bid_amount: app.bid_amount,
    availability: app.availability,
    status: app.status || 'pending',
    created_at: app.created_at,
    updated_at: app.updated_at,
    project: app.project ? {
      id: app.project.id,
      title: app.project.title,
      status: app.project.status,
      budget: app.project.budget,
      created_at: app.project.created_at
    } : undefined
  }));
};

export const transformPayments = (data: any[]): Payment[] => {
  return (data || []).map(payment => ({
    id: payment.id,
    amount: payment.amount,
    status: payment.status || 'pending',
    payment_method: payment.payment_method,
    transaction_id: payment.transaction_id,
    created_at: payment.created_at,
    paid_at: payment.paid_at,
    client_id: payment.client_id,
    professional_id: payment.professional_id,
    project_id: payment.project_id,
    project: payment.project,
    professional: payment.professional
  }));
};

export const transformReviews = (data: any[]): Review[] => {
  return (data || []).map(review => ({
    id: review.id,
    rating: review.rating,
    comment: review.comment,
    status: review.status || 'approved',
    reported_at: review.reported_at,
    reported_by: review.reported_by,
    report_reason: review.report_reason,
    created_at: review.created_at,
    client_id: review.client_id,
    professional_id: review.professional_id,
    project_id: review.project_id,
    communication_rating: review.communication_rating,
    quality_rating: review.quality_rating,
    timeliness_rating: review.timeliness_rating,
    professionalism_rating: review.professionalism_rating,
    is_verified: review.is_verified || false,
    verification_method: review.verification_method,
    moderated_at: review.moderated_at,
    moderated_by: review.moderated_by,
    moderation_notes: review.moderation_notes
  }));
};

export const transformProfessionals = (data: any[]): Professional[] => {
  return (data || []).map(prof => ({
    id: prof.id,
    first_name: prof.first_name,
    last_name: prof.last_name,
    skills: prof.skills,
    rating: prof.rating,
    account_type: 'professional',
    bio: prof.bio,
    location: prof.location,
    phone: prof.phone,
    email: prof.email,
    availability: prof.availability,
    certifications: prof.certifications,
    completed_projects: prof.completed_projects,
    response_rate: prof.response_rate,
    on_time_completion: prof.on_time_completion,
    profile_visibility: prof.profile_visibility,
    show_email: prof.show_email,
    show_phone: prof.show_phone,
    allow_messages: prof.allow_messages,
    profile_image: prof.profile_image,
    verification_status: prof.verification_status,
    created_at: prof.created_at,
    updated_at: prof.updated_at
  }));
};
