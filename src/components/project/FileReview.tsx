import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { fileService, FileReview as FileReviewType, FileComment } from '@/services/fileService';
import { format } from 'date-fns';
import { CheckCircle, XCircle, MessageSquare } from 'lucide-react';

interface FileReviewProps {
  fileId: string;
  onReviewSubmitted: () => void;
}

const FileReview: React.FC<FileReviewProps> = ({
  fileId,
  onReviewSubmitted
}) => {
  const [reviews, setReviews] = useState<FileReviewType[]>([]);
  const [comments, setComments] = useState<FileComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchReviewsAndComments();
  }, [fileId]);

  const fetchReviewsAndComments = async () => {
    try {
      const [fetchedReviews, fetchedComments] = await Promise.all([
        fileService.getFileReviews(fileId),
        fileService.getFileComments(fileId)
      ]);
      setReviews(fetchedReviews);
      setComments(fetchedComments);
    } catch (error) {
      console.error('Error fetching reviews and comments:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch reviews and comments.',
        variant: 'destructive'
      });
    }
  };

  const handleReview = async (status: FileReviewType['status']) => {
    if (status !== 'pending' && !feedback.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide feedback for your review.',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await fileService.createFileReview(fileId, status, feedback);
      setFeedback('');
      fetchReviewsAndComments();
      onReviewSubmitted();
      toast({
        title: 'Review Submitted',
        description: `File has been ${status}.`
      });
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit review.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await fileService.createFileComment(fileId, newComment);
      setNewComment('');
      fetchReviewsAndComments();
      toast({
        title: 'Comment Added',
        description: 'Your comment has been added successfully.'
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to add comment.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Review Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Review File</h3>
        <Textarea
          placeholder="Provide feedback for your review..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="min-h-[100px]"
        />
        <div className="flex gap-2">
          <Button
            onClick={() => handleReview('approved')}
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Approve
          </Button>
          <Button
            onClick={() => handleReview('rejected')}
            disabled={isSubmitting}
            variant="destructive"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Reject
          </Button>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Reviews</h3>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className={`p-4 rounded-lg ${
                  review.status === 'approved'
                    ? 'bg-green-50 border border-green-200'
                    : review.status === 'rejected'
                    ? 'bg-red-50 border border-red-200'
                    : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">
                    {review.status === 'approved' ? 'Approved' : 'Rejected'}
                  </span>
                  <span className="text-sm text-gray-500">
                    {format(new Date(review.created_at), 'PPP')}
                  </span>
                </div>
                {review.feedback && (
                  <p className="text-sm text-gray-600">{review.feedback}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comments Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Comments</h3>
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">
                  {format(new Date(comment.created_at), 'PPP')}
                </span>
              </div>
              <p className="text-sm text-gray-600">{comment.content}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[80px]"
          />
          <Button
            onClick={handleComment}
            disabled={isSubmitting || !newComment.trim()}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Comment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FileReview; 