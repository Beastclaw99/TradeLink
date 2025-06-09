import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StarRating } from "@/components/ui/star-rating";
import { Review } from '../types';

interface ReviewsTabProps {
  isLoading: boolean;
  reviews: Review[];
  calculateAverageRating: () => string | number;
}

const ReviewsTab: React.FC<ReviewsTabProps> = ({ 
  isLoading, 
  reviews, 
  calculateAverageRating 
}) => {
  return (
    <>
      <div className="flex items-center mb-8">
        <div className="flex-1">
          <h2 className="text-2xl font-bold">Your Reviews</h2>
          <p className="text-ttc-neutral-600">See what clients are saying about your work</p>
        </div>
        
        <div className="flex items-center gap-2">
          <StarRating
            value={Number(calculateAverageRating())}
            onChange={() => {}}
            className="mt-2"
          />
          <span className="text-lg font-bold">{calculateAverageRating()}</span>
          <span className="text-ttc-neutral-500">({reviews.length} reviews)</span>
        </div>
      </div>
      
      {isLoading ? (
        <p>Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8">
          <StarRating
            value={0}
            onChange={() => {}}
            className="w-12 h-12 mx-auto text-ttc-neutral-400"
          />
          <p className="mt-4 text-ttc-neutral-600">No reviews yet.</p>
          <p className="mt-2 text-sm text-ttc-neutral-500">
            Complete projects to start receiving reviews from clients.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map(review => (
            <Card key={review.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Project Review</CardTitle>
                  <StarRating
                    value={review.rating || 0}
                    onChange={() => {}}
                    className="mt-2"
                  />
                </div>
                <CardDescription>
                  {new Date(review.created_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-ttc-neutral-700">{review.comment}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
};

export default ReviewsTab;
