import { Payment } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from '@/utils/currencyUtils';

interface PaymentSummaryProps {
  payments: Payment[];
}

export const PaymentSummary = ({ payments }: PaymentSummaryProps) => {
  const calculateTotalSpent = () => {
    return payments
      .filter(payment => payment.status === 'completed')
      .reduce((total, payment) => total + payment.amount, 0);
  };

  const calculatePendingAmount = () => {
    return payments
      .filter(payment => payment.status === 'pending')
      .reduce((total, payment) => total + payment.amount, 0);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Total Spent</CardTitle>
          <CardDescription>Total amount paid for completed projects</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{formatCurrency(calculateTotalSpent())}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pending Payments</CardTitle>
          <CardDescription>Total amount pending for approval</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{formatCurrency(calculatePendingAmount())}</p>
        </CardContent>
      </Card>
    </div>
  );
}; 