import { Review } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard = ({ review }: ReviewCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < review.rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {new Date(review.created_at).toLocaleDateString()}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {review.comment && (
          <p className="text-sm text-muted-foreground">
            {review.comment}
          </p>
        )}
      </CardContent>
    </Card>
  );
}; 