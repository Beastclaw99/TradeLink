
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
    payment_method: (payment as any).payment_method || null,
    transaction_id: (payment as any).transaction_id || null,
    created_at: payment.created_at || new Date().toISOString(),
    paid_at: payment.paid_at,
    client_id: payment.client_id,
    professional_id: payment.professional_id,
    project_id: payment.project_id,
    project: payment.project
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
    updated_at: review['updated at'] || review.created_at
  }));
};
