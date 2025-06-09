import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle, Download, AlertCircle, CreditCard } from 'lucide-react';
import { PaymentService } from '@/services/paymentService';

interface InvoiceSectionProps {
  projectId: string;
  projectStatus: string;
  isClient: boolean;
  isProfessional: boolean;
  onPaymentProcessed: () => void;
}

export default function InvoiceSection({
  projectId,
  projectStatus,
  isClient,
  isProfessional,
  onPaymentProcessed
}: InvoiceSectionProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [invoice, setInvoice] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentNote, setPaymentNote] = useState('');

  // Check if section should be visible
  const isVisible = projectStatus === 'completed' || projectStatus === 'paid';

  // Fetch invoice on mount
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setIsLoading(true);
        
        // Check if invoice exists
        const { data, error } = await supabase
          .from('invoices')
          .select('*')
          .eq('project_id', projectId)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
          throw error;
        }

        if (!data && projectStatus === 'completed') {
          // Create new invoice if project is completed and no invoice exists
          const { data: projectData, error: projectError } = await supabase
            .from('projects')
            .select('client_id, professional_id, budget')
            .eq('id', projectId)
            .single();

          if (projectError) throw projectError;

          const { data: newInvoice, error: createError } = await supabase
            .from('invoices')
            .insert([{
              project_id: projectId,
              client_id: projectData.client_id,
              professional_id: projectData.professional_id,
              amount: projectData.budget,
              status: 'pending',
              created_at: new Date().toISOString()
            }])
            .select()
            .single();

          if (createError) throw createError;
          setInvoice(newInvoice);
        } else {
          setInvoice(data);
        }
      } catch (error) {
        console.error('Error fetching/creating invoice:', error);
        toast({
          title: "Error",
          description: "Failed to load invoice details. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (isVisible) {
      fetchInvoice();
    }
  }, [projectId, projectStatus, toast]);

  // Handle payment initiation
  const handlePaymentInitiation = async () => {
    try {
      setIsSubmitting(true);

      // Get project details
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('title, client:profiles!projects_client_id_fkey(email, first_name, last_name)')
        .eq('id', projectId)
        .single();

      if (projectError) throw projectError;

      // Initiate test payment
      const { paymentUrl } = await PaymentService.initiatePayment({
        projectId,
        clientId: user?.id || '',
        professionalId: invoice.professional_id,
        amount: invoice.amount,
        description: `Payment for project: ${projectData.title}`,
        customerEmail: projectData.client.email,
        customerName: `${projectData.client.first_name} ${projectData.client.last_name}`
      });

      // Redirect to success page (simulating payment completion)
      window.location.href = paymentUrl;
    } catch (error) {
      console.error('Error initiating payment:', error);
      toast({
        title: "Error",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible || isLoading) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Invoice Details</CardTitle>
      </CardHeader>
      <CardContent>
        {invoice ? (
          <div className="space-y-6">
            {/* Invoice Status Banner */}
            {(invoice.status === 'paid' || projectStatus === 'paid') ? (
              <div className="bg-green-50 p-4 rounded-lg text-green-800 border border-green-200">
                <div className="flex items-center">
                  <CheckCircle className="mr-2" size={20} />
                  <h3 className="font-medium">Payment Processed</h3>
                </div>
                <p className="text-sm mt-1">
                  Payment was processed on {invoice.paid_at ? new Date(invoice.paid_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            ) : (
              <div className="bg-yellow-50 p-4 rounded-lg text-yellow-800 border border-yellow-200">
                <div className="flex items-center">
                  <AlertCircle className="mr-2" size={20} />
                  <h3 className="font-medium">Payment Pending</h3>
                </div>
                <p className="text-sm mt-1">
                  Invoice was created on {new Date(invoice.created_at).toLocaleDateString()}
                </p>
              </div>
            )}

            {/* Invoice Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="font-medium">TTD {invoice.amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium capitalize">{invoice.status}</p>
              </div>
              {invoice.payment_note && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Payment Note</p>
                  <p className="font-medium">{invoice.payment_note}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {isClient && invoice.status === 'pending' && projectStatus !== 'paid' && (
              <div className="flex gap-4">
                <Button
                  className="flex-1"
                  onClick={handlePaymentInitiation}
                  disabled={isSubmitting}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Process Payment (Test Mode)
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {/* TODO: Implement PDF download */}}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Invoice
                </Button>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500">No invoice found.</p>
        )}
      </CardContent>
    </Card>
  );
} 