
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { StarRating } from '@/components/ui/star-rating';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Star, MessageSquare, CheckCircle } from 'lucide-react';

interface ReviewSubmissionFormProps {
  projectId: string;
  revieweeId: string;
  revieweeType: 'client' | 'professional';
  onSubmit?: (review: any) => void;
}

const ReviewSubmissionForm: React.FC<ReviewSubmissionFormProps> = ({
  projectId,
  revieweeId,
  revieweeType,
  onSubmit
}) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  const getReviewPrompts = () => {
    if (revieweeType === 'client') {
      return [
        'How clear were the project requirements and communication?',
        'Was the client responsive and professional?',
        'Were payments made on time as agreed?',
        'Would you work with this client again?'
      ];
    } else {
      return [
        'How was the quality of work delivered?',
        'Was the professional reliable and on time?',
        'How was their communication throughout the project?',
        'Would you hire this professional again?'
      ];
    }
  };

  const getRatingDescriptions = () => {
    return {
      1: 'Poor - Significant issues',
      2: 'Below Average - Some concerns',
      3: 'Average - Met basic expectations',
      4: 'Good - Exceeded expectations',
      5: 'Excellent - Outstanding work'
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({
        projectId,
        revieweeId,
        revieweeType,
        rating,
        comment: reviewText
      });
    }
  };

  const ratingDescriptions = getRatingDescriptions();
  const reviewPrompts = getReviewPrompts();

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
          
          {/* Rating Section */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Overall Rating *
            </Label>
            <StarRating
              value={rating}
              onChange={setRating}
              className="mt-2"
            />
            
            {rating > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm font-medium text-blue-900">
                  {rating} {rating === 1 ? 'Star' : 'Stars'} - {ratingDescriptions[rating as keyof typeof ratingDescriptions]}
                </p>
              </div>
            )}
          </div>
          
          {/* Review Text Section */}
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
            
            {/* Writing Prompts */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 mb-2">💡 Consider addressing these points:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                {reviewPrompts.map((prompt, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                    {prompt}
                  </li>
                ))}
              </ul>
            </div>
            
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
            disabled={rating === 0 || reviewText.trim().length < 10}
            className="w-full"
            size="lg"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Submit Review
          </Button>
          
          {(rating === 0 || reviewText.trim().length < 10) && (
            <p className="text-sm text-gray-500 text-center">
              Please provide a rating and write at least 10 characters for your review.
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default ReviewSubmissionForm;
