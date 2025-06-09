import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, Loader2 } from 'lucide-react';
import { PaymentService } from '@/services/paymentService';
import { useToast } from '@/components/ui/use-toast';

export default function PaymentCancel() {
  const router = useRouter();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(true);
  const { payment_id } = router.query;

  useEffect(() => {
    const processCancellation = async () => {
      if (!payment_id) return;

      try {
        await PaymentService.handlePaymentCancel(payment_id as string);
        toast({
          title: "Payment Cancelled",
          description: "Your payment has been cancelled successfully."
        });
      } catch (error) {
        console.error('Payment cancellation error:', error);
        toast({
          title: "Error",
          description: "Failed to process payment cancellation. Please contact support.",
          variant: "destructive"
        });
      } finally {
        setIsProcessing(false);
      }
    };

    processCancellation();
  }, [payment_id, toast]);

  return (
    <Layout>
      <div className="container-custom py-12">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Payment Cancelled</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {isProcessing ? (
              <div className="space-y-4">
                <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
                <p className="text-lg">Processing cancellation...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <XCircle className="h-16 w-16 text-red-600 mx-auto" />
                <div>
                  <h2 className="text-2xl font-bold mb-2">Payment Cancelled</h2>
                  <p className="text-gray-600">
                    Your payment has been cancelled. No charges were made to your account.
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