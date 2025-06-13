import { Project, Application, Payment, Review, Client } from '@/components/dashboard/types';
import { Database } from '@/integrations/supabase/types';

type DatabaseProject = Database['public']['Tables']['projects']['Row'] & {
  professional?: {
    id: string;
    first_name: string;
    last_name: string;
    profile_image_url: string | null;
    rating: number | null;
  };
  client?: {
    id: string;
    first_name: string;
    last_name: string;
    profile_image_url: string | null;
  };
  milestones?: Array<{
    id: string;
    title: string;
    description: string | null;
    due_date: string | null;
    status: string | null;
  }>;
  deliverables?: Array<{
    id: string;
    description: string;
    deliverable_type: string;
    content: string | null;
    file_url: string;
    status: string | null;
    created_at: string | null;
  }>;
};

type DatabaseApplication = Database['public']['Tables']['applications']['Row'] & {
  professional?: {
    id: string;
    first_name: string;
    last_name: string;
    profile_image_url: string | null;
    rating: number | null;
  };
  project?: {
    id: string;
    title: string;
    status: string;
    budget: number | null;
    created_at: string;
  };
};

type DatabasePayment = Database['public']['Tables']['payments']['Row'] & {
  professional?: {
    id: string;
    first_name: string;
    last_name: string;
    profile_image_url: string | null;
  };
  project?: {
    id: string;
    title: string;
    status: string;
    budget: number | null;
  };
};

type DatabaseReview = Database['public']['Tables']['reviews']['Row'] & {
  professional?: {
    id: string;
    first_name: string;
    last_name: string;
    profile_image_url: string | null;
  };
};

type DatabaseProfile = Database['public']['Tables']['profiles']['Row'];

export const transformProjects = (projects: DatabaseProject[]): Project[] => {
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
    recommended_skills: null,
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
    project_start_time: null,
    rich_description: null,
    scope: project.scope,
    service_contract: null,
    sla_terms: project.sla_terms,
    client: project.client ? {
      id: project.client.id,
      first_name: project.client.first_name,
      last_name: project.client.last_name,
      profile_image_url: project.client.profile_image_url
    } : undefined,
    professional: project.professional ? {
      id: project.professional.id,
      first_name: project.professional.first_name,
      last_name: project.professional.last_name,
      profile_image_url: project.professional.profile_image_url,
      rating: project.professional.rating
    } : undefined,
    milestones: project.milestones?.map(milestone => ({
      id: milestone.id,
      title: milestone.title,
      description: milestone.description,
      due_date: milestone.due_date,
      status: milestone.status as any,
      project_id: project.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: null,
      is_complete: false,
      requires_deliverable: false
    })),
    deliverables: project.deliverables?.map(deliverable => ({
      id: deliverable.id,
      description: deliverable.description,
      deliverable_type: deliverable.deliverable_type as any,
      content: deliverable.content,
      file_url: deliverable.file_url,
      status: deliverable.status as any,
      created_at: deliverable.created_at,
      project_id: project.id,
      milestone_id: null,
      uploaded_by: null,
      reviewed_at: null,
      feedback: null
    }))
  }));
};

export const transformApplications = (applications: DatabaseApplication[]): Application[] => {
  return applications.map(application => ({
    id: application.id,
    project_id: application.project_id || '',
    professional_id: application.professional_id || '',
    cover_letter: application.cover_letter,
    proposal_message: application.proposal_message,
    bid_amount: application.bid_amount,
    availability: application.availability,
    status: application.status,
    created_at: application.created_at || new Date().toISOString(),
    updated_at: application.updated_at || new Date().toISOString(),
    project: application.project ? {
      id: application.project.id,
      title: application.project.title,
      status: application.project.status,
      budget: application.project.budget,
      created_at: application.project.created_at
    } : undefined,
    professional: application.professional ? {
      id: application.professional.id,
      first_name: application.professional.first_name,
      last_name: application.professional.last_name,
      profile_image_url: application.professional.profile_image_url,
      rating: application.professional.rating
    } : undefined
  }));
};

export const transformPayments = (payments: DatabasePayment[]): Payment[] => {
  return payments.map(payment => ({
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
    project: payment.project ? {
      id: payment.project.id,
      title: payment.project.title,
      status: payment.project.status,
      budget: payment.project.budget
    } : undefined,
    professional: payment.professional ? {
      id: payment.professional.id,
      first_name: payment.professional.first_name,
      last_name: payment.professional.last_name,
      profile_image_url: payment.professional.profile_image_url
    } : undefined,
    currency: payment.currency,
    metadata: payment.metadata,
    payment_id: payment.payment_id,
    payment_method_id: payment.payment_method_id,
    payment_url: payment.payment_url
  }));
};

export const transformReviews = (reviews: DatabaseReview[]): Review[] => {
  return reviews.map(review => ({
    id: review.id,
    rating: review.rating,
    comment: review.comment,
    status: review.status as any,
    reported_at: review.reported_at,
    reported_by: review.reported_by,
    report_reason: review.report_reason,
    created_at: review.created_at,
    updated_at: review.updated_at,
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
    professional: review.professional ? {
      id: review.professional.id,
      first_name: review.professional.first_name,
      last_name: review.professional.last_name,
      profile_image_url: review.professional.profile_image_url
    } : undefined
  }));
};

export const transformClient = (data: DatabaseProfile): Client => {
  if (!data) {
    throw new Error('No client data provided');
  }

  return {
    id: data.id,
    first_name: data.first_name || '',
    last_name: data.last_name || '',
    email: data.email || '',
    phone: data.phone,
    location: data.location,
    account_type: 'client',
    profile_image_url: data.profile_image_url,
    bio: data.bio,
    rating: data.rating,
    total_reviews: null,
    company_name: null,
    company_size: null,
    industry: null,
    website: null,
    social_media_links: null,
    notification_preferences: null,
    language_preferences: null,
    timezone: null,
    payment_methods: null,
    preferred_payment_method: null,
    tax_information: null,
    bank_account_details: null,
    stripe_customer_id: null,
    created_at: data.created_at,
    updated_at: data.updated_at,
    verification_status: data.verification_status as any || 'unverified',
    profile_visibility: data.profile_visibility || false,
    show_email: data.show_email || false,
    show_phone: data.show_phone || false,
    allow_messages: data.allow_messages || false,
    years_of_experience: data.years_of_experience
  };
};
