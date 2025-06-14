
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database } from '@/integrations/supabase/types';
import { Loader2, DollarSign } from 'lucide-react';

type Project = Database['public']['Tables']['projects']['Row'];
type Payment = Database['public']['Tables']['payments']['Row'];
type Review = Database['public']['Tables']['reviews']['Row'];

interface PaymentsTabProps {
  isLoading: boolean;
  projects: Project[];
  payments: Payment[];
  reviews: Review[];
  projectToReview: Project | null;
  reviewData: {
    rating: number;
    comment: string;
  };
  isSubmitting: boolean;
  handleReviewInitiate: (project: Project) => void;
  handleReviewCancel: () => void;
  handleReviewSubmit: () => Promise<void>;
  setReviewData: (data: { rating: number; comment: string }) => void;
  onPaymentViewDetails: (paymentId: string) => void;
  onPaymentApprove: (paymentId: string) => Promise<void>;
  onPaymentReject: (paymentId: string) => Promise<void>;
}

const PaymentsTab: React.FC<PaymentsTabProps> = ({ 
  isLoading, 
  projects, 
  payments,
  reviews,
  projectToReview,
  reviewData,
  isSubmitting,
  handleReviewInitiate,
  handleReviewCancel,
  handleReviewSubmit,
  setReviewData
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const completedProjects = projects.filter(p => p.status === 'completed');

  return (
    <div className="space-y-4">
      {completedProjects.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <DollarSign className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No completed projects yet.</p>
          </CardContent>
        </Card>
      ) : (
        completedProjects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <CardTitle className="text-lg">{project.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Budget:</span>
                  <span className="font-medium">
                    ${project.budget?.toLocaleString() || 'N/A'}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Status:</span>
                  <Badge variant="default">Completed</Badge>
                </div>

                <Button 
                  size="sm"
                  onClick={() => handleReviewInitiate(project)}
                >
                  Leave Review
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default PaymentsTab;
