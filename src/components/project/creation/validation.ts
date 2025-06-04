
import { Deliverable, Milestone, ProjectData } from '@/types';

export const validateFile = (file: File) => {
  const maxSize = 50 * 1024 * 1024; // 50MB
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'File size must be less than 50MB'
    };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'File type not supported. Please upload images, PDFs, or documents.'
    };
  }

  return {
    isValid: true,
    error: null
  };
};

export const validateProjectData = (data: ProjectData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Basic validation
  if (!data.title?.trim()) {
    errors.push('Project title is required');
  }

  if (!data.description?.trim()) {
    errors.push('Project description is required');
  }

  if (!data.category) {
    errors.push('Project category is required');
  }

  if (!data.budget || data.budget <= 0) {
    errors.push('Budget must be greater than 0');
  }

  if (!data.timeline) {
    errors.push('Timeline is required');
  }

  if (!data.urgency) {
    errors.push('Urgency level is required');
  }

  // Validate milestones
  if (data.milestones && data.milestones.length > 0) {
    data.milestones.forEach((milestone, index) => {
      if (!milestone.title?.trim()) {
        errors.push(`Milestone ${index + 1}: Title is required`);
      }
      if (!milestone.description?.trim()) {
        errors.push(`Milestone ${index + 1}: Description is required`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateDeliverable = (deliverable: Partial<Deliverable>): { isValid: boolean; error?: string } => {
  if (!deliverable.title?.trim()) {
    return { isValid: false, error: 'Deliverable title is required' };
  }

  if (!deliverable.deliverable_type) {
    return { isValid: false, error: 'Deliverable type is required' };
  }

  if (deliverable.deliverable_type === 'file' && !deliverable.file_url) {
    return { isValid: false, error: 'File URL is required for file deliverables' };
  }

  if (deliverable.deliverable_type === 'link' && !deliverable.content) {
    return { isValid: false, error: 'Link URL is required for link deliverables' };
  }

  return { isValid: true };
};

export const validateMilestone = (milestone: Partial<Milestone>): { isValid: boolean; error?: string } => {
  if (!milestone.title?.trim()) {
    return { isValid: false, error: 'Milestone title is required' };
  }

  if (!milestone.description?.trim()) {
    return { isValid: false, error: 'Milestone description is required' };
  }

  if (milestone.deliverables && milestone.deliverables.length > 0) {
    for (const deliverable of milestone.deliverables) {
      const deliverableValidation = validateDeliverable(deliverable);
      if (!deliverableValidation.isValid) {
        return { isValid: false, error: `Deliverable error: ${deliverableValidation.error}` };
      }
    }
  }

  return { isValid: true };
};
