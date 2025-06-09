import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Star, MessageSquare } from 'lucide-react';
import EnhancedReviewForm from '@/components/reviews/EnhancedReviewForm';

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
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [hasSubmittedReview, setHasSubmittedReview] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if form should be visible
  const isVisible = projectStatus === 'completed';

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

  const handleReviewSubmit = async (reviewData: any) => {
    try {
      // Create project update
      await supabase.from('project_updates').insert({
        project_id: projectId,
        update_type: 'review',
        message: `${isClient ? 'Client' : 'Professional'} has submitted a review`,
        professional_id: user?.id,
        metadata: {
          review_submitted: true
        }
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
    }
  };

  if (!isVisible || isLoading || hasSubmittedReview) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Submit Review
        </CardTitle>
        <p className="text-sm text-gray-600">
          Share your experience working on this project. Your feedback helps build trust in the community.
        </p>
      </CardHeader>
      <CardContent>
        <Button
          onClick={() => setShowReviewModal(true)}
          className="w-full"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Write a Review
        </Button>

        {showReviewModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <EnhancedReviewForm
                projectId={projectId}
                revieweeId={user?.id || ''}
                revieweeType={isClient ? 'professional' : 'client'}
                onSubmit={handleReviewSubmit}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 