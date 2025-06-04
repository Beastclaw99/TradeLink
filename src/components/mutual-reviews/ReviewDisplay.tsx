import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StarRating } from '@/components/ui/star-rating';
import { format } from 'date-fns';

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  reviewer: {
    id: string;
    firstName: string;
    lastName: string;
    type: 'client' | 'professional';
  };
}

interface ReviewDisplayProps {
  reviews: Review[];
  type: 'client' | 'professional';
}

const ReviewDisplay: React.FC<ReviewDisplayProps> = ({ reviews, type }) => {
  const filteredReviews = reviews.filter(review => review.reviewer.type === type);

  if (filteredReviews.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          No {type} reviews yet
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {filteredReviews.map((review) => (
        <Card key={review.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {review.reviewer.firstName} {review.reviewer.lastName}
              </CardTitle>
              <span className="text-sm text-gray-500">
                {format(new Date(review.createdAt), 'MMM d, yyyy')}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <StarRating value={review.rating} onChange={() => {}} />
              <p className="text-gray-700">{review.comment}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ReviewDisplay; 