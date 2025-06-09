import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Project, Application } from '@/components/dashboard/types';

export const useReviewOperations = (userId: string, applications: Application[], onUpdate: () => void) => {
  const { toast } = useToast();
  const [projectToReview, setProjectToReview] = useState<Project | null>(null);
  const [reviewData, setReviewData] = useState({
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

  return {
    projectToReview,
    reviewData,
    setReviewData,
    isSubmitting,
    handleReviewInitiate,
    handleReviewCancel,
    handleReviewSubmit
  };
};
