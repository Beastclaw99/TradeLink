
import { Project, Application, Payment, Review } from '@/components/dashboard/types';

export const useDataTransforms = () => {
  const transformProjects = (projectsData: any[]): Project[] => {
    const validStatuses = ['open', 'applied', 'assigned', 'in-progress', 'submitted', 'revision', 'completed', 'paid', 'archived', 'disputed'] as const;
    
    return (projectsData || []).map(project => ({
      id: project.id,
      title: project.title || '',
      description: project.description,
      budget: project.budget,
      status: validStatuses.includes(project.status as any) ? project.status as Project['status'] : 'open',
      client_id: project.client_id || '',
      created_at: project.created_at || new Date().toISOString(),
      updated_at: project.updated_at || project.created_at || new Date().toISOString(),
      assigned_to: project.assigned_to,
      location: project.location,
      deadline: project.deadline,
      required_skills: project.required_skills,
      professional_id: project.professional_id,
      project_start_time: project.project_start_time,
      category: project.category,
      expected_timeline: project.expected_timeline,
      urgency: project.urgency,
      requirements: project.requirements,
      scope: project.scope,
      service_contract: project.service_contract,
      client: project.client ? {
        first_name: project.client.first_name,
        last_name: project.client.last_name
      } : undefined
    }));
  };

  const transformApplications = (applicationsData: any[]): Application[] => {
    const validApplicationStatuses = ['pending', 'accepted', 'rejected', 'withdrawn'] as const;
    const validStatuses = ['open', 'applied', 'assigned', 'in-progress', 'submitted', 'revision', 'completed', 'paid', 'archived', 'disputed'] as const;
    
    return (applicationsData || []).map(app => ({
      id: app.id,
      project_id: app.project_id,
      professional_id: app.professional_id,
      cover_letter: app.cover_letter,
      proposal_message: app.proposal_message,
      bid_amount: app.bid_amount,
      availability: app.availability,
      status: validApplicationStatuses.includes(app.status as any) ? app.status as Application['status'] : 'pending',
      created_at: app.created_at,
      updated_at: app.updated_at || app.created_at,
      project: app.project ? {
        id: app.project.id,
        title: app.project.title,
        status: validStatuses.includes(app.project.status as any) ? app.project.status as Project['status'] : 'open',
        budget: app.project.budget,
        created_at: app.project.created_at
      } : undefined,
      professional: app.professional ? {
        first_name: app.professional.first_name,
        last_name: app.professional.last_name,
        rating: app.professional.rating || undefined,
        skills: app.professional.skills || undefined
      } : undefined
    }));
  };

  const transformPayments = (paymentsData: any[]): Payment[] => {
    const validPaymentStatuses = ['pending', 'completed', 'failed'] as const;
    
    return (paymentsData || []).map(payment => ({
      ...payment,
      status: validPaymentStatuses.includes(payment.status as any) ? payment.status as Payment['status'] : 'pending',
      created_at: payment.created_at || new Date().toISOString()
    }));
  };

  const transformReviews = (reviewsData: any[]): Review[] => {
    return (reviewsData || []).map(review => ({
      ...review,
      updated_at: review['updated at'] || review.created_at || new Date().toISOString()
    }));
  };

  return {
    transformProjects,
    transformApplications,
    transformPayments,
    transformReviews
  };
};
