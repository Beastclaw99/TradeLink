
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, RefreshCw, FileText, Paperclip, Info, AlertTriangle, MessageSquare } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

interface WorkReviewFormProps {
  projectId: string;
  projectStatus: string;
  isClient: boolean;
  onReviewSubmitted: () => void;
}

const WorkReviewForm: React.FC<WorkReviewFormProps> = ({
  projectId,
  projectStatus,
  isClient,
  onReviewSubmitted
}: WorkReviewFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliverables, setDeliverables] = useState<any[]>([]);

  const isVisible = isClient && projectStatus === 'submitted';

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
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Review Submitted Work
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Carefully review all submitted deliverables before making your decision.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Review Guidelines */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Review Checklist:</strong> Verify that all project requirements are met, 
            deliverables match specifications, and work quality meets your standards.
          </AlertDescription>
        </Alert>

        {/* Deliverables List */}
        <div className="space-y-4">
          <h3 className="font-medium flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Submitted Deliverables
          </h3>
          {deliverables.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No deliverables found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {deliverables.map((deliverable) => (
                <div key={deliverable.id} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className="flex items-start gap-3">
                    <FileText className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div>
                        <p className="font-medium text-gray-900">{deliverable.message}</p>
                        <p className="text-sm text-gray-500">
                          Submitted on {new Date(deliverable.created_at).toLocaleDateString()} at{' '}
                          {new Date(deliverable.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                      {deliverable.file_url && (
                        <a
                          href={deliverable.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          <Paperclip className="w-4 h-4" />
                          Download Attachment
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Review Form */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="message" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Feedback Message (Optional)
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Provide specific feedback about the work quality, any concerns, or appreciation for excellent work..."
              className="min-h-[120px]"
            />
            <p className="text-xs text-gray-500">
              Clear feedback helps professionals improve and builds better working relationships.
            </p>
          </div>

          {/* Decision Buttons */}
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Button
                type="button"
                variant="outline"
                className="w-full h-auto p-4 border-orange-200 hover:bg-orange-50"
                onClick={handleRequestRevision}
                disabled={isSubmitting}
              >
                <div className="flex flex-col items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-orange-600" />
                  <div className="text-center">
                    <div className="font-medium text-orange-700">Request Revision</div>
                    <div className="text-sm text-orange-600">Work needs changes</div>
                  </div>
                </div>
              </Button>
              
              <Button
                type="button"
                className="w-full h-auto p-4 bg-green-600 hover:bg-green-700"
                onClick={handleApprove}
                disabled={isSubmitting}
              >
                <div className="flex flex-col items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <div className="text-center">
                    <div className="font-medium">Approve Work</div>
                    <div className="text-sm opacity-90">Mark as complete</div>
                  </div>
                </div>
              </Button>
            </div>

            {/* Action Guidance */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800">Before you decide:</p>
                  <ul className="text-yellow-700 mt-1 space-y-1">
                    <li>• Check that all project requirements have been met</li>
                    <li>• Verify deliverable quality matches your expectations</li>
                    <li>• Consider if any clarifications are needed</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkReviewForm;
