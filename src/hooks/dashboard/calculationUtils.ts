import { Database } from '@/integrations/supabase/types';

type Review = Database['public']['Tables']['reviews']['Row'];
type Payment = Database['public']['Tables']['payments']['Row'];
type PaymentStatus = Database['public']['Enums']['payment_status'];

export const calculateAverageRating = (reviews: Review[]): number => {
  if (!reviews || reviews.length === 0) return 0;
  
  const validReviews = reviews.filter(review => 
    review.rating !== null && review.rating !== undefined
  );
  
  if (validReviews.length === 0) return 0;
  
  const sum = validReviews.reduce((acc, review) => acc + (review.rating || 0), 0);
  return Math.round((sum / validReviews.length) * 10) / 10;
};

export const calculatePaymentTotals = (payments: Payment[]) => {
  const totalPaid = payments
    .filter(payment => payment.status === 'completed' as PaymentStatus)
    .reduce((sum, payment) => sum + payment.amount, 0);
  
  const totalPending = payments
    .filter(payment => payment.status === 'pending' as PaymentStatus)
    .reduce((sum, payment) => sum + payment.amount, 0);
  
  const totalOverdue = payments
    .filter(payment => payment.status === 'failed' as PaymentStatus)
    .reduce((sum, payment) => sum + payment.amount, 0);

  return {
    total: totalPaid + totalPending + totalOverdue,
    pending: totalPending,
    completed: totalPaid
  };
};
