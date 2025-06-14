import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign, Star } from 'lucide-react';
import { Project, Application, Review } from '@/types/database';

interface PaymentsTabProps {
  isLoading: boolean;
  projects: Project[];
  reviews: Review[];
  applications: Application[];
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
  payments: any[];
  onPaymentViewDetails: (paymentId: string) => void;
  onPaymentApprove: (paymentId: string) => Promise<void>;
  onPaymentReject: (paymentId: string) => Promise<void>;
}

const PaymentsTab: React.FC<PaymentsTabProps> = ({
  isLoading,
  projects,
  reviews,
  applications,
  projectToReview,
  reviewData,
  isSubmitting,
  handleReviewInitiate,
  handleReviewCancel,
  handleReviewSubmit,
  setReviewData,
  payments,
  onPaymentViewDetails
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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Payments & Reviews</h2>
      
      {completedProjects.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <DollarSign className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Completed Projects</h3>
            <p className="text-gray-600">
              Completed projects will appear here for payment and review.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {completedProjects.map((project) => {
            const projectReview = reviews.find(r => r.project_id === project.id);
            const application = applications.find(a => a.project_id === project.id && a.status === 'accepted');
            
            return (
              <Card key={project.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{project.title}</span>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      Completed
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-600">Budget:</span>
                        <p className="font-medium">${project.budget}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Professional:</span>
                        <p className="font-medium">{application?.professional_id}</p>
                      </div>
                    </div>

                    {projectReview ? (
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-2">Your Review</h4>
                        <div className="flex items-center mb-2">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= (projectReview.rating || 0)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-600">
                            {projectReview.rating}/5
                          </span>
                        </div>
                        <p className="text-gray-700">{projectReview.comment}</p>
                      </div>
                    ) : (
                      <div className="border-t pt-4">
                        <Button
                          onClick={() => handleReviewInitiate(project)}
                          className="w-full"
                        >
                          Leave Review
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {projectToReview && (
        <Card>
          <CardHeader>
            <CardTitle>Review Project: {projectToReview.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-6 h-6 cursor-pointer ${
                        star <= reviewData.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                      onClick={() => setReviewData({ ...reviewData, rating: star })}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Comment</label>
                <textarea
                  className="w-full p-2 border rounded-md"
                  rows={4}
                  value={reviewData.comment}
                  onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                  placeholder="Share your experience working with this professional..."
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
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PaymentsTab;
