import { z } from 'zod';
import { ProjectData, Milestone, Deliverable } from './types';

// Deliverable validation schema
export const deliverableSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  deliverable_type: z.enum(['note', 'file', 'link']),
  content: z.string(),
  uploaded_by: z.string().optional(),
  file_url: z.string().optional()
});

// Milestone validation schema
export const milestoneSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  due_date: z.string().refine((date) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime()) && parsedDate > new Date();
  }, 'Due date must be a valid future date'),
  deliverables: z.array(deliverableSchema),
  is_complete: z.boolean(),
  status: z.enum(['not_started', 'in_progress', 'completed']).optional(),
  created_by: z.string().optional()
});

// Project validation schema
export const projectSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must be less than 2000 characters'),
  category: z.string().min(1, 'Category is required'),
  location: z.string().min(1, 'Location is required'),
  recommended_skills: z.array(z.string()),
  budget: z.number()
    .min(1, 'Budget must be greater than 0')
    .max(1000000, 'Budget must be less than 1,000,000'),
  timeline: z.string().min(1, 'Timeline is required'),
  urgency: z.enum(['low', 'medium', 'high'], {
    errorMap: () => ({ message: 'Please select a valid urgency level' })
  }),
  milestones: z.array(milestoneSchema).optional(),
  service_contract: z.string().optional()
});

// Validation helper functions
export const validateProjectData = (data: ProjectData) => {
  try {
    projectSchema.parse(data);
    return { isValid: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      };
    }
    return {
      isValid: false,
      errors: [{ field: 'unknown', message: 'An unexpected error occurred' }]
    };
  }
};

export const validateMilestone = (milestone: Milestone) => {
  try {
    milestoneSchema.parse(milestone);
    return { isValid: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      };
    }
    return {
      isValid: false,
      errors: [{ field: 'unknown', message: 'An unexpected error occurred' }]
    };
  }
};

export const validateDeliverable = (deliverable: Deliverable) => {
  try {
    deliverableSchema.parse(deliverable);
    return { isValid: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      };
    }
    return {
      isValid: false,
      errors: [{ field: 'unknown', message: 'An unexpected error occurred' }]
    };
  }
};

// File validation helpers
export const validateFile = (file: File) => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'File size must be less than 10MB'
    };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'File type not allowed. Please upload a PDF, Word document, or image file.'
    };
  }

  return { isValid: true };
};

// Date validation helpers
export const validateDate = (date: string) => {
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    return {
      isValid: false,
      error: 'Invalid date format'
    };
  }
  if (parsedDate < new Date()) {
    return {
      isValid: false,
      error: 'Date must be in the future'
    };
  }
  return { isValid: true };
}; 