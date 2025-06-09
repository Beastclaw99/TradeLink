import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2 } from 'lucide-react';
import { PaymentService } from '@/services/paymentService';
import { useToast } from '@/components/ui/use-toast';

export default function PaymentSuccess() {
  const router = useRouter();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(true);
  const { payment_id } = router.query;

  useEffect(() => {
    const processPayment = async () => {
      if (!payment_id) return;

      try {
        const success = await PaymentService.handlePaymentSuccess(payment_id as string);
        
        if (success) {
          toast({
            title: "Payment Successful (Test Mode)",
            description: "Your test payment has been processed successfully."
          });
        } else {
          toast({
            title: "Payment Processing",
            description: "Your test payment is being processed. Please wait a moment."
          });
        }
      } catch (error) {
        console.error('Payment processing error:', error);
        toast({
          title: "Error",
          description: "Failed to process payment. Please contact support.",
          variant: "destructive"
        });
      } finally {
        setIsProcessing(false);
      }
    };

    processPayment();
  }, [payment_id, toast]);

  return (
    <Layout>
      <div className="container-custom py-12">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Test Payment Status</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {isProcessing ? (
              <div className="space-y-4">
                <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
                <p className="text-lg">Processing your test payment...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
                <div>
                  <h2 className="text-2xl font-bold mb-2">Test Payment Successful!</h2>
                  <p className="text-gray-600">
                    This is a test payment. In production, this would be processed through WIPay.
                  </p>
                </div>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => router.push('/dashboard')}>
                    Go to Dashboard
                  </Button>
                  <Button variant="outline" onClick={() => router.push('/projects')}>
                    View Projects
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
} 