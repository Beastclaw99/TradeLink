
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star, Camera } from 'lucide-react';

interface ReviewSubmissionFormProps {
  projectId?: string;
  professionalName?: string;
  onSubmit?: (review: any) => void;
}

const ReviewSubmissionForm: React.FC<ReviewSubmissionFormProps> = ({
  projectId = 'proj-123',
  professionalName = 'John Smith',
  onSubmit
}) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Category ratings
  const [categoryRatings, setCategoryRatings] = useState({
    quality: 0,
    timeliness: 0,
    communication: 0,
    professionalism: 0
  });

  const categories = [
    { key: 'quality', label: 'Quality of Work' },
    { key: 'timeliness', label: 'Timeliness' },
    { key: 'communication', label: 'Communication' },
    { key: 'professionalism', label: 'Professionalism' }
  ];

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('Please provide an overall rating');
      return;
    }

    setIsSubmitting(true);
    
    const reviewData = {
      projectId,
      professionalName,
      overallRating: rating,
      categoryRatings,
      reviewText,
      submittedAt: new Date().toISOString()
    };

    // TODO: Integrate with backend API
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
    
    console.log('Review submitted:', reviewData);
    
    if (onSubmit) {
      onSubmit(reviewData);
    } else {
      alert('Review submitted successfully! (Placeholder)');
    }
    
    setIsSubmitting(false);
  };

  const StarRating = ({ 
    value, 
    onChange, 
    onHover = () => {}, 
    size = 'default' 
  }: { 
    value: number; 
    onChange: (rating: number) => void;
    onHover?: (rating: number) => void;
    size?: 'default' | 'large';
  }) => {
    const starSize = size === 'large' ? 'h-8 w-8' : 'h-5 w-5';
    
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} cursor-pointer transition-colors ${
              star <= (hoverRating || value)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
            onClick={() => onChange(star)}
            onMouseEnter={() => onHover(star)}
            onMouseLeave={() => onHover(0)}
          />
        ))}
      </div>
    );
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Review & Rate Professional</CardTitle>
        <p className="text-gray-600">
          How was your experience working with {professionalName}?
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Rating */}
        <div className="text-center space-y-3">
          <Label className="text-lg font-medium">Overall Rating</Label>
          <StarRating
            value={rating}
            onChange={setRating}
            onHover={setHoverRating}
            size="large"
          />
          <p className="text-sm text-gray-500">
            {rating > 0 && (
              <>
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent'}
              </>
            )}
          </p>
        </div>

        {/* Category Ratings */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Rate by Category</Label>
          {categories.map((category) => (
            <div key={category.key} className="flex items-center justify-between">
              <span className="text-sm font-medium">{category.label}</span>
              <StarRating
                value={categoryRatings[category.key as keyof typeof categoryRatings]}
                onChange={(rating) => setCategoryRatings(prev => ({
                  ...prev,
                  [category.key]: rating
                }))}
              />
            </div>
          ))}
        </div>

        {/* Written Review */}
        <div className="space-y-2">
          <Label htmlFor="review">Written Review</Label>
          <Textarea
            id="review"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share details about your experience, quality of work, timeliness, and professionalism..."
            rows={5}
          />
        </div>

        {/* Photo Upload Placeholder */}
        <div className="space-y-2">
          <Label>Add Photos (Optional)</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              Upload photos of the completed work
            </p>
            <Button variant="outline" size="sm" className="mt-2">
              Choose Files
            </Button>
            {/* TODO: Implement file upload functionality */}
          </div>
        </div>

        {/* Submit Button */}
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting || rating === 0}
          className="w-full"
        >
          {isSubmitting ? 'Submitting Review...' : 'Submit Review'}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          Your review will be visible to other users and help improve our community.
        </p>
      </CardContent>
    </Card>
  );
};

export default ReviewSubmissionForm;
