import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, RefreshCw, FileText, Paperclip } from 'lucide-react';

interface ClientReviewFormProps {
  projectId: string;
  projectStatus: string;
  isClient: boolean;
  onReviewSubmitted: () => void;
}

export default function ClientReviewForm({
  projectId,
  projectStatus,
  isClient,
  onReviewSubmitted
}: ClientReviewFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliverables, setDeliverables] = useState<any[]>([]);

  // Check if form should be visible
  const isVisible = isClient && projectStatus === 'submitted';

  // Fetch deliverables on mount
  useEffect(() => {
    const fetchDeliverables = async () => {
      try {
        const { data, error } = await supabase
          .from('project_updates')
          .select('*')
          .eq('project_id', projectId)
          .eq('update_type', 'completion_note')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setDeliverables(data || []);
      } catch (error) {
        console.error('Error fetching deliverables:', error);
      }
    };

    if (isVisible) {
      fetchDeliverables();
    }
  }, [projectId, isVisible]);

  // Handle approval
  const handleApprove = async () => {
    try {
      setIsSubmitting(true);

      // Update project status
      const { error: statusError } = await supabase
        .from('projects')
        .update({ status: 'completed' })
        .eq('id', projectId);

      if (statusError) throw statusError;

      // Create project update
      await supabase.from('project_updates').insert([{
        project_id: projectId,
        update_type: 'status_update',
        message: message || 'Work approved',
        created_by: user?.id,
        metadata: {
          status_change: 'completed'
        }
      }]);

      // Send message to project chat
      await supabase.from('project_messages').insert([{
        project_id: projectId,
        sender_id: user?.id,
        content: message || 'Work has been approved.',
        sent_at: new Date().toISOString(),
        metadata: {
          type: 'work_approved',
          title: 'Work Approved'
        }
      }]);

      toast({
        title: "Work Approved",
        description: "The work has been approved successfully."
      });

      onReviewSubmitted();
    } catch (error: any) {
      console.error('Error approving work:', error);
      toast({
        title: "Error",
        description: "Failed to approve work. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle revision request
  const handleRequestRevision = async () => {
    try {
      setIsSubmitting(true);

      // Update project status
      const { error: statusError } = await supabase
        .from('projects')
        .update({ status: 'revision' })
        .eq('id', projectId);

      if (statusError) throw statusError;

      // Create project update
      await supabase.from('project_updates').insert([{
        project_id: projectId,
        update_type: 'status_update',
        message: message || 'Revision requested',
        created_by: user?.id,
        metadata: {
          status_change: 'revision'
        }
      }]);

      // Send message to project chat
      await supabase.from('project_messages').insert([{
        project_id: projectId,
        sender_id: user?.id,
        content: message || 'Revision has been requested.',
        sent_at: new Date().toISOString(),
        metadata: {
          type: 'revision_requested',
          title: 'Revision Requested'
        }
      }]);

      toast({
        title: "Revision Requested",
        description: "The professional has been notified to make the requested changes."
      });

      onReviewSubmitted();
    } catch (error: any) {
      console.error('Error requesting revision:', error);
      toast({
        title: "Error",
        description: "Failed to request revision. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Review Submitted Work</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Deliverables List */}
        <div className="space-y-4 mb-6">
          <h3 className="font-medium">Submitted Deliverables</h3>
          {deliverables.length === 0 ? (
            <p className="text-gray-500">No deliverables found.</p>
          ) : (
            <div className="space-y-4">
              {deliverables.map((deliverable) => (
                <div key={deliverable.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <FileText className="w-6 h-6 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <p className="font-medium">{deliverable.message}</p>
                      <p className="text-sm text-gray-500">
                        Submitted on {new Date(deliverable.created_at).toLocaleDateString()}
                      </p>
                      {deliverable.file_url && (
                        <a
                          href={deliverable.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 mt-2"
                        >
                          <Paperclip className="w-4 h-4" />
                          View File
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Review Form */}
        <form className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="message">Review Message (Optional)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add any notes or feedback for the professional..."
              className="min-h-[100px]"
            />
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleRequestRevision}
              disabled={isSubmitting}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Request Revision
            </Button>
            <Button
              type="button"
              className="flex-1"
              onClick={handleApprove}
              disabled={isSubmitting}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve Work
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 