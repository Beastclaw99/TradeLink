import { useState, useCallback } from 'react';
import { ProjectData, Milestone, Deliverable, ValidationResult } from '@/components/project/creation/types';
import { 
  validateProjectData as validateProjectDataSchema, 
  validateMilestone as validateMilestoneSchema, 
  validateDeliverable as validateDeliverableSchema, 
  validateFile, 
  validateDate 
} from '@/components/project/creation/validation';

const initialProjectState: ProjectData = {
  title: '',
  description: '',
  category: '',
  location: '',
  recommended_skills: [],
  budget: 0,
  timeline: '',
  urgency: '',
  milestones: [],
  service_contract: ''
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
      const validation = validateProjectDataSchema(updatedData);
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
      
      const validation = validateMilestoneSchema(updatedMilestone);
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
    const validation = validateMilestoneSchema(milestone);
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
      
      const validation = validateDeliverableSchema(updatedDeliverable);
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
    const validation = validateDeliverableSchema(deliverable);
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

  const validateProjectData = useCallback((): ValidationResult => {
    const validation = validateProjectDataSchema(projectData);
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
    validateProjectData,
    validateFileUpload,
    validateMilestoneDate
  };
}; 