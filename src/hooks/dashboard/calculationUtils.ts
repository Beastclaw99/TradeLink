import { Review, Payment, Milestone, Task } from '@/types/database';

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

export const calculateMilestoneProgress = (milestones: Milestone[]): {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  percentage: number;
} => {
  const stats = milestones.reduce((acc, milestone) => {
    acc.total++;
    switch (milestone.status) {
      case 'completed':
        acc.completed++;
        break;
      case 'in_progress':
        acc.inProgress++;
        break;
      case 'pending':
        acc.pending++;
        break;
      case 'cancelled':
        // Cancelled milestones don't affect progress
        break;
    }
    return acc;
  }, { total: 0, completed: 0, inProgress: 0, pending: 0 });

  return {
    ...stats,
    percentage: stats.total > 0 ? Number(((stats.completed / stats.total) * 100).toFixed(1)) : 0
  };
};

export const calculateTaskProgress = (tasks: Task[]): {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  percentage: number;
} => {
  const stats = tasks.reduce((acc, task) => {
    acc.total++;
    switch (task.status) {
      case 'completed':
        acc.completed++;
        break;
      case 'in_progress':
        acc.inProgress++;
        break;
      case 'todo':
        acc.pending++;
        break;
    }
    return acc;
  }, { total: 0, completed: 0, inProgress: 0, pending: 0 });

  return {
    ...stats,
    percentage: stats.total > 0 ? Number(((stats.completed / stats.total) * 100).toFixed(1)) : 0
  };
};
