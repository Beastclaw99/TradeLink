
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Project, Application } from '@/components/dashboard/types';

export const useReviewOperations = (userId: string, applications: Application[], onUpdate: () => void) => {
  const { toast } = useToast();
  const [projectToReview, setProjectToReview] = useState<Project | null>(null);
  const [reviewData, setReviewData] = useState({
    rating: 0,
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleReviewInitiate = (project: Project) => {
    setProjectToReview(project);
    setReviewData({
      rating: 0,
      comment: ''
    });
  };
  
  const handleReviewCancel = () => {
    setProjectToReview(null);
    setReviewData({
      rating: 0,
      comment: ''
    });
  };
  
  const handleReviewSubmit = async () => {
    if (!projectToReview) return;
    
    try {
      setIsSubmitting(true);
      
      // Get professional ID from applications
      const acceptedApp = applications.find(app => 
        app.project_id === projectToReview.id && app.status === 'accepted'
      );
      
      if (!acceptedApp || !acceptedApp.professional_id) {
        throw new Error("Could not find professional for this project");
      }
      
      // Submit the review
      const { data, error } = await supabase
        .from('reviews')
        .insert([
          {
            project_id: projectToReview.id,
            client_id: userId,
            professional_id: acceptedApp.professional_id,
            rating: reviewData.rating,
            comment: reviewData.comment
          }
        ]);
      
      if (error) throw error;
      
      // Update project status to archived
      const { error: updateError } = await supabase
        .from('projects')
        .update({ status: 'archived' })
        .eq('id', projectToReview.id);
      
      if (updateError) throw updateError;
      
      toast({
        title: "Review Submitted",
        description: "Your review has been submitted successfully."
      });
      
      // Refresh data
      onUpdate();
      
      // Reset review state
      handleReviewCancel();
      
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
    isSubmitting,
    setReviewData,
    handleReviewInitiate,
    handleReviewCancel,
    handleReviewSubmit
  };
};
