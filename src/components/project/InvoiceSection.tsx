import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle, Download, AlertCircle } from 'lucide-react';

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

  // Handle payment confirmation
  const handlePaymentConfirmation = async () => {
    try {
      setIsSubmitting(true);

      // Update invoice status
      const { error: invoiceError } = await supabase
        .from('invoices')
        .update({ 
          status: 'paid',
          payment_note: paymentNote,
          paid_at: new Date().toISOString()
        })
        .eq('id', invoice.id);

      if (invoiceError) throw invoiceError;

      // Update project status
      const { error: projectError } = await supabase
        .from('projects')
        .update({ status: 'paid' })
        .eq('id', projectId);

      if (projectError) throw projectError;

      // Create project update
      await supabase.from('project_updates').insert([{
        project_id: projectId,
        update_type: 'status_update',
        message: 'Payment has been processed',
        created_by: user?.id,
        metadata: {
          status_change: 'paid'
        }
      }]);

      // Send message to project chat
      await supabase.from('project_messages').insert([{
        project_id: projectId,
        sender_id: user?.id,
        content: 'Payment has been processed successfully.',
        sent_at: new Date().toISOString(),
        metadata: {
          type: 'payment_processed',
          title: 'Payment Processed'
        }
      }]);

      toast({
        title: "Payment Processed",
        description: "The payment has been processed successfully."
      });

      setShowPaymentModal(false);
      onPaymentProcessed();
    } catch (error: any) {
      console.error('Error processing payment:', error);
      toast({
        title: "Error",
        description: "Failed to process payment. Please try again.",
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
            {invoice.status === 'paid' ? (
              <div className="bg-green-50 p-4 rounded-lg text-green-800 border border-green-200">
                <div className="flex items-center">
                  <CheckCircle className="mr-2" size={20} />
                  <h3 className="font-medium">Payment Processed</h3>
                </div>
                <p className="text-sm mt-1">
                  Payment was processed on {new Date(invoice.paid_at).toLocaleDateString()}
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
                <p className="font-medium">${invoice.amount}</p>
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
            {isClient && invoice.status === 'pending' && (
              <div className="flex gap-4">
                <Button
                  className="flex-1"
                  onClick={() => setShowPaymentModal(true)}
                  disabled={isSubmitting}
                >
                  Mark as Paid
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

      {/* Payment Confirmation Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Payment</DialogTitle>
            <DialogDescription>
              Please confirm that you have processed the payment of ${invoice?.amount} for this project.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="paymentNote">Payment Note (Optional)</Label>
                <Textarea
                  id="paymentNote"
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                  placeholder="Add any notes about the payment..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPaymentModal(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePaymentConfirmation}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Confirm Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
} 