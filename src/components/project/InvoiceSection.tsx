
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { DollarSign, Plus, FileText } from 'lucide-react';

interface InvoiceSectionProps {
  projectId: string;
  userRole: 'client' | 'professional';
}

const InvoiceSection: React.FC<InvoiceSectionProps> = ({
  projectId,
  userRole
}) => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    description: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchInvoices();
  }, [projectId]);

  const fetchInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch invoices.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateInvoice = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: project } = await supabase
        .from('projects')
        .select('client_id, professional_id')
        .eq('id', projectId)
        .single();

      if (!user || !project) throw new Error('User or project not found');

      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Please enter a valid amount');
      }

      const invoiceData = {
        project_id: projectId,
        client_id: project.client_id,
        professional_id: project.professional_id,
        amount: amount,
        status: 'unpaid' as const,
        issued_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('invoices')
        .insert([invoiceData]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Invoice created successfully.'
      });

      setShowCreateForm(false);
      setFormData({ amount: '', description: '' });
      fetchInvoices();
    } catch (error: any) {
      console.error('Error creating invoice:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create invoice.',
        variant: 'destructive'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      paid: 'bg-green-100 text-green-800',
      unpaid: 'bg-yellow-100 text-yellow-800',
      overdue: 'bg-red-100 text-red-800'
    };

    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    );
  };

  if (isLoading) {
    return <div>Loading invoices...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Invoices
          </CardTitle>
          {userRole === 'professional' && (
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Invoice
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {showCreateForm && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <h3 className="font-medium mb-4">Create New Invoice</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Invoice description..."
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateInvoice}>
                  Create Invoice
                </Button>
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {invoices.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>No invoices found for this project.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Issued</TableHead>
                <TableHead>Paid</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>
                    ${typeof invoice.amount === 'number' ? invoice.amount.toFixed(2) : '0.00'}
                  </TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell>
                    {invoice.issued_at ? format(new Date(invoice.issued_at), 'PPP') : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {invoice.paid_at ? format(new Date(invoice.paid_at), 'PPP') : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default InvoiceSection;
