
import React from 'react';
import { useClientDashboard } from '@/hooks/useClientDashboard';
import { ClientDashboardTabs } from './client/ClientDashboardTabs';
import DashboardError from './professional/DashboardError';

interface ClientDashboardProps {
  userId: string;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ userId }) => {
  const {
    projects,
    applications,
    payments,
    reviews,
    profile,
    isLoading,
    error,
    fetchDashboardData,
    handleApplicationUpdate,
    calculateAverageRating,
    calculatePaymentTotals,
    // Project management
    selectedProject,
    setSelectedProject,
    editedProject,
    projectToDelete,
    isProjectSubmitting,
    handleEditInitiate,
    handleEditCancel,
    handleUpdateProject,
    handleDeleteInitiate,
    handleDeleteCancel,
    handleDeleteProject,
    // Review management
    projectToReview,
    reviewData,
    isReviewSubmitting,
    handleReviewInitiate,
    handleReviewCancel,
    handleReviewSubmit,
    setReviewData
  } = useClientDashboard(userId);

  if (error) {
    return <DashboardError error={error} isLoading={isLoading} onRetry={fetchDashboardData} />;
  }

  return (
    <ClientDashboardTabs
      userId={userId}
      isLoading={isLoading}
      projects={projects}
      applications={applications}
      payments={payments}
      reviews={reviews}
      profile={profile}
      selectedProject={selectedProject}
      setSelectedProject={setSelectedProject}
      editedProject={editedProject}
      projectToDelete={projectToDelete}
      isProjectSubmitting={isProjectSubmitting}
      handleEditInitiate={handleEditInitiate}
      handleEditCancel={handleEditCancel}
      handleUpdateProject={handleUpdateProject}
      handleDeleteInitiate={handleDeleteInitiate}
      handleDeleteCancel={handleDeleteCancel}
      handleDeleteProject={handleDeleteProject}
      projectToReview={projectToReview}
      reviewData={reviewData}
      isReviewSubmitting={isReviewSubmitting}
      handleReviewInitiate={handleReviewInitiate}
      handleReviewCancel={handleReviewCancel}
      handleReviewSubmit={handleReviewSubmit}
      setReviewData={setReviewData}
      handleApplicationUpdate={handleApplicationUpdate}
      calculateAverageRating={calculateAverageRating}
      calculatePaymentTotals={calculatePaymentTotals}
    />
  );
};

export default ClientDashboard;
