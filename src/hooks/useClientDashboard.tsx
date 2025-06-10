import { useEffect } from 'react';
import { useClientDataFetcher } from './dashboard/useClientDataFetcher';
import { useClientActions } from './dashboard/useClientActions';
import { calculateAverageRating, calculatePaymentTotals } from './dashboard/calculationUtils';
import { useState } from 'react';
import { Project, Application } from '@/components/dashboard/types';

export const useClientDashboard = (userId: string) => {
  const {
    projects,
    applications,
    payments,
    reviews,
    profile,
    isLoading,
    error,
    fetchDashboardData
  } = useClientDataFetcher(userId);

  const { isProcessing, handleApplicationUpdate } = useClientActions(userId, fetchDashboardData);

  // Project state
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editedProject, setEditedProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [isProjectSubmitting, setIsProjectSubmitting] = useState(false);

  // Review state
  const [projectToReview, setProjectToReview] = useState<Application | null>(null);
  const [reviewData, setReviewData] = useState({
    rating: 0,
    comment: '',
    professional_id: ''
  });
  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();
  }, [userId]);

  // Project operations
  const handleEditInitiate = (project: Project) => {
    setEditedProject(project);
  };

  const handleEditCancel = () => {
    setEditedProject(null);
  };

  const handleUpdateProject = async (projectData: Project) => {
    try {
      setIsProjectSubmitting(true);
      // Update project logic here
      await fetchDashboardData();
      setEditedProject(null);
    } catch (error) {
      console.error('Error updating project:', error);
    } finally {
      setIsProjectSubmitting(false);
    }
  };

  const handleDeleteInitiate = (projectId: string) => {
    setProjectToDelete(projectId);
  };

  const handleDeleteCancel = () => {
    setProjectToDelete(null);
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      setIsProjectSubmitting(true);
      // Delete project logic here
      await fetchDashboardData();
      setProjectToDelete(null);
    } catch (error) {
      console.error('Error deleting project:', error);
    } finally {
      setIsProjectSubmitting(false);
    }
  };

  // Review operations
  const handleReviewInitiate = (application: Application) => {
    setProjectToReview(application);
    setReviewData({
      rating: 0,
      comment: '',
      professional_id: application.professional_id
    });
  };

  const handleReviewCancel = () => {
    setProjectToReview(null);
    setReviewData({
      rating: 0,
      comment: '',
      professional_id: ''
    });
  };

  const handleReviewSubmit = async () => {
    try {
      setIsReviewSubmitting(true);
      // Submit review logic here
      await fetchDashboardData();
      setProjectToReview(null);
      setReviewData({
        rating: 0,
        comment: '',
        professional_id: ''
      });
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsReviewSubmitting(false);
    }
  };

  return {
    // Data
    projects,
    applications,
    payments,
    reviews,
    profile,
    isLoading,
    error,
    
    // Project state
    selectedProject,
    setSelectedProject,
    editedProject,
    projectToDelete,
    isProjectSubmitting,
    
    // Review state
    projectToReview,
    reviewData,
    isReviewSubmitting,
    
    // Actions
    fetchDashboardData,
    handleApplicationUpdate,
    handleEditInitiate,
    handleEditCancel,
    handleUpdateProject,
    handleDeleteInitiate,
    handleDeleteCancel,
    handleDeleteProject,
    handleReviewInitiate,
    handleReviewCancel,
    handleReviewSubmit,
    setReviewData,
    
    // Calculations
    calculateAverageRating: () => calculateAverageRating(reviews),
    calculatePaymentTotals: () => calculatePaymentTotals(payments),
  };
};
