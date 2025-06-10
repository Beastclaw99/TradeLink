import { Project, Application, Payment, Review, ApplicationProject } from '@/components/dashboard/types';

export const transformProjects = (projects: any[]): Project[] => {
  if (!projects) return [];
  
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
    required_skills: project.recommended_skills || null,
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
    client: project.client ? {
      id: project.client.id,
      first_name: project.client.first_name,
      last_name: project.client.last_name,
      rating: project.client.rating,
      profile_image: project.client.profile_image
    } : null,
    professional: project.professional ? {
      id: project.professional.id,
      first_name: project.professional.first_name,
      last_name: project.professional.last_name,
      rating: project.professional.rating,
      profile_image: project.professional.profile_image
    } : null
  }));
};

export const transformApplications = (appsData: any[]): Application[] => {
  if (!appsData) return [];
  
  return appsData.map(app => ({
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
      id: app.professional.id,
      first_name: app.professional.first_name,
      last_name: app.professional.last_name,
      rating: app.professional.rating,
      profile_image: app.professional.profile_image
    } : undefined
  }));
};

export const transformPayments = (paymentsData: any[]): Payment[] => {
  if (!paymentsData) return [];
  
  return paymentsData.map(payment => ({
    id: payment.id,
    amount: payment.amount,
    status: payment.status,
    payment_method: payment.payment_method || null,
    transaction_id: payment.transaction_id || null,
    created_at: payment.created_at || new Date().toISOString(),
    paid_at: payment.paid_at,
    client_id: payment.client_id,
    professional_id: payment.professional_id,
    project_id: payment.project_id,
    project: payment.project ? {
      id: payment.project.id,
      title: payment.project.title
    } : null,
    professional: payment.professional ? {
      id: payment.professional.id,
      first_name: payment.professional.first_name,
      last_name: payment.professional.last_name
    } : null
  }));
};

export const transformReviews = (reviewsData: any[]): Review[] => {
  if (!reviewsData) return [];
  
  return reviewsData.map(review => ({
    id: review.id,
    rating: review.rating,
    comment: review.comment,
    client_id: review.client_id,
    professional_id: review.professional_id,
    project_id: review.project_id,
    created_at: review.created_at,
    updated_at: review['updated at'] || review.created_at,
    professional: review.professional ? {
      id: review.professional.id,
      first_name: review.professional.first_name,
      last_name: review.professional.last_name,
      profile_image: review.professional.profile_image
    } : null
  }));
};
