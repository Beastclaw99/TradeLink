import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { StarRating } from '@/components/ui/star-rating';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ThumbsUp, ThumbsDown, MessageSquare, CheckCircle, Flag } from 'lucide-react';
import { format } from 'date-fns';

interface Review {
  id: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected' | 'reported';
  created_at: string;
  client_id: string;
  professional_id: string;
  project_id: string;
  communication_rating?: number;
  quality_rating?: number;
  timeliness_rating?: number;
  professionalism_rating?: number;
  is_verified: boolean;
  verification_method?: string;
}

interface ReviewResponse {
  id: string;
  review_id: string;
  responder_id: string;
  response_text: string;
  created_at: string;
  updated_at: string;
}

interface ReviewHelpfulness {
  id: string;
  review_id: string;
  user_id: string;
  is_helpful: boolean;
}

interface EnhancedReviewDisplayProps {
  review: Review;
  onReport?: (reviewId: string, reason: string) => void;
}

const EnhancedReviewDisplay: React.FC<EnhancedReviewDisplayProps> = ({
  review,
  onReport
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [responses, setResponses] = useState<ReviewResponse[]>([]);
  const [helpfulness, setHelpfulness] = useState<ReviewHelpfulness[]>([]);
  const [newResponse, setNewResponse] = useState('');
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false);
  const [showResponseForm, setShowResponseForm] = useState(false);

  useEffect(() => {
    fetchResponsesAndHelpfulness();
  }, [review.id]);

  const fetchResponsesAndHelpfulness = async () => {
    try {
      const [responsesData, helpfulnessData] = await Promise.all([
        supabase
          .from('review_responses')
          .select('*')
          .eq('review_id', review.id)
          .order('created_at', { ascending: true }),
        supabase
          .from('review_helpfulness')
          .select('*')
          .eq('review_id', review.id)
      ]);

      if (responsesData.error) throw responsesData.error;
      if (helpfulnessData.error) throw helpfulnessData.error;

      setResponses(responsesData.data || []);
      setHelpfulness(helpfulnessData.data || []);
    } catch (error: any) {
      console.error('Error fetching review data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch review responses and helpfulness data.",
        variant: "destructive"
      });
    }
  };

  const handleHelpfulnessVote = async (isHelpful: boolean) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please sign in to vote on reviews.",
        variant: "destructive"
      });
      return;
    }

    try {
      const existingVote = helpfulness.find(h => h.user_id === user.id);
      if (existingVote) {
        if (existingVote.is_helpful === isHelpful) {
          // Remove vote if clicking the same button
          const { error } = await supabase
            .from('review_helpfulness')
            .delete()
            .eq('id', existingVote.id);

          if (error) throw error;
          setHelpfulness(helpfulness.filter(h => h.id !== existingVote.id));
        } else {
          // Update vote if changing from helpful to not helpful or vice versa
          const { error } = await supabase
            .from('review_helpfulness')
            .update({ is_helpful: isHelpful })
            .eq('id', existingVote.id);

          if (error) throw error;
          setHelpfulness(helpfulness.map(h => 
            h.id === existingVote.id ? { ...h, is_helpful: isHelpful } : h
          ));
        }
      } else {
        // Add new vote
        const { data, error } = await supabase
          .from('review_helpfulness')
          .insert({
            review_id: review.id,
            user_id: user.id,
            is_helpful: isHelpful
          })
          .select()
          .single();

        if (error) throw error;
        setHelpfulness([...helpfulness, data]);
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

  const handleSubmitResponse = async () => {
    if (!user || !newResponse.trim()) return;

    setIsSubmittingResponse(true);
    try {
      const { error } = await supabase
        .from('review_responses')
        .insert({
          review_id: review.id,
          responder_id: user.id,
          response_text: newResponse.trim()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your response has been submitted."
      });

      setNewResponse('');
      setShowResponseForm(false);
      fetchResponsesAndHelpfulness();
    } catch (error: any) {
      console.error('Error submitting response:', error);
      toast({
        title: "Error",
        description: "Failed to submit your response.",
        variant: "destructive"
      });
    } finally {
      setIsSubmittingResponse(false);
    }
  };

  const getHelpfulnessCounts = () => {
    const helpful = helpfulness.filter(h => h.is_helpful).length;
    const notHelpful = helpfulness.filter(h => !h.is_helpful).length;
    return { helpful, notHelpful };
  };

  const { helpful, notHelpful } = getHelpfulnessCounts();
  const userVote = user ? helpfulness.find(h => h.user_id === user.id) : null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <StarRating
              value={review.rating}
              onChange={() => {}}
              className="mt-1"
            />
            {review.is_verified && (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-4 w-4 mr-1" />
                Verified
              </Badge>
            )}
          </CardTitle>
          <p className="text-sm text-gray-500">
            {format(new Date(review.created_at), 'PPP')}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Category Ratings */}
          {review.communication_rating && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Communication</Label>
                <StarRating
                  value={review.communication_rating}
                  onChange={() => {}}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Quality</Label>
                <StarRating
                  value={review.quality_rating || 0}
                  onChange={() => {}}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Timeliness</Label>
                <StarRating
                  value={review.timeliness_rating || 0}
                  onChange={() => {}}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Professionalism</Label>
                <StarRating
                  value={review.professionalism_rating || 0}
                  onChange={() => {}}
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {/* Review Text */}
          <div>
            <p className="text-gray-700">{review.comment}</p>
          </div>

          {/* Helpfulness Voting */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              className={`flex items-center gap-2 ${
                userVote?.is_helpful ? 'bg-green-50 text-green-700 border-green-200' : ''
              }`}
              onClick={() => handleHelpfulnessVote(true)}
            >
              <ThumbsUp className="h-4 w-4" />
              Helpful ({helpful})
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`flex items-center gap-2 ${
                userVote?.is_helpful === false ? 'bg-red-50 text-red-700 border-red-200' : ''
              }`}
              onClick={() => handleHelpfulnessVote(false)}
            >
              <ThumbsDown className="h-4 w-4" />
              Not Helpful ({notHelpful})
            </Button>
            {onReport && (
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-gray-500 hover:text-red-600"
                onClick={() => onReport(review.id, '')}
              >
                <Flag className="h-4 w-4" />
                Report
              </Button>
            )}
          </div>

          {/* Responses */}
          {responses.length > 0 && (
            <div className="space-y-4 mt-4">
              <h4 className="font-medium">Responses</h4>
              {responses.map(response => (
                <div
                  key={response.id}
                  className="bg-gray-50 rounded-lg p-4"
                >
                  <p className="text-gray-700">{response.response_text}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {format(new Date(response.created_at), 'PPP')}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Response Form */}
          {!showResponseForm ? (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowResponseForm(true)}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Write a Response
            </Button>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="response">Your Response</Label>
                <Textarea
                  id="response"
                  value={newResponse}
                  onChange={(e) => setNewResponse(e.target.value)}
                  placeholder="Write your response to this review..."
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowResponseForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitResponse}
                  disabled={isSubmittingResponse || !newResponse.trim()}
                >
                  {isSubmittingResponse ? "Submitting..." : "Submit Response"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedReviewDisplay; 