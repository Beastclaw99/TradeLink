import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { StarRating } from '@/components/ui/star-rating';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Star, MessageSquare, CheckCircle, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface EnhancedReviewFormProps {
  projectId: string;
  revieweeId: string;
  revieweeType: 'client' | 'professional';
  onSubmit?: (review: any) => void;
}

const EnhancedReviewForm: React.FC<EnhancedReviewFormProps> = ({
  projectId,
  revieweeId,
  revieweeType,
  onSubmit
}) => {
  const { toast } = useToast();
  const [overallRating, setOverallRating] = useState(0);
  const [communicationRating, setCommunicationRating] = useState(0);
  const [qualityRating, setQualityRating] = useState(0);
  const [timelinessRating, setTimelinessRating] = useState(0);
  const [professionalismRating, setProfessionalismRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getRatingDescriptions = () => {
    return {
      1: 'Poor - Significant issues',
      2: 'Below Average - Some concerns',
      3: 'Average - Met basic expectations',
      4: 'Good - Exceeded expectations',
      5: 'Excellent - Outstanding work'
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!overallRating || !reviewText.trim()) {
      toast({
        title: "Error",
        description: "Please provide an overall rating and review text.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const reviewData = {
        project_id: projectId,
        [revieweeType === 'client' ? 'client_id' : 'professional_id']: revieweeId,
        rating: overallRating,
        communication_rating: communicationRating,
        quality_rating: qualityRating,
        timeliness_rating: timelinessRating,
        professionalism_rating: professionalismRating,
        comment: reviewText,
        status: 'pending',
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('reviews')
        .insert(reviewData);

      if (error) throw error;

      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback! Your review will be visible after moderation."
      });

      if (onSubmit) {
        onSubmit(reviewData);
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

  const ratingDescriptions = getRatingDescriptions();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Review {revieweeType === 'client' ? 'Client' : 'Professional'}
        </CardTitle>
        <p className="text-sm text-gray-600">
          Your honest feedback helps build trust in the ProLinkTT community and helps others make informed decisions.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Overall Rating */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Overall Rating *
            </Label>
            <StarRating
              value={overallRating}
              onChange={setOverallRating}
              className="mt-2"
            />
            {overallRating > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm font-medium text-blue-900">
                  {overallRating} {overallRating === 1 ? 'Star' : 'Stars'} - {ratingDescriptions[overallRating as keyof typeof ratingDescriptions]}
                </p>
              </div>
            )}
          </div>

          {/* Category Ratings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Communication</Label>
              <StarRating
                value={communicationRating}
                onChange={setCommunicationRating}
                className="mt-1"
              />
            </div>
            <div className="space-y-2">
              <Label>Quality of Work</Label>
              <StarRating
                value={qualityRating}
                onChange={setQualityRating}
                className="mt-1"
              />
            </div>
            <div className="space-y-2">
              <Label>Timeliness</Label>
              <StarRating
                value={timelinessRating}
                onChange={setTimelinessRating}
                className="mt-1"
              />
            </div>
            <div className="space-y-2">
              <Label>Professionalism</Label>
              <StarRating
                value={professionalismRating}
                onChange={setProfessionalismRating}
                className="mt-1"
              />
            </div>
          </div>

          {/* Review Text */}
          <div className="space-y-3">
            <Label htmlFor="review" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Written Review *
            </Label>
            <Textarea
              id="review"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder={`Share your experience working with this ${revieweeType}...`}
              className="mt-2 min-h-[120px]"
              rows={5}
            />
            <p className="text-xs text-gray-500">
              {reviewText.length}/500 characters (aim for at least 50 characters for a helpful review)
            </p>
          </div>

          {/* Review Guidelines */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Review Guidelines:</strong> Be honest, specific, and constructive. 
              Focus on the work and professionalism. Reviews are public and help build trust in the community.
            </AlertDescription>
          </Alert>

          {/* Submit Button */}
          <Button 
            type="submit" 
            disabled={isSubmitting || overallRating === 0 || reviewText.trim().length < 10}
            className="w-full"
            size="lg"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EnhancedReviewForm; 