
import { Project, Application, Payment, Review, Professional, Client } from '@/components/dashboard/types';

export const transformProjects = (data: any[]): Project[] => {
  return data.map(project => ({
    id: project.id,
    title: project.title,
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
    client: project.client,
    professional: project.professional,
    milestones: project.milestones?.map((m: any) => ({
      id: m.id,
      title: m.title,
      description: m.description,
      due_date: m.due_date,
      status: m.status,
      tasks: m.tasks || []
    })) || [],
    deliverables: project.deliverables || []
  }));
};

export const transformApplications = (data: any[]): Application[] => {
  return data.map(app => ({
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
    project: app.project,
    professional: app.professional
  }));
};

export const transformPayments = (data: any[]): Payment[] => {
  return data.map(payment => ({
    id: payment.id,
    amount: payment.amount,
    status: payment.status,
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
  return data.map(review => ({
    id: review.id,
    rating: review.rating,
    comment: review.comment,
    status: review.status,
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
    is_verified: review.is_verified,
    verification_method: review.verification_method,
    moderated_at: review.moderated_at,
    moderated_by: review.moderated_by,
    moderation_notes: review.moderation_notes
  }));
};

export const transformProfessional = (data: any): Professional => {
  return {
    id: data.id,
    first_name: data.first_name,
    last_name: data.last_name,
    skills: data.skills,
    rating: data.rating,
    account_type: 'professional',
    bio: data.bio,
    location: data.location,
    phone: data.phone,
    email: data.email,
    availability: data.availability,
    certifications: data.certifications,
    completed_projects: data.completed_projects,
    response_rate: data.response_rate,
    on_time_completion: data.on_time_completion,
    profile_visibility: data.profile_visibility,
    show_email: data.show_email,
    show_phone: data.show_phone,
    allow_messages: data.allow_messages,
    profile_image: data.profile_image,
    verification_status: data.verification_status,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
};

export const transformClient = (data: any): Client => {
  return {
    id: data.id,
    first_name: data.first_name,
    last_name: data.last_name,
    account_type: 'client',
    bio: data.bio,
    location: data.location,
    phone: data.phone,
    email: data.email,
    profile_visibility: data.profile_visibility,
    show_email: data.show_email,
    show_phone: data.show_phone,
    allow_messages: data.allow_messages,
    profile_image: data.profile_image,
    verification_status: data.verification_status,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
};
