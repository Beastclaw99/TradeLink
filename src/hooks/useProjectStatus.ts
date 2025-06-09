import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { ProjectStatus } from '@/types/projectUpdates';
import { validateStatusTransition, handleStatusTransition } from '@/utils/projectStatusTransitions';

export const useProjectStatus = (projectId: string, professionalId: string) => {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const updateProjectStatus = async (
    newStatus: ProjectStatus,
    metadata?: any
  ) => {
    try {
      setIsUpdating(true);

      const result = await handleStatusTransition(
        projectId,
        newStatus,
        professionalId,
        metadata
      );

      if (result.success) {
        toast({
          title: "Status Updated",
          description: result.message
        });
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to update project status",
          variant: "destructive"
        });
      }

      return result;

    } catch (error: any) {
      console.error('Error updating project status:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update project status",
        variant: "destructive"
      });
      return {
        success: false,
        message: error.message || "Failed to update project status"
      };
    } finally {
      setIsUpdating(false);
    }
  };

  const canTransitionTo = (currentStatus: ProjectStatus, newStatus: ProjectStatus, project: any) => {
    const validation = validateStatusTransition(currentStatus, newStatus, project);
    return validation.isValid;
  };

  return {
    updateProjectStatus,
    canTransitionTo,
    isUpdating
  };
}; 