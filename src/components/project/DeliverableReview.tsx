
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, XCircle, Download, FileText } from 'lucide-react';

interface DeliverableReviewProps {
  deliverable: {
    id: string;
    description: string;
    file_url?: string;
    file_name?: string;
    status: 'pending' | 'approved' | 'rejected';
    feedback?: string;
    created_at: string;
  };
  onReviewComplete?: () => void;
}

const DeliverableReview: React.FC<DeliverableReviewProps> = ({
  deliverable,
  onReviewComplete
}) => {
  const [feedback, setFeedback] = useState(deliverable.feedback || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleReview = async (status: 'approved' | 'rejected') => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('project_deliverables')
        .update({
          status,
          feedback: feedback || null,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', deliverable.id);

      if (error) throw error;

      toast({
        title: "Review Submitted",
        description: `Deliverable ${status} successfully.`
      });

      onReviewComplete?.();
    } catch (error) {
      console.error('Error reviewing deliverable:', error);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = () => {
    if (deliverable.file_url) {
      window.open(deliverable.file_url, '_blank');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Deliverable Review</CardTitle>
          <Badge className={getStatusColor(deliverable.status)}>
            {deliverable.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Description</h4>
          <p className="text-sm text-gray-600">{deliverable.description}</p>
        </div>

        {deliverable.file_url && (
          <div>
            <h4 className="font-medium mb-2">File</h4>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="text-sm">{deliverable.file_name || 'Download File'}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>
          </div>
        )}

        <div>
          <h4 className="font-medium mb-2">Feedback</h4>
          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Provide feedback on this deliverable..."
            disabled={deliverable.status !== 'pending'}
          />
        </div>

        {deliverable.status === 'pending' && (
          <div className="flex gap-2">
            <Button
              onClick={() => handleReview('approved')}
              disabled={isSubmitting}
              className="flex-1"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
            <Button
              onClick={() => handleReview('rejected')}
              disabled={isSubmitting}
              variant="destructive"
              className="flex-1"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Request Changes
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeliverableReview;
