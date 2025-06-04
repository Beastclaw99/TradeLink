import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { StarRating } from '@/components/ui/star-rating';
import { Database } from '@/integrations/supabase/types';

// Define the review types
type Review = Database['public']['Tables']['reviews']['Row'];
type ReviewInsert = Database['public']['Tables']['reviews']['Insert'];

interface ReviewFormProps {
  projectId: string;
  projectStatus: string;
  isClient: boolean;
  isProfessional: boolean;
  onReviewSubmitted: () => void;
}

export default function ReviewForm({
  projectId,
  projectStatus,
  isClient,
  isProfessional,
  onReviewSubmitted
}: ReviewFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [hasSubmittedReview, setHasSubmittedReview] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if form should be visible
  const isVisible = projectStatus === 'paid';

  // Fetch existing review on mount
  useEffect(() => {
    const fetchReview = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('project_id', projectId)
          .eq(isClient ? 'client_id' : 'professional_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
          throw error;
        }

        setHasSubmittedReview(!!data);
      } catch (error) {
        console.error('Error fetching review:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isVisible && user) {
      fetchReview();
    }
  }, [projectId, user, isVisible, isClient]);

  // Handle review submission
  const handleReviewSubmit = async () => {
    if (!user?.id) return;

    try {
      setIsSubmitting(true);

      // Get project details to determine recipient
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('client_id, professional_id')
        .eq('id', projectId)
        .single();

      if (projectError) throw projectError;

      // Submit review
      const reviewData: ReviewInsert = {
        project_id: projectId,
        client_id: isClient ? user.id : projectData.client_id,
        professional_id: isClient ? projectData.professional_id : user.id,
        rating,
        comment: comment || null,
        created_at: new Date().toISOString()
      };

      const { error: reviewError } = await supabase
        .from('reviews')
        .insert(reviewData);

      if (reviewError) throw reviewError;

      // Create project update
      await supabase.from('project_updates').insert({
        project_id: projectId,
        update_type: 'review',
        message: `${isClient ? 'Client' : 'Professional'} has submitted a review`,
        created_by: user.id,
        metadata: {
          review_submitted: true
        }
      });

      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback!"
      });

      setShowReviewModal(false);
      setHasSubmittedReview(true);
      onReviewSubmitted();
    } catch (error: any) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible || isLoading || hasSubmittedReview) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Leave a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Share your experience working with the {isClient ? 'professional' : 'client'} on this project.
          </p>
          <Button
            className="w-full"
            onClick={() => setShowReviewModal(true)}
          >
            Write a Review
          </Button>
        </div>
      </CardContent>

      {/* Review Modal */}
      <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
            <DialogDescription>
              Rate your experience and share your feedback.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-6">
              {/* Star Rating */}
              <div>
                <Label>Rating</Label>
                <StarRating
                  value={rating}
                  onChange={setRating}
                  size="large"
                  className="mt-2"
                />
              </div>

              {/* Review Comment */}
              <div>
                <Label htmlFor="comment">Comment (Optional)</Label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience working on this project..."
                  className="min-h-[100px] mt-2"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowReviewModal(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReviewSubmit}
              disabled={isSubmitting || rating === 0}
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
} 