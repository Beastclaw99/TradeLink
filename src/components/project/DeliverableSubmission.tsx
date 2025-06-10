
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload } from 'lucide-react';

interface DeliverableSubmissionProps {
  projectId: string;
  milestoneId?: string;
  onSubmissionComplete?: () => void;
}

const DeliverableSubmission: React.FC<DeliverableSubmissionProps> = ({
  projectId,
  milestoneId,
  onSubmissionComplete
}) => {
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      toast({
        title: "Error",
        description: "Please provide a description for the deliverable.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      let fileUrl = '';
      let fileName = '';

      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        fileName = `${Date.now()}.${fileExt}`;
        const filePath = `deliverables/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('project-files')
          .upload(filePath, selectedFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('project-files')
          .getPublicUrl(filePath);

        fileUrl = publicUrl;
        fileName = selectedFile.name;
      }

      const insertData: any = {
        project_id: projectId,
        description,
        deliverable_type: selectedFile ? 'file' : 'note',
        status: 'pending'
      };

      if (milestoneId) {
        insertData.milestone_id = milestoneId;
      }

      if (fileUrl) {
        insertData.file_url = fileUrl;
      }

      const { error } = await supabase
        .from('project_deliverables')
        .insert(insertData);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Deliverable submitted successfully."
      });

      setDescription('');
      setSelectedFile(null);
      onSubmissionComplete?.();
    } catch (error) {
      console.error('Error submitting deliverable:', error);
      toast({
        title: "Error",
        description: "Failed to submit deliverable. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Deliverable</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what you're delivering..."
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">File (Optional)</label>
          <Input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.txt,.zip,.jpg,.png"
          />
          {selectedFile && (
            <p className="text-sm text-gray-600 mt-1">
              Selected: {selectedFile.name}
            </p>
          )}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !description.trim()}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          {isSubmitting ? 'Submitting...' : 'Submit Deliverable'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DeliverableSubmission;
