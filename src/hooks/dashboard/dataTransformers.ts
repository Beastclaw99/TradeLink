import { Project, Application, Payment, Review, Professional, Client } from '@/components/dashboard/types';

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
    required_skills: project.required_skills || null,
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
      tasks: Array.isArray(milestone.tasks) ? milestone.tasks.map((task: any) => ({
        id: task.id,
        title: task.title || '',
        description: task.description || null,
        status: task.status || null,
        completed: task.completed || false
      })) : []
    })) : [],
    deliverables: Array.isArray(project.deliverables) ? project.deliverables.map((deliverable: any) => ({
      id: deliverable.id,
      title: deliverable.title || '',
      description: deliverable.description || null,
      status: deliverable.status || null,
      file_url: deliverable.file_url || null,
      submitted_at: deliverable.submitted_at || null,
      approved_at: deliverable.approved_at || null
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

export const transformClient = (data: any): Client => {
  if (!data) {
    throw new Error('No client data provided');
  }

  return {
    id: data.id,
    first_name: data.first_name || null,
    last_name: data.last_name || null,
    account_type: 'client',
    bio: data.bio || null,
    location: data.location || null,
    phone: data.phone || null,
    email: data.email || null,
    profile_visibility: data.profile_visibility || null,
    show_email: data.show_email || null,
    show_phone: data.show_phone || null,
    allow_messages: data.allow_messages || null,
    profile_image: data.profile_image || null,
    verification_status: data.verification_status || 'unverified',
    created_at: data.created_at,
    updated_at: data.updated_at || null
  };
};
