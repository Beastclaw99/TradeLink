import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Project } from '@/types/database';

interface ReviewData {
  rating: number;
  communication_rating?: number;
  quality_rating?: number;
  timeliness_rating?: number;
  professionalism_rating?: number;
  comment: string;
}

interface UseEnhancedReviewOperationsProps {
  userId: string;
  onUpdate?: () => void;
}

export const useEnhancedReviewOperations = ({ userId, onUpdate }: UseEnhancedReviewOperationsProps) => {
  const { toast } = useToast();
  const [projectToReview, setProjectToReview] = useState<Project | null>(null);
  const [reviewData, setReviewData] = useState<ReviewData>({
    rating: 0,
    communication_rating: 0,
    quality_rating: 0,
    timeliness_rating: 0,
    professionalism_rating: 0,
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReviewInitiate = (project: Project) => {
    setProjectToReview(project);
    setReviewData({
      rating: 0,
      communication_rating: 0,
      quality_rating: 0,
      timeliness_rating: 0,
      professionalism_rating: 0,
      comment: ''
    });
  };

  const handleReviewCancel = () => {
    setProjectToReview(null);
    setReviewData({
      rating: 0,
      communication_rating: 0,
      quality_rating: 0,
      timeliness_rating: 0,
      professionalism_rating: 0,
      comment: ''
    });
  };

  const handleReviewSubmit = async (projectId: string, revieweeId: string, revieweeType: 'client' | 'professional') => {
    if (!reviewData.rating || !reviewData.comment.trim()) {
      toast({
        title: "Error",
        description: "Please provide a rating and review text.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const reviewDataToSubmit = {
        project_id: projectId,
        [revieweeType === 'client' ? 'client_id' : 'professional_id']: revieweeId,
        rating: reviewData.rating,
        communication_rating: reviewData.communication_rating,
        quality_rating: reviewData.quality_rating,
        timeliness_rating: reviewData.timeliness_rating,
        professionalism_rating: reviewData.professionalism_rating,
        comment: reviewData.comment,
        status: 'pending',
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('reviews')
        .insert(reviewDataToSubmit);

      if (error) throw error;

      // Create project update
      await supabase.from('project_updates').insert({
        project_id: projectId,
        update_type: 'review',
        message: `${revieweeType === 'client' ? 'Client' : 'Professional'} has submitted a review`,
        professional_id: userId,
        metadata: {
          review_submitted: true
        }
      });

      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback! Your review will be visible after moderation."
      });

      handleReviewCancel();
      if (onUpdate) {
        onUpdate();
      }
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

  const handleReviewReport = async (reviewId: string, reason: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({
          status: 'reported',
          reported_at: new Date().toISOString(),
          reported_by: userId,
          report_reason: reason
        })
        .eq('id', reviewId);

      if (error) throw error;

      toast({
        title: "Review Reported",
        description: "Thank you for your report. Our team will review it shortly."
      });
    } catch (error: any) {
      console.error('Error reporting review:', error);
      toast({
        title: "Error",
        description: "Failed to report review. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleReviewHelpfulness = async (reviewId: string, isHelpful: boolean) => {
    try {
      const existingVote = await supabase
        .from('review_helpfulness')
        .select('*')
        .eq('review_id', reviewId)
        .eq('user_id', userId)
        .single();

      if (existingVote.data) {
        if (existingVote.data.is_helpful === isHelpful) {
          // Remove vote if clicking the same button
          await supabase
            .from('review_helpfulness')
            .delete()
            .eq('id', existingVote.data.id);
        } else {
          // Update vote if changing from helpful to not helpful or vice versa
          await supabase
            .from('review_helpfulness')
            .update({ is_helpful: isHelpful })
            .eq('id', existingVote.data.id);
        }
      } else {
        // Add new vote
        await supabase
          .from('review_helpfulness')
          .insert({
            review_id: reviewId,
            user_id: userId,
            is_helpful: isHelpful
          });
      }
    } catch (error: any) {
      console.error('Error voting on review:', error);
      toast({
        title: "Error",
        description: "Failed to submit your vote.",
        variant: "destructive"
      });
    }
  };

  const handleReviewResponse = async (reviewId: string, responseText: string) => {
    try {
      const { error } = await supabase
        .from('review_responses')
        .insert({
          review_id: reviewId,
          responder_id: userId,
          response_text: responseText.trim()
        });

      if (error) throw error;

      toast({
        title: "Response Submitted",
        description: "Your response has been posted."
      });
    } catch (error: any) {
      console.error('Error submitting response:', error);
      toast({
        title: "Error",
        description: "Failed to submit your response.",
        variant: "destructive"
      });
    }
  };

  return {
    projectToReview,
    reviewData,
    setReviewData,
    isSubmitting,
    handleReviewInitiate,
    handleReviewCancel,
    handleReviewSubmit,
    handleReviewReport,
    handleReviewHelpfulness,
    handleReviewResponse
  };
}; 