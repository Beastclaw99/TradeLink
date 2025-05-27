
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Download, CreditCard, Banknote } from 'lucide-react';

interface Payment {
  id: string;
  projectTitle: string;
  professional: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  method: 'paypal' | 'direct_deposit';
  date: string;
  invoiceUrl?: string;
}

const PaymentStatusDashboard: React.FC = () => {
  // Mock payment data
  const payments: Payment[] = [
    {
      id: 'PAY-001',
      projectTitle: 'Kitchen Plumbing Repair',
      professional: 'John Smith',
      amount: 2500,
      status: 'completed',
      method: 'paypal',
      date: '2024-01-15',
      invoiceUrl: '#'
    },
    {
      id: 'PAY-002',
      projectTitle: 'Electrical Panel Upgrade',
      professional: 'Maria Rodriguez',
      amount: 3200,
      status: 'processing',
      method: 'direct_deposit',
      date: '2024-01-16'
    },
    {
      id: 'PAY-003',
      projectTitle: 'Bathroom Renovation',
      professional: 'David Williams',
      amount: 1800,
      status: 'pending',
      method: 'paypal',
      date: '2024-01-17'
    }
  ];

  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
    processing: { color: 'bg-blue-100 text-blue-800', text: 'Processing' },
    completed: { color: 'bg-green-100 text-green-800', text: 'Completed' },
    failed: { color: 'bg-red-100 text-red-800', text: 'Failed' }
  };

  const methodConfig = {
    paypal: { icon: CreditCard, text: 'PayPal' },
    direct_deposit: { icon: Banknote, text: 'Direct Deposit' }
  };

  const totalPending = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalCompleted = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">TTD {totalPending.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">
              {payments.filter(p => p.status === 'pending').length} payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              TTD {payments.filter(p => p.status === 'processing').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {payments.filter(p => p.status === 'processing').length} payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">TTD {totalCompleted.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">
              {payments.filter(p => p.status === 'completed').length} payments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods Setup */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <CreditCard className="h-6 w-6 text-blue-600" />
                <h3 className="font-medium">PayPal</h3>
                <Badge variant="secondary">Connected</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Fast and secure payments via PayPal
              </p>
              <Button variant="outline" size="sm">Manage</Button>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Banknote className="h-6 w-6 text-green-600" />
                <h3 className="font-medium">Direct Deposit</h3>
                <Badge variant="outline">Setup Required</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Direct bank transfers for local payments
              </p>
              <Button variant="outline" size="sm">Setup</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment ID</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Professional</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => {
                const MethodIcon = methodConfig[payment.method].icon;
                return (
                  <TableRow key={payment.id}>
                    <TableCell className="font-mono text-sm">{payment.id}</TableCell>
                    <TableCell>{payment.projectTitle}</TableCell>
                    <TableCell>{payment.professional}</TableCell>
                    <TableCell className="font-medium">
                      TTD {payment.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MethodIcon className="h-4 w-4" />
                        {methodConfig[payment.method].text}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusConfig[payment.status].color}>
                        {statusConfig[payment.status].text}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(payment.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {payment.invoiceUrl && (
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentStatusDashboard;
