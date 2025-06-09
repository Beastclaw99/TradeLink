import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { FileText, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useProjectStatus } from '@/hooks/useProjectStatus';
import EnhancedReviewForm from '@/components/reviews/EnhancedReviewForm';

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
  const [deliverables, setDeliverables] = useState<any[]>([]);
  const { updateProjectStatus } = useProjectStatus(projectId, user?.id || '');

  const isVisible = isClient && projectStatus === 'work_submitted';

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

  const handleReviewSubmit = async (reviewData: any) => {
    try {
      // Update project status to work_approved
      await updateProjectStatus('work_approved');

      // Create project update
      await supabase.from('project_updates').insert({
        project_id: projectId,
        update_type: 'work_approved',
        message: 'Work has been approved by the client',
        professional_id: user?.id,
        metadata: {
          review_submitted: true
        }
      });

      onReviewSubmitted();
    } catch (error: any) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive"
      });
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
        {deliverables.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium">Submitted Deliverables</h3>
            {deliverables.map((deliverable, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <p className="text-sm text-gray-600">{deliverable.message}</p>
                {deliverable.file_url && (
                  <a
                    href={deliverable.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                  >
                    View File
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Enhanced Review Form */}
        <EnhancedReviewForm
          projectId={projectId}
          revieweeId={user?.id || ''}
          revieweeType="professional"
          onSubmit={handleReviewSubmit}
        />
      </CardContent>
    </Card>
  );
};

export default WorkReviewForm;
