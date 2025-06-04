import { useEffect, useState } from 'react';
import { useDataFetching } from './client-dashboard/useDataFetching';
import { useProjectOperations } from './client-dashboard/useProjectOperations';
import { useReviewOperations } from './client-dashboard/useReviewOperations';
import { useApplicationOperations } from './client-dashboard/useApplicationOperations';

export const useClientDashboard = (userId: string) => {
  const {
    projects,
    applications,
    payments,
    reviews,
    profileData,
    isLoading,
    error,
    fetchDashboardData
  } = useDataFetching(userId);

  const {
    editProject,
    projectToDelete,
    editedProject,
    isProjectSubmitting,
    handleEditInitiate,
    handleEditCancel,
    handleUpdateProject,
    handleDeleteInitiate,
    handleDeleteCancel,
    handleDeleteProject
  } = useProjectOperations(userId, fetchDashboardData);

  const {
    projectToReview,
    reviewData,
    isReviewSubmitting,
    handleReviewInitiate,
    handleReviewCancel,
    handleReviewSubmit,
    setReviewData
  } = useReviewOperations(userId, projects, fetchDashboardData);

  const {
    handleApplicationUpdate
  } = useApplicationOperations(fetchDashboardData);

  // Additional state for compatibility
  const [newProject, setNewProject] = useState<any>({});

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();
  }, [userId]);

  return {
    // Data
    projects,
    applications,
    payments,
    reviews,
    profileData,
    isLoading,
    error,
    
    // Project operations
    editProject,
    projectToDelete,
    editedProject,
    newProject,
    isProjectSubmitting,
    handleEditInitiate,
    handleEditCancel,
    handleUpdateProject,
    handleDeleteInitiate,
    handleDeleteCancel,
    handleDeleteProject,
    
    // Review operations
    projectToReview,
    reviewData,
    isReviewSubmitting,
    handleReviewInitiate,
    handleReviewCancel,
    handleReviewSubmit,
    setReviewData,
    
    // Application operations
    handleApplicationUpdate,
    
    // Data refresh
    fetchDashboardData
  };
};
