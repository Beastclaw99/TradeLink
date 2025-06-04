
import { useState, useCallback } from 'react';
import { ProjectData, Milestone, Deliverable, ValidationResult } from '@/types';

const validateProjectData = (data: ProjectData): ValidationResult => {
  const errors = [];
  if (!data.title) errors.push({ field: 'title', message: 'Title is required' });
  if (!data.description) errors.push({ field: 'description', message: 'Description is required' });
  return { isValid: errors.length === 0, errors };
};

const validateMilestone = (milestone: Milestone): ValidationResult => {
  const errors = [];
  if (!milestone.title) errors.push({ field: 'title', message: 'Milestone title is required' });
  if (!milestone.description) errors.push({ field: 'description', message: 'Milestone description is required' });
  return { isValid: errors.length === 0, errors };
};

const validateDeliverable = (deliverable: Deliverable): ValidationResult => {
  const errors = [];
  if (!deliverable.title) errors.push({ field: 'title', message: 'Deliverable title is required' });
  if (!deliverable.description) errors.push({ field: 'description', message: 'Deliverable description is required' });
  return { isValid: errors.length === 0, errors };
};

const validateFile = (file: File): ValidationResult => {
  const errors = [];
  if (file.size > 10 * 1024 * 1024) errors.push({ field: 'file', message: 'File size must be less than 10MB' });
  return { isValid: errors.length === 0, errors };
};

const validateDate = (date: string): ValidationResult => {
  const errors = [];
  if (new Date(date) < new Date()) errors.push({ field: 'date', message: 'Date must be in the future' });
  return { isValid: errors.length === 0, errors };
};

const initialProjectState: ProjectData = {
  title: '',
  description: '',
  category: '',
  location: '',
  recommended_skills: [],
  budget: 0,
  timeline: '',
  urgency: 'low',
  milestones: [],
  service_contract: '',
  expectedTimeline: ''
};

export const useProjectState = () => {
  const [projectData, setProjectData] = useState<ProjectData>(initialProjectState);
  const [isDirty, setIsDirty] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationResult>({
    isValid: true,
    errors: []
  });

  const updateProjectData = useCallback((data: Partial<ProjectData>) => {
    setProjectData(prev => {
      const updatedData = { ...prev, ...data };
      const validation = validateProjectData(updatedData);
      setValidationErrors(validation);
      return updatedData;
    });
    setIsDirty(true);
  }, []);

  const updateMilestone = useCallback((milestoneIndex: number, milestoneData: Partial<Milestone>) => {
    setProjectData(prev => {
      const updatedMilestones = [...prev.milestones];
      const updatedMilestone = {
        ...updatedMilestones[milestoneIndex],
        ...milestoneData
      };
      
      const validation = validateMilestone(updatedMilestone);
      if (!validation.isValid) {
        setValidationErrors(validation);
        return prev;
      }
      
      updatedMilestones[milestoneIndex] = updatedMilestone;
      return { ...prev, milestones: updatedMilestones };
    });
    setIsDirty(true);
  }, []);

  const addMilestone = useCallback((milestone: Milestone) => {
    const validation = validateMilestone(milestone);
    if (!validation.isValid) {
      setValidationErrors(validation);
      return;
    }

    setProjectData(prev => ({
      ...prev,
      milestones: [...prev.milestones, milestone]
    }));
    setIsDirty(true);
  }, []);

  const removeMilestone = useCallback((milestoneIndex: number) => {
    setProjectData(prev => ({
      ...prev,
      milestones: prev.milestones.filter((_, index) => index !== milestoneIndex)
    }));
    setIsDirty(true);
  }, []);

  const updateDeliverable = useCallback((
    milestoneIndex: number,
    deliverableIndex: number,
    deliverableData: Partial<Deliverable>
  ) => {
    setProjectData(prev => {
      const updatedMilestones = [...prev.milestones];
      const updatedDeliverable = {
        ...updatedMilestones[milestoneIndex].deliverables[deliverableIndex],
        ...deliverableData
      };
      
      const validation = validateDeliverable(updatedDeliverable);
      if (!validation.isValid) {
        setValidationErrors(validation);
        return prev;
      }
      
      updatedMilestones[milestoneIndex] = {
        ...updatedMilestones[milestoneIndex],
        deliverables: updatedMilestones[milestoneIndex].deliverables.map((deliverable, index) =>
          index === deliverableIndex ? updatedDeliverable : deliverable
        )
      };
      return { ...prev, milestones: updatedMilestones };
    });
    setIsDirty(true);
  }, []);

  const addDeliverable = useCallback((milestoneIndex: number, deliverable: Deliverable) => {
    const validation = validateDeliverable(deliverable);
    if (!validation.isValid) {
      setValidationErrors(validation);
      return;
    }

    setProjectData(prev => {
      const updatedMilestones = [...prev.milestones];
      updatedMilestones[milestoneIndex] = {
        ...updatedMilestones[milestoneIndex],
        deliverables: [...updatedMilestones[milestoneIndex].deliverables, deliverable]
      };
      return { ...prev, milestones: updatedMilestones };
    });
    setIsDirty(true);
  }, []);

  const removeDeliverable = useCallback((milestoneIndex: number, deliverableIndex: number) => {
    setProjectData(prev => {
      const updatedMilestones = [...prev.milestones];
      updatedMilestones[milestoneIndex] = {
        ...updatedMilestones[milestoneIndex],
        deliverables: updatedMilestones[milestoneIndex].deliverables.filter(
          (_, index) => index !== deliverableIndex
        )
      };
      return { ...prev, milestones: updatedMilestones };
    });
    setIsDirty(true);
  }, []);

  const reorderMilestones = useCallback((startIndex: number, endIndex: number) => {
    setProjectData(prev => {
      const result = Array.from(prev.milestones);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return { ...prev, milestones: result };
    });
    setIsDirty(true);
  }, []);

  const resetProjectData = useCallback(() => {
    setProjectData(initialProjectState);
    setIsDirty(false);
    setValidationErrors({ isValid: true, errors: [] });
  }, []);

  const validateProjectDataState = useCallback((): ValidationResult => {
    const validation = validateProjectData(projectData);
    setValidationErrors(validation);
    return validation;
  }, [projectData]);

  const validateFileUpload = useCallback((file: File) => {
    return validateFile(file);
  }, []);

  const validateMilestoneDate = useCallback((date: string) => {
    return validateDate(date);
  }, []);

  return {
    projectData,
    isDirty,
    validationErrors,
    updateProjectData,
    updateMilestone,
    addMilestone,
    removeMilestone,
    updateDeliverable,
    addDeliverable,
    removeDeliverable,
    reorderMilestones,
    resetProjectData,
    validateProjectData: validateProjectDataState,
    validateFileUpload,
    validateMilestoneDate
  };
}; 
