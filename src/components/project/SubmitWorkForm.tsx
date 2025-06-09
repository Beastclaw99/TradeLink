import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { PaperClipIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SubmitWorkFormProps {
  projectId: string;
  projectStatus: string;
  isProfessional: boolean;
  onWorkSubmitted: () => void;
}

export default function SubmitWorkForm({
  projectId,
  projectStatus,
  isProfessional,
  onWorkSubmitted
}: SubmitWorkFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [summary, setSummary] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [revisionFeedback, setRevisionFeedback] = useState<string | null>(null);

  // Check if form should be visible
  const isVisible = isProfessional && ['in_progress', 'work_revision_requested'].includes(projectStatus);

  // Fetch revision feedback if any
  useEffect(() => {
    const fetchRevisionFeedback = async () => {
      if (projectStatus === 'work_revision_requested') {
        try {
          const { data, error } = await supabase
            .from('project_updates')
            .select('message, metadata')
            .eq('project_id', projectId)
            .eq('update_type', 'status_change')
            .eq('status_update', 'work_revision_requested')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          if (error) throw error;
          if (data) {
            const metadata = data.metadata as { revision_notes?: string } | null;
            setRevisionFeedback(data.message || metadata?.revision_notes || null);
          }
        } catch (error) {
          console.error('Error fetching revision feedback:', error);
        }
      }
    };

    if (isVisible) {
      fetchRevisionFeedback();
    }
  }, [projectId, projectStatus, isVisible]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);

      // Create previews for images
      newFiles.forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setFilePreviews(prev => ({
              ...prev,
              [file.name]: reader.result as string
            }));
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  // Remove file
  const removeFile = (fileName: string) => {
    setFiles(prev => prev.filter(file => file.name !== fileName));
    setFilePreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[fileName];
      return newPreviews;
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);

      // Upload files to Supabase Storage
      const fileUrls = await Promise.all(
        files.map(async (file) => {
          const { data, error } = await supabase.storage
            .from('project_submissions')
            .upload(`${projectId}/${file.name}`, file);

          if (error) throw error;
          return data.path;
        })
      );

      // Create project update
      await supabase.from('project_updates').insert([{
        project_id: projectId,
        update_type: 'completion_note',
        message: summary || 'Work submitted for review',
        file_url: fileUrls[0], // Store first file URL in update
        professional_id: user?.id,
        metadata: {
          submitted_files: fileUrls,
          is_revision: projectStatus === 'work_revision_requested'
        }
      }]);

      // Update project status
      const { error: statusError } = await supabase
        .from('projects')
        .update({ status: 'work_submitted' })
        .eq('id', projectId);

      if (statusError) throw statusError;

      // Send message to project chat
      await supabase.from('project_messages').insert([{
        project_id: projectId,
        sender_id: user?.id,
        content: projectStatus === 'work_revision_requested' 
          ? 'Revised work has been submitted for review.'
          : 'Work has been submitted for review.',
        sent_at: new Date().toISOString(),
        metadata: {
          type: 'work_submitted',
          title: projectStatus === 'work_revision_requested' 
            ? 'Revised Work Submitted'
            : 'Work Submitted for Review'
        }
      }]);

      // Reset form
      setSummary('');
      setFiles([]);
      setFilePreviews({});
      setRevisionFeedback(null);

      toast({
        title: "Work Submitted",
        description: projectStatus === 'work_revision_requested'
          ? "Your revised work has been submitted for review."
          : "Your work has been submitted for review."
      });

      onWorkSubmitted();
    } catch (error: any) {
      console.error('Error submitting work:', error);
      toast({
        title: "Error",
        description: "Failed to submit work. Please try again.",
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
        <CardTitle>
          {projectStatus === 'work_revision_requested' ? 'Submit Revised Work' : 'Submit Work'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {revisionFeedback && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Revision Requested:</strong> {revisionFeedback}
              </AlertDescription>
            </Alert>
          )}

          {/* Summary Input */}
          <div className="space-y-2">
            <Label htmlFor="summary">Summary / Notes</Label>
            <Textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder={projectStatus === 'work_revision_requested'
                ? "Describe the changes made in this revision..."
                : "Describe the work completed and any important notes..."}
              className="min-h-[100px]"
            />
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="files">Deliverables</Label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                id="files"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('files')?.click()}
              >
                <PaperClipIcon className="h-4 w-4 mr-2" />
                Add Files
              </Button>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="mt-4 space-y-4">
                {files.map((file) => (
                  <div key={file.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {filePreviews[file.name] ? (
                        <img
                          src={filePreviews[file.name]}
                          alt={file.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <PaperClipIcon className="w-8 h-8 text-gray-400" />
                      )}
                      <span className="text-sm text-gray-600">{file.name}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.name)}
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || files.length === 0}
            className="w-full"
          >
            {isSubmitting 
              ? 'Submitting...' 
              : projectStatus === 'work_revision_requested'
                ? 'Submit Revision'
                : 'Submit Work'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 