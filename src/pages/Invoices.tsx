
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye, DollarSign } from 'lucide-react';

const Invoices: React.FC = () => {
  // Mock data for invoices
  const invoices = [
    {
      id: "INV-001",
      professional: "John Smith",
      project: "Kitchen Renovation",
      amount: 2500.00,
      status: "paid",
      date: "2024-03-15",
      dueDate: "2024-03-30"
    },
    {
      id: "INV-002", 
      professional: "Maria Rodriguez",
      project: "Bathroom Upgrade",
      amount: 1800.00,
      status: "pending",
      date: "2024-03-10",
      dueDate: "2024-03-25"
    },
    {
      id: "INV-003",
      professional: "David Johnson", 
      project: "Deck Construction",
      amount: 3200.00,
      status: "overdue",
      date: "2024-02-28",
      dueDate: "2024-03-15"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalPaid = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);
  const totalPending = invoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.amount, 0);
  const totalOverdue = invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <Layout>
      <div className="bg-ttc-blue-800 py-12 text-white">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-4">Invoices</h1>
          <p className="text-xl text-blue-50">
            Manage your payments and billing history with contractors.
          </p>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500 flex items-center">
                <DollarSign className="mr-2 h-4 w-4" />
                Total Paid
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">${totalPaid.toFixed(2)}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500 flex items-center">
                <DollarSign className="mr-2 h-4 w-4" />
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-yellow-600">${totalPending.toFixed(2)}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500 flex items-center">
                <DollarSign className="mr-2 h-4 w-4" />
                Overdue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-600">${totalOverdue.toFixed(2)}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500 flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Total Invoices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{invoices.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Invoices List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
            <CardDescription>
              View and manage your payment history with contractors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="font-medium">{invoice.id}</h3>
                        <Badge className={getStatusColor(invoice.status)}>
                          {invoice.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{invoice.professional} - {invoice.project}</p>
                      <div className="flex gap-4 text-sm text-gray-500 mt-1">
                        <span>Issued: {new Date(invoice.date).toLocaleDateString()}</span>
                        <span>Due: {new Date(invoice.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">${invoice.amount.toFixed(2)}</p>
                      <div className="flex gap-2 mt-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        {invoice.status === 'pending' && (
                          <Button size="sm" className="bg-ttc-blue-600 hover:bg-ttc-blue-700">
                            Pay Now
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Invoices;
