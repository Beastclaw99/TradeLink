import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Project } from '@/components/dashboard/types';

interface Review {
  id: string;
  project_id: string;
  professional_id: string;
  client_id: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'reported';
  created_at: string;
  updated_at: string;
}

interface ReviewData {
  rating: number;
  communication_rating?: number;
  quality_rating?: number;
  timeliness_rating?: number;
  professionalism_rating?: number;
  comment: string;
}

interface UseEnhancedReviewOperationsProps {
  professionalId: string;
  onUpdate: () => void;
}

export const useEnhancedReviewOperations = ({ professionalId, onUpdate }: UseEnhancedReviewOperationsProps) => {
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

  const handleReviewSubmit = async (reviewId: string, data: Partial<Review>) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({
          ...data,
          professional_id: professionalId,
          updated_at: new Date().toISOString()
        })
        .eq('id', reviewId);

      if (error) throw error;

      toast({
        title: 'Review Updated',
        description: 'Your review has been updated successfully.'
      });

      onUpdate();
    } catch (error) {
      console.error('Error updating review:', error);
      toast({
        title: 'Error',
        description: 'Failed to update review.',
        variant: 'destructive'
      });
    }
  };

  const handleReviewReport = async (reviewId: string, reason: string) => {
    try {
      const { error } = await supabase
        .from('review_reports')
        .insert({
          review_id: reviewId,
          reported_by: professionalId,
          reason,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: 'Review Reported',
        description: 'Your report has been submitted for review.'
      });

      onUpdate();
    } catch (error) {
      console.error('Error reporting review:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit report.',
        variant: 'destructive'
      });
    }
  };

  const handleReviewHelpfulness = async (reviewId: string, isHelpful: boolean) => {
    try {
      const existingVote = await supabase
        .from('review_helpfulness')
        .select('*')
        .eq('review_id', reviewId)
        .eq('user_id', professionalId)
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
            user_id: professionalId,
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

  const handleReviewResponse = async (reviewId: string, response: string) => {
    try {
      const { error } = await supabase
        .from('review_responses')
        .insert({
          review_id: reviewId,
          responder_id: professionalId,
          response,
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: 'Response Submitted',
        description: 'Your response has been submitted successfully.'
      });

      onUpdate();
    } catch (error) {
      console.error('Error submitting response:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit response.',
        variant: 'destructive'
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