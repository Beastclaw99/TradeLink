import { useState } from 'react';
import { ProjectData, Milestone, Deliverable, ValidationResult } from '../types';
import { fileUploadService } from '@/services/fileUploadService';
import { validateProjectData } from '../utils/validation';

export const useProjectCreation = (initialData: ProjectData) => {
  const [data, setData] = useState<ProjectData>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationResult>({
    isValid: true,
    errors: [],
  });

  const validateAndUpdateData = (updates: Partial<ProjectData>) => {
    const newData = { ...data, ...updates };
    const validation = validateProjectData(newData);
    setValidationErrors(validation);
    if (validation.isValid) {
      setData(newData);
    }
    return validation.isValid;
  };

  const updateProjectData = (updates: Partial<ProjectData>) => {
    return validateAndUpdateData(updates);
  };

  const addMilestone = (milestone: Milestone) => {
    const newData = {
      ...data,
      milestones: [...data.milestones, milestone],
    };
    return validateAndUpdateData(newData);
  };

  const updateMilestone = (index: number, milestone: Milestone) => {
    const updatedMilestones = [...data.milestones];
    updatedMilestones[index] = milestone;
    return validateAndUpdateData({ milestones: updatedMilestones });
  };

  const removeMilestone = (index: number) => {
    const updatedMilestones = data.milestones.filter((_, i) => i !== index);
    return validateAndUpdateData({ milestones: updatedMilestones });
  };

  const addDeliverable = (milestoneIndex: number, deliverable: Deliverable) => {
    const updatedMilestones = [...data.milestones];
    updatedMilestones[milestoneIndex].deliverables.push(deliverable);
    return validateAndUpdateData({ milestones: updatedMilestones });
  };

  const updateDeliverable = (
    milestoneIndex: number,
    deliverableIndex: number,
    deliverable: Deliverable
  ) => {
    const updatedMilestones = [...data.milestones];
    updatedMilestones[milestoneIndex].deliverables[deliverableIndex] = deliverable;
    return validateAndUpdateData({ milestones: updatedMilestones });
  };

  const removeDeliverable = (milestoneIndex: number, deliverableIndex: number) => {
    const updatedMilestones = [...data.milestones];
    updatedMilestones[milestoneIndex].deliverables = updatedMilestones[
      milestoneIndex
    ].deliverables.filter((_, i) => i !== deliverableIndex);
    return validateAndUpdateData({ milestones: updatedMilestones });
  };

  const handleFileUpload = async (
    file: File,
    milestoneIndex: number,
    deliverableIndex: number
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fileUploadService.uploadFile(file, (progress) => {
        // Handle upload progress if needed
        console.log('Upload progress:', progress);
      });

      const updatedDeliverable: Deliverable = {
        id: data.milestones[milestoneIndex].deliverables[deliverableIndex].id,
        title: file.name,
        description: '',
        deliverable_type: 'file',
        content: result.fileUrl,
        milestone_id: data.milestones[milestoneIndex].id,
        file_url: result.fileUrl,
        file_name: result.fileName,
      };

      updateDeliverable(milestoneIndex, deliverableIndex, updatedDeliverable);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const reorderMilestones = (startIndex: number, endIndex: number) => {
    const result = Array.from(data.milestones);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return validateAndUpdateData({ milestones: result });
  };

  const reorderDeliverables = (
    milestoneIndex: number,
    startIndex: number,
    endIndex: number
  ) => {
    const result = Array.from(data.milestones);
    const milestone = result[milestoneIndex];
    const deliverables = Array.from(milestone.deliverables);
    const [removed] = deliverables.splice(startIndex, 1);
    deliverables.splice(endIndex, 0, removed);
    milestone.deliverables = deliverables;
    return validateAndUpdateData({ milestones: result });
  };

  return {
    data,
    isLoading,
    error,
    validationErrors,
    updateProjectData,
    addMilestone,
    updateMilestone,
    removeMilestone,
    addDeliverable,
    updateDeliverable,
    removeDeliverable,
    handleFileUpload,
    reorderMilestones,
    reorderDeliverables,
  };
}; 