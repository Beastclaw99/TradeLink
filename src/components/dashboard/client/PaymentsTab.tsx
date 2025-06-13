import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { StarIcon, CreditCard, Clock, CheckCircle } from 'lucide-react';
import { Project, Application, Review } from '../types';

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
  setReviewData
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // Filter projects that can be reviewed (completed projects without reviews)
  const completedProjects = projects.filter(project => 
    project.status === 'completed'
  );

  const projectsWithReviews = reviews.map(review => review.project_id);
  const projectsToReview = completedProjects.filter(project => 
    !projectsWithReviews.includes(project.id)
  );

  const getStatusBadge = (status: string | null) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      failed: { color: 'bg-red-100 text-red-800', icon: CreditCard },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <Badge variant="outline" className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
      </Badge>
    );
  };

  const StarRating = ({ rating, onRatingChange, interactive = false }: { 
    rating: number; 
    onRatingChange?: (rating: number) => void;
    interactive?: boolean;
  }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={`h-5 w-5 ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={() => interactive && onRatingChange?.(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Payments & Reviews</h2>
        <p className="text-gray-600">
          Manage project payments and leave reviews for completed work
        </p>
      </div>

      {/* Completed Projects Available for Review */}
      {projectsToReview.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Projects Ready for Review</h3>
          <div className="grid gap-4">
            {projectsToReview.map(project => (
              <Card key={project.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      <CardDescription>
                        Completed on {project.updated_at ? format(new Date(project.updated_at), 'MMM d, yyyy') : 'Unknown date'}
                      </CardDescription>
                    </div>
                    {getStatusBadge(project.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">
                        Budget: TTD {project.budget?.toLocaleString() || 'Not specified'}
                      </p>
                      <p className="text-sm text-gray-600">
                        Professional: {project.professional?.first_name} {project.professional?.last_name}
                      </p>
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

      {/* Review Form Modal */}
      {projectToReview && (
        <Card>
          <CardHeader>
            <CardTitle>Review Project: {projectToReview.title}</CardTitle>
            <CardDescription>
              Share your experience working with the professional
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Overall Rating
                </label>
                <StarRating 
                  rating={reviewData.rating} 
                  onRatingChange={(rating) => setReviewData({ ...reviewData, rating })}
                  interactive
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Review Comment
                </label>
                <textarea
                  className="w-full p-3 border rounded-md"
                  rows={4}
                  value={reviewData.comment}
                  onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                  placeholder="Share details about your experience..."
                />
              </div>
              
              <div className="flex gap-2">
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

      {/* Existing Reviews */}
      {reviews.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Your Reviews</h3>
          <div className="grid gap-4">
            {reviews.map(review => {
              const project = projects.find(p => p.id === review.project_id);
              return (
                <Card key={review.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {project?.title || 'Unknown Project'}
                        </CardTitle>
                        <CardDescription>
                          Reviewed on {review.created_at ? format(new Date(review.created_at), 'MMM d, yyyy') : 'Unknown date'}
                        </CardDescription>
                      </div>
                      <StarRating rating={review.rating || 0} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{review.comment}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {projectsToReview.length === 0 && reviews.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No Payment History</h3>
            <p className="text-gray-500">
              Completed projects and payment information will appear here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PaymentsTab;
