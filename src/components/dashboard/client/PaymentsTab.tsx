import React from 'react';
import { Payment } from '@/types';

interface PaymentsTabProps {
  payments: Payment[];
  isLoading: boolean;
}

const PaymentsTab: React.FC<PaymentsTabProps> = ({ payments, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No payment records found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Payment History</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="px-4 py-2 text-left">Project</th>
              <th className="px-4 py-2 text-left">Professional</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-b hover:bg-muted/50">
                <td className="px-4 py-3">{payment.project?.title || 'Unknown Project'}</td>
                <td className="px-4 py-3">
                  {payment.professional ? 
                    `${payment.professional.first_name || ''} ${payment.professional.last_name || ''}`.trim() || 'Unknown' 
                    : 'Unknown'}
                </td>
                <td className="px-4 py-3">${payment.amount.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                    payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {payment.paid_at ? 
                    new Date(payment.paid_at).toLocaleDateString() : 
                    new Date(payment.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentsTab;
