import { Project, Application, Payment, Review, Client } from '@/components/dashboard/types';
import { Project as DatabaseProject, Application as DatabaseApplication, Payment as DatabasePayment, Review as DatabaseReview } from '@/types/database';

export const transformProjects = (projects: any[]): Project[] => {
  return projects.map(project => ({
    id: project.id,
    title: project.title,
    description: project.description,
    budget: project.budget,
    status: project.status,
    client_id: project.client_id,
    professional_id: project.professional_id,
    created_at: project.created_at,
    updated_at: project.updated_at,
    professional: project.professional ? {
      id: project.professional.id,
      first_name: project.professional.first_name,
      last_name: project.professional.last_name,
      profile_image_url: project.professional.profile_image_url,
      rating: project.professional.rating
    } : null
  }));
};

export const transformApplications = (applications: any[]): Application[] => {
  return applications.map(application => ({
    id: application.id,
    project_id: application.project_id,
    professional_id: application.professional_id,
    proposal_message: application.proposal_message,
    bid_amount: application.bid_amount,
    status: application.status,
    created_at: application.created_at,
    updated_at: application.updated_at,
    professional: application.professional ? {
      id: application.professional.id,
      first_name: application.professional.first_name,
      last_name: application.professional.last_name,
      profile_image_url: application.professional.profile_image_url,
      rating: application.professional.rating
    } : null
  }));
};

export const transformPayments = (payments: any[]): Payment[] => {
  return payments.map(payment => ({
    id: payment.id,
    project_id: payment.project_id,
    professional_id: payment.professional_id,
    amount: payment.amount,
    status: payment.status,
    payment_method: payment.payment_method,
    created_at: payment.created_at,
    updated_at: payment.updated_at,
    professional: payment.professional ? {
      id: payment.professional.id,
      first_name: payment.professional.first_name,
      last_name: payment.professional.last_name
    } : null
  }));
};

export const transformReviews = (reviews: any[]): Review[] => {
  return reviews.map(review => ({
    id: review.id,
    project_id: review.project_id,
    professional_id: review.professional_id,
    rating: review.rating,
    comment: review.comment,
    created_at: review.created_at,
    updated_at: review.updated_at,
    professional: review.professional ? {
      id: review.professional.id,
      first_name: review.professional.first_name,
      last_name: review.professional.last_name
    } : null
  }));
};

export const transformClient = (data: any): Client => {
  if (!data) {
    throw new Error('No client data provided');
  }

  return {
    ...data,
    account_type: 'client',
    profile_image_url: data.profile_image_url || null,
    years_of_experience: data.years_of_experience || null,
    verification_status: data.verification_status || 'unverified',
    created_at: data.created_at,
    updated_at: data.updated_at || null
  };
};
