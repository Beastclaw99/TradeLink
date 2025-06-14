
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, MessageSquare, Calendar } from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string | null;
  client_id: string | null;
  project_id: string | null;
  status: string;
  is_verified: boolean;
  communication_rating?: number | null;
  quality_rating?: number | null;
  timeliness_rating?: number | null;
  professionalism_rating?: number | null;
}

interface ReviewsTabProps {
  isLoading: boolean;
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

const ReviewsTab: React.FC<ReviewsTabProps> = ({
  isLoading,
  reviews,
  averageRating,
  totalReviews
}) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-8 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
        
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
      </div>
    );
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getStatusColor = (status: string, isVerified: boolean) => {
    if (status === 'approved' && isVerified) {
      return 'bg-green-100 text-green-800';
    } else if (status === 'approved') {
      return 'bg-blue-100 text-blue-800';
    } else if (status === 'pending') {
      return 'bg-yellow-100 text-yellow-800';
    } else {
      return 'bg-gray-100 text-gray-800';
    }
  };

  // Convert reviews with proper rating handling
  const processedReviews = reviews.map(review => ({
    ...review,
    rating: review.rating || 0
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Reviews & Ratings</h2>
      
      {/* Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              {renderStars(Math.round(averageRating))}
            </div>
            <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold">{totalReviews}</div>
            <div className="text-sm text-gray-600">Total Reviews</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold">
              {processedReviews.filter(r => r.is_verified).length}
            </div>
            <div className="text-sm text-gray-600">Verified Reviews</div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews List */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Recent Reviews</h3>
        
        {processedReviews.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h3>
              <p className="text-gray-600">
                Complete your first project to start receiving reviews from clients.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {processedReviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating)}
                        </div>
                        <Badge className={getStatusColor(review.status, review.is_verified)}>
                          {review.is_verified ? 'Verified' : review.status}
                        </Badge>
                      </div>
                      
                      {review.comment && (
                        <p className="text-gray-700 mb-3">{review.comment}</p>
                      )}
                      
                      {/* Detailed Ratings */}
                      {(review.communication_rating || review.quality_rating || review.timeliness_rating || review.professionalism_rating) && (
                        <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                          {review.communication_rating && (
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Communication:</span>
                              <div className="flex items-center gap-1">
                                {renderStars(review.communication_rating)}
                              </div>
                            </div>
                          )}
                          {review.quality_rating && (
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Quality:</span>
                              <div className="flex items-center gap-1">
                                {renderStars(review.quality_rating)}
                              </div>
                            </div>
                          )}
                          {review.timeliness_rating && (
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Timeliness:</span>
                              <div className="flex items-center gap-1">
                                {renderStars(review.timeliness_rating)}
                              </div>
                            </div>
                          )}
                          {review.professionalism_rating && (
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Professionalism:</span>
                              <div className="flex items-center gap-1">
                                {renderStars(review.professionalism_rating)}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {review.created_at ? new Date(review.created_at).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsTab;
