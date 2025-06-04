import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import { Project } from '@/components/dashboard/types';

export const useReviewOperations = (userId: string, projects: Project[], fetchDashboardData: () => Promise<void>) => {
  const { toast } = useToast();
  
  const [projectToReview, setProjectToReview] = useState<string | null>(null);
  const [reviewData, setReviewData] = useState<{ rating: number; comment: string }>({ rating: 5, comment: '' });
  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);

  const handleReviewInitiate = (projectId: string) => {
    setProjectToReview(projectId);
    setReviewData({ rating: 5, comment: '' });
  };

  const handleReviewCancel = () => {
    setProjectToReview(null);
    setReviewData({ rating: 5, comment: '' });
  };

  const handleReviewSubmit = async (projectId: string, data: { rating: number; comment: string }) => {
    try {
      setIsReviewSubmitting(true);

      const project = projects.find(p => p.id === projectId);
      if (!project?.professional_id) {
        throw new Error('No professional assigned to this project');
      }

      const { error } = await supabase
        .from('reviews')
        .insert([{
          project_id: projectId,
          client_id: userId,
          professional_id: project.professional_id,
          rating: data.rating,
          comment: data.comment
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Review submitted successfully"
      });

      setProjectToReview(null);
      setReviewData({ rating: 5, comment: '' });
      await fetchDashboardData();

    } catch (err: any) {
      console.error('Error submitting review:', err);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsReviewSubmitting(false);
    }
  };

  return {
    projectToReview,
    reviewData,
    isReviewSubmitting,
    handleReviewInitiate,
    handleReviewCancel,
    handleReviewSubmit,
    setReviewData
  };
};
