import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/useToast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StarRating } from '@/components/ui/star-rating';
import { Loader2 } from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  project?: {
    id: string;
    title: string;
  };
  client: {
    id: string;
    full_name: string;
    profile_image: string | null;
  };
}

interface ReviewsTabProps {
  professionalId: string;
}

export const ReviewsTab: React.FC<ReviewsTabProps> = ({ professionalId }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetchReviews();
  }, [professionalId]);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          project:projects (
            id,
            title
          ),
          client:profiles!reviews_client_id_fkey (
            id,
            full_name,
            profile_image
          )
        `)
        .eq('professional_id', professionalId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: 'Error',
        description: 'Failed to load reviews',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Reviews & Ratings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-6">
            <StarRating value={Number(calculateAverageRating())} onChange={() => {}} />
            <span className="ml-2 text-2xl font-bold">{calculateAverageRating()}</span>
            <span className="ml-2 text-muted-foreground">({reviews.length} reviews)</span>
          </div>

          {reviews.length === 0 ? (
            <p className="text-muted-foreground">No reviews yet.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <img
                      src={review.client.profile_image || '/default-avatar.png'}
                      alt={review.client.full_name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="font-medium">{review.client.full_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="mb-2">
                    <StarRating value={review.rating} onChange={() => {}} />
                  </div>
                  <p className="text-sm">{review.comment}</p>
                  {review.project && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Project: {review.project.title}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
