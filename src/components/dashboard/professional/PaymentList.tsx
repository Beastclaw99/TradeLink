import { Payment } from '../types';
import { PaymentCard } from './PaymentCard';
import { PaymentSummary } from './PaymentSummary';
import { Loader2 } from 'lucide-react';

interface PaymentListProps {
  payments: Payment[];
  isLoading?: boolean;
}

export const PaymentList = ({ payments, isLoading = false }: PaymentListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PaymentSummary payments={payments} />
      
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Payment History</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {payments.map(payment => (
            <PaymentCard
              key={payment.id}
              payment={payment}
            />
          ))}
        </div>
      </div>
    </div>
  );
}; 