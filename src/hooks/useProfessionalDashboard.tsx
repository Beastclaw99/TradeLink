
import { useEffect } from 'react';
import { useProfessionalDataFetcher } from './dashboard/useProfessionalDataFetcher';
import { useProfessionalActions } from './dashboard/useProfessionalActions';
import { calculateAverageRating, calculatePaymentTotals } from './dashboard/calculationUtils';

export const useProfessionalDashboard = (userId: string) => {
  const {
    projects,
    applications,
    payments,
    reviews,
    skills,
    profile,
    isLoading,
    error,
    fetchDashboardData
  } = useProfessionalDataFetcher(userId);

  const { markProjectComplete } = useProfessionalActions(userId, fetchDashboardData);

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();
  }, [userId]);

  return {
    projects,
    applications,
    payments,
    reviews,
    skills,
    profile,
    isLoading,
    error,
    fetchDashboardData,
    markProjectComplete,
    calculateAverageRating: () => calculateAverageRating(reviews),
    calculatePaymentTotals: () => calculatePaymentTotals(payments),
  };
};
