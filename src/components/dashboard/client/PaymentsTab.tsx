
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign } from 'lucide-react';

interface PaymentsTabProps {
  isLoading: boolean;
  // Unused props that might be used in future implementations
  projects: any[];
  reviews: any[];
  applications: any[];
  projectToReview: any;
  reviewData: {
    rating: number;
    comment: string;
  };
  isSubmitting: boolean;
  handleReviewInitiate: (project: any) => void;
  handleReviewCancel: () => void;
  handleReviewSubmit: () => Promise<void>;
  setReviewData: (data: { rating: number; comment: string }) => void;
  payments: any[];
  onPaymentViewDetails: (paymentId: string) => void;
  onPaymentApprove: (paymentId: string) => Promise<void>;
  onPaymentReject: (paymentId: string) => Promise<void>;
}

const PaymentsTab: React.FC<PaymentsTabProps> = ({
  isLoading,
  // Note: All props are declared but not used yet in the current implementation
  // They're kept for future payment functionality implementation
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Payments & Reviews</h2>
      
      <Card>
        <CardContent className="p-6 text-center">
          <DollarSign className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Payment System</h3>
          <p className="text-gray-600">
            Payment management features will be available here once projects are completed.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentsTab;
