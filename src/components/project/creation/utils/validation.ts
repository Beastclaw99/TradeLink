
import { ProjectData, ValidationResult, ValidationError } from '../types';

export const validateProjectData = (data: ProjectData): ValidationResult => {
  const errors: ValidationError[] = [];
  
  // Basic validation
  if (!data.title?.trim()) {
    errors.push({ field: 'title', message: 'Project title is required' });
  }
  
  if (!data.description?.trim()) {
    errors.push({ field: 'description', message: 'Project description is required' });
  }
  
  if (!data.category) {
    errors.push({ field: 'category', message: 'Project category is required' });
  }
  
  if (!data.location?.trim()) {
    errors.push({ field: 'location', message: 'Project location is required' });
  }
  
  // Budget and timeline validation
  if (!data.budget || data.budget <= 0) {
    errors.push({ field: 'budget', message: 'Valid budget amount is required' });
  }
  
  if (!data.timeline?.trim()) {
    errors.push({ field: 'timeline', message: 'Project timeline is required' });
  }
  
  if (!data.urgency) {
    errors.push({ field: 'urgency', message: 'Project urgency level is required' });
  }
  
  // Service contract validation
  if (!data.service_contract?.trim()) {
    errors.push({ field: 'service_contract', message: 'Service contract acceptance is required' });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
