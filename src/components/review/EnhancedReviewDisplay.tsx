import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ThumbsUp, MessageSquare, Flag } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  reviewer: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  helpful_count: number;
  is_helpful?: boolean;
  reported?: boolean;
}

interface EnhancedReviewDisplayProps {
  review: Review;
  profileId: string;
  onReviewUpdate?: () => void;
}

export const EnhancedReviewDisplay: React.FC<EnhancedReviewDisplayProps> = ({
  review,
  profileId,
  onReviewUpdate
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleHelpful = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('review_helpful')
        .upsert({
          review_id: review.id,
          user_id: profileId,
          is_helpful: !review.is_helpful
        });

      if (error) throw error;

      onReviewUpdate?.();
      toast({
        title: review.is_helpful ? 'Removed helpful vote' : 'Marked as helpful',
        variant: 'default'
      });
    } catch (error) {
      console.error('Error updating helpful status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update helpful status.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReport = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('review_reports')
        .upsert({
          review_id: review.id,
          reporter_id: profileId,
          status: 'pending'
        });

      if (error) throw error;

      onReviewUpdate?.();
      toast({
        title: 'Review reported',
        description: 'Our team will review this report.',
        variant: 'default'
      });
    } catch (error) {
      console.error('Error reporting review:', error);
      toast({
        title: 'Error',
        description: 'Failed to report review.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={review.reviewer.avatar_url} />
            <AvatarFallback>
              {review.reviewer.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg font-semibold">
              {review.reviewer.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{review.rating}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm">{review.comment}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleHelpful}
              disabled={isSubmitting}
              className={review.is_helpful ? 'text-primary' : ''}
            >
              <ThumbsUp className="mr-2 h-4 w-4" />
              {review.helpful_count} Helpful
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={isSubmitting}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Reply
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReport}
            disabled={isSubmitting || review.reported}
            className={review.reported ? 'text-destructive' : ''}
          >
            <Flag className="mr-2 h-4 w-4" />
            {review.reported ? 'Reported' : 'Report'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}; 