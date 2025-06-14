import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign, Calendar, CheckCircle, AlertCircle, Star } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Project, Payment, Review, Application, Profile } from '@/types/database';

interface PaymentsTabProps {
  isLoading: boolean;
  projects: Project[];
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
  payments: Payment[];
  onPaymentViewDetails: (paymentId: string) => void;
  onPaymentApprove: (paymentId: string) => Promise<void>;
  onPaymentReject: (paymentId: string) => Promise<void>;
}

const PaymentsTab: React.FC<PaymentsTabProps> = ({
  isLoading,
  projects,
  reviews,
  projectToReview,
  reviewData,
  isSubmitting,
  handleReviewInitiate,
  handleReviewCancel,
  handleReviewSubmit,
  setReviewData,
  payments,
  onPaymentViewDetails,
  onPaymentApprove,
  onPaymentReject
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

  const completedProjects = projects.filter(p => p.status === 'completed');
  const projectsNeedingReview = completedProjects.filter(project => 
    !reviews.some(review => review.project_id === project.id)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Payments & Reviews</h2>
      </div>

      {/* Review Form Modal */}
      {projectToReview && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle>Leave a Review</CardTitle>
            <CardDescription>
              Review your experience with the professional for: {projectToReview.title}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Rating</Label>
              <div className="flex space-x-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewData({ ...reviewData, rating: star })}
                    className={`p-1 ${star <= reviewData.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                  >
                    <Star className="w-6 h-6 fill-current" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="review-comment">Comment</Label>
              <Textarea
                id="review-comment"
                value={reviewData.comment}
                onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                placeholder="Share your experience with this professional..."
                rows={4}
              />
            </div>

            <div className="flex space-x-2">
              <Button 
                onClick={handleReviewSubmit}
                disabled={isSubmitting || reviewData.rating === 0}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </Button>
              <Button variant="outline" onClick={handleReviewCancel}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Projects Needing Review */}
      {projectsNeedingReview.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Projects Ready for Review</h3>
          <div className="grid gap-4">
            {projectsNeedingReview.map((project) => (
              <Card key={project.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{project.title}</h4>
                      <p className="text-gray-600">Budget: ${project.budget}</p>
                    </div>
                    <Button onClick={() => handleReviewInitiate(project)}>
                      Leave Review
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Payment History */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Payment History</h3>
        {payments.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <DollarSign className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Payments Yet</h3>
              <p className="text-gray-600">
                Payment history will appear here once you start working with professionals.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => (
              <Card key={payment.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">Payment #{payment.id.slice(0, 8)}</h4>
                      <p className="text-gray-600">Amount: ${payment.amount}</p>
                      <p className="text-sm text-gray-500">
                        {payment.created_at && new Date(payment.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={payment.status === 'completed' ? 'default' : 'secondary'}>
                        {payment.status || 'pending'}
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onPaymentViewDetails(payment.id)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Submitted Reviews */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Your Reviews</h3>
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Star className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h3>
              <p className="text-gray-600">
                Reviews you submit will appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => {
              const project = projects.find(p => p.id === review.project_id);
              return (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{project?.title || 'Unknown Project'}</h4>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span>{review.rating}/5</span>
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-gray-700 mb-2">{review.comment}</p>
                    )}
                    <p className="text-sm text-gray-500">
                      {review.created_at && new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentsTab;
