import { Project, Application, Payment, Review, Client } from '@/components/dashboard/types';

export const transformProjects = (data: any[]): Project[] => {
  return (data || []).map(project => ({
    id: project.id,
    title: project.title || '',
    description: project.description || null,
    category: project.category || null,
    budget: project.budget || null,
    expected_timeline: project.expected_timeline || null,
    location: project.location || null,
    urgency: project.urgency || null,
    requirements: project.requirements || null,
    recommended_skills: project.skills_needed || null,
    status: project.status || null,
    created_at: project.created_at || null,
    updated_at: project.updated_at || null,
    client_id: project.client_id || null,
    assigned_to: project.assigned_to || null,
    professional_id: project.professional_id || null,
    contract_template_id: project.contract_template_id || null,
    deadline: project.deadline || null,
    industry_specific_fields: project.industry_specific_fields || null,
    location_coordinates: project.location_coordinates || null,
    project_start_time: project.project_start_time || null,
    rich_description: project.rich_description || null,
    scope: project.scope || null,
    service_contract: project.service_contract || null,
    sla_terms: project.sla_terms || null,
    client: project.client || undefined,
    professional: project.professional || undefined,
    milestones: Array.isArray(project.milestones) ? project.milestones.map((milestone: any) => ({
      id: milestone.id,
      title: milestone.title || '',
      description: milestone.description || null,
      due_date: milestone.due_date || null,
      status: milestone.status || null,
      tasks: [] // Initialize empty tasks array since we removed the relationship
    })) : [],
    deliverables: Array.isArray(project.deliverables) ? project.deliverables.map((deliverable: any) => ({
      id: deliverable.id,
      description: deliverable.description || '',
      deliverable_type: deliverable.deliverable_type || 'file',
      content: deliverable.content || null,
      file_url: deliverable.file_url || null,
      status: deliverable.status || null,
      created_at: deliverable.created_at || null
    })) : []
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
    professional: payment.professional,
    currency: payment.currency || null,
    metadata: payment.metadata || null,
    payment_id: payment.payment_id || null,
    payment_method_id: payment.payment_method_id || null,
    payment_url: payment.payment_url || null
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
    moderation_notes: review.moderation_notes,
    updated_at: review.updated_at || null
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
