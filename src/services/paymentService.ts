import { supabase } from '@/integrations/supabase/client';

export interface PaymentDetails {
  projectId: string;
  clientId: string;
  professionalId: string;
  amount: number;
  description: string;
  customerEmail: string;
  customerName: string;
}

export class PaymentService {
  static async initiatePayment(paymentDetails: PaymentDetails) {
    try {
      // Create payment record in database
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert({
          project_id: paymentDetails.projectId,
          client_id: paymentDetails.clientId,
          professional_id: paymentDetails.professionalId,
          amount: paymentDetails.amount,
          status: 'pending',
          created_at: new Date().toISOString(),
          payment_method: 'test_mode'
        })
        .select()
        .single();

      if (paymentError) throw paymentError;

      // Simulate payment URL (in test mode, this would be the success page)
      const paymentUrl = `/payment/success?payment_id=${payment.id}`;

      return {
        paymentId: payment.id,
        paymentUrl
      };
    } catch (error) {
      console.error('Payment initiation error:', error);
      throw new Error('Failed to initiate payment');
    }
  }

  static async handlePaymentSuccess(paymentId: string) {
    try {
      // Get payment details
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .select('*')
        .eq('id', paymentId)
        .single();

      if (paymentError) throw paymentError;

      // Update payment status
      const { error: updateError } = await supabase
        .from('payments')
        .update({
          status: 'completed',
          paid_at: new Date().toISOString()
        })
        .eq('id', paymentId);

      if (updateError) throw updateError;

      // Update project status
      const { error: projectError } = await supabase
        .from('projects')
        .update({ status: 'paid' })
        .eq('id', payment.project_id);

      if (projectError) throw projectError;

      // Create project update
      await supabase.from('project_updates').insert({
        project_id: payment.project_id,
        update_type: 'payment_completed',
        message: 'Payment has been completed successfully (Test Mode)',
        professional_id: payment.professional_id,
        metadata: {
          payment_id: paymentId,
          test_mode: true
        }
      });

      return true;
    } catch (error) {
      console.error('Payment success handling error:', error);
      throw new Error('Failed to process payment success');
    }
  }

  static async handlePaymentCancel(paymentId: string) {
    try {
      // Update payment status
      const { error: updateError } = await supabase
        .from('payments')
        .update({
          status: 'cancelled',
          paid_at: new Date().toISOString()
        })
        .eq('id', paymentId);

      if (updateError) throw updateError;

      return true;
    } catch (error) {
      console.error('Payment cancellation error:', error);
      throw new Error('Failed to process payment cancellation');
    }
  }

  static async getPaymentStatus(paymentId: string) {
    try {
      const { data: payment, error } = await supabase
        .from('payments')
        .select('*')
        .eq('id', paymentId)
        .single();

      if (error) throw error;
      return payment.status;
    } catch (error) {
      console.error('Payment status check error:', error);
      throw new Error('Failed to check payment status');
    }
  }
} 