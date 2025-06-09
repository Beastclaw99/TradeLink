
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Payment } from '../types';

interface PaymentsTabProps {
  isLoading: boolean;
  payments: Payment[];
  calculatePaymentTotals: () => { received: number; pending: number };
}

const PaymentsTab: React.FC<PaymentsTabProps> = ({ 
  isLoading, 
  payments, 
  calculatePaymentTotals 
}) => {
  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Payment Summary</h2>
      
      {isLoading ? (
        <p>Loading payment information...</p>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700">Received Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">${calculatePaymentTotals().received}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-yellow-700">Pending Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">${calculatePaymentTotals().pending}</p>
              </CardContent>
            </Card>
          </div>
          
          <h3 className="text-xl font-semibold mb-4">Payment History</h3>
          {payments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-ttc-neutral-600">No payment history yet.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map(payment => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.project?.title || 'Unknown Project'}</TableCell>
                    <TableCell>${payment.amount}</TableCell>
                    <TableCell>{new Date(payment.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        payment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {payment.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </>
      )}
    </>
  );
};

export default PaymentsTab;
