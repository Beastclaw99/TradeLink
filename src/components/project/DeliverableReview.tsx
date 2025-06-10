import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DBDeliverable } from './creation/types';

interface DeliverableReviewProps {
  deliverable: DBDeliverable;
  onReviewSubmitted: () => void;
}

export default function DeliverableReview({
  deliverable,
  onReviewSubmitted
}: DeliverableReviewProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isApproved, setIsApproved] = useState<boolean | null>(null);

  const handleReview = async () => {
    if (isApproved === null) {
      toast({
        title: "Error",
        description: "Please select whether to approve or reject the deliverable",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Update deliverable status
      const { error: deliverableError } = await supabase
        .from('project_deliverables')
        .update({
          status: isApproved ? 'approved' : 'rejected',
          feedback: feedback,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', deliverable.id);

      if (deliverableError) throw deliverableError;

      // Create a status update
      const { error: updateError } = await supabase
        .from('project_updates')
        .insert({
          project_id: deliverable.project_id,
          update_type: 'deliverable_review',
          status_update: isApproved ? 'work_approved' : 'work_rejected',
          message: `Deliverable "${deliverable.description}" ${isApproved ? 'approved' : 'rejected'}`,
          metadata: {
            milestone_id: deliverable.milestone_id,
            deliverable_id: deliverable.id,
            feedback: feedback
          }
        });

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: `Deliverable ${isApproved ? 'approved' : 'rejected'} successfully`
      });

      setIsOpen(false);
      setFeedback('');
      setIsApproved(null);
      onReviewSubmitted();
    } catch (error) {
      console.error('Error reviewing deliverable:', error);
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <MessageSquare className="h-4 w-4 mr-2" />
          Review
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review Deliverable</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium">{deliverable.description}</h4>
            <Badge variant="outline" className="mt-1">
              {deliverable.deliverable_type}
            </Badge>
          </div>

          {deliverable.content && (
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm">{deliverable.content}</p>
            </div>
          )}

          {deliverable.file_url && (
            <div className="bg-gray-50 p-3 rounded">
              <a 
                href={deliverable.file_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                View File
              </a>
            </div>
          )}

          <div className="space-y-2">
            <Label>Feedback</Label>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Provide feedback on the deliverable..."
              rows={4}
            />
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant={isApproved === true ? "default" : "outline"}
              onClick={() => setIsApproved(true)}
              className="flex-1"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
            <Button
              variant={isApproved === false ? "destructive" : "outline"}
              onClick={() => setIsApproved(false)}
              className="flex-1"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
          </div>

          <Button
            onClick={handleReview}
            disabled={isSubmitting || isApproved === null}
            className="w-full"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 