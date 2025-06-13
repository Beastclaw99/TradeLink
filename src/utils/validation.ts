import { Project, Application, Payment, Review, Milestone, Task, Profile } from '@/types/database';

export const validateProject = (project: Partial<Project>): string[] => {
  const errors: string[] = [];

  if (!project.title) errors.push('Title is required');
  if (!project.description) errors.push('Description is required');
  if (!project.budget) errors.push('Budget is required');
  if (!project.deadline) errors.push('Deadline is required');
  if (!project.category) errors.push('Category is required');
  if (!project.skills_required?.length) errors.push('At least one skill is required');
  if (!project.location) errors.push('Location is required');

  return errors;
};

export const validateApplication = (application: Partial<Application>): string[] => {
  const errors: string[] = [];

  if (!application.project_id) errors.push('Project ID is required');
  if (!application.professional_id) errors.push('Professional ID is required');
  if (!application.cover_letter) errors.push('Cover letter is required');
  if (!application.proposed_budget) errors.push('Proposed budget is required');
  if (!application.proposed_timeline) errors.push('Proposed timeline is required');

  return errors;
};

export const validatePayment = (payment: Partial<Payment>): string[] => {
  const errors: string[] = [];

  if (!payment.project_id) errors.push('Project ID is required');
  if (!payment.amount) errors.push('Amount is required');
  if (!payment.currency) errors.push('Currency is required');
  if (!payment.payment_method) errors.push('Payment method is required');
  if (!payment.payment_date) errors.push('Payment date is required');

  return errors;
};

export const validateReview = (review: Partial<Review>): string[] => {
  const errors: string[] = [];

  if (!review.project_id) errors.push('Project ID is required');
  if (!review.reviewer_id) errors.push('Reviewer ID is required');
  if (!review.reviewee_id) errors.push('Reviewee ID is required');
  if (!review.rating) errors.push('Rating is required');
  if (!review.comment) errors.push('Comment is required');

  return errors;
};

export const validateMilestone = (milestone: Partial<Milestone>): string[] => {
  const errors: string[] = [];

  if (!milestone.project_id) errors.push('Project ID is required');
  if (!milestone.title) errors.push('Title is required');
  if (!milestone.description) errors.push('Description is required');
  if (!milestone.due_date) errors.push('Due date is required');

  return errors;
};

export const validateTask = (task: Partial<Task>): string[] => {
  const errors: string[] = [];

  if (!task.milestone_id) errors.push('Milestone ID is required');
  if (!task.project_id) errors.push('Project ID is required');
  if (!task.title) errors.push('Title is required');
  if (!task.description) errors.push('Description is required');
  if (!task.due_date) errors.push('Due date is required');
  if (!task.priority) errors.push('Priority is required');

  return errors;
};

export const validateProfile = (profile: Partial<Profile>): string[] => {
  const errors: string[] = [];

  if (!profile.user_id) errors.push('User ID is required');
  if (!profile.first_name) errors.push('First name is required');
  if (!profile.last_name) errors.push('Last name is required');
  if (!profile.email) errors.push('Email is required');
  if (!profile.role) errors.push('Role is required');
  if (!profile.status) errors.push('Status is required');

  return errors;
}; 