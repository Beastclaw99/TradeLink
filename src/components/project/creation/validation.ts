
import { ProjectData, ValidationResult } from '@/types';

export const validateProjectData = (data: ProjectData): ValidationResult => {
  const errors = [];
  
  if (!data.title?.trim()) {
    errors.push({ field: 'title', message: 'Project title is required' });
  }
  
  if (!data.description?.trim()) {
    errors.push({ field: 'description', message: 'Project description is required' });
  }
  
  if (!data.category?.trim()) {
    errors.push({ field: 'category', message: 'Project category is required' });
  }
  
  if (!data.budget || data.budget <= 0) {
    errors.push({ field: 'budget', message: 'Valid budget amount is required' });
  }
  
  if (!data.timeline?.trim()) {
    errors.push({ field: 'timeline', message: 'Project timeline is required' });
  }

  if (!data.recommended_skills || data.recommended_skills.length === 0) {
    errors.push({ field: 'recommended_skills', message: 'At least one required skill must be specified' });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
