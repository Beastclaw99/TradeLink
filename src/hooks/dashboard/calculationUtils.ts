
import { Review, Payment } from '@/components/dashboard/types';

export const calculateAverageRating = (reviews: Review[]): string => {
  if (reviews.length === 0) return "0";
  const total = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
  return (total / reviews.length).toFixed(1);
};

export const calculatePaymentTotals = (payments: Payment[]) => {
  const received = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);
  
  const pending = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);
  
  return { received, pending };
};
