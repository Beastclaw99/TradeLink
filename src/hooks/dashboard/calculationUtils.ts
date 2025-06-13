import { Review, Payment } from '@/types/database';

export const calculateAverageRating = (reviews: Review[]): number => {
  if (!reviews || reviews.length === 0) return 0;
  
  const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
  return Number((sum / reviews.length).toFixed(1));
};

export const calculatePaymentTotals = (payments: Payment[]): {
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
} => {
  const totals = payments.reduce((acc, payment) => {
    switch (payment.status) {
      case 'completed':
        acc.totalPaid += payment.amount;
        break;
      case 'pending':
      case 'processing':
        acc.totalPending += payment.amount;
        break;
      case 'failed':
      case 'refunded':
        // These statuses don't affect totals
        break;
    }
    return acc;
  }, { totalPaid: 0, totalPending: 0, totalOverdue: 0 });

  return {
    totalPaid: Number(totals.totalPaid.toFixed(2)),
    totalPending: Number(totals.totalPending.toFixed(2)),
    totalOverdue: Number(totals.totalOverdue.toFixed(2))
  };
};
