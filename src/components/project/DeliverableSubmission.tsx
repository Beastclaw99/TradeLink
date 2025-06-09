import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, FileText, Link } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DeliverableSubmissionProps {
  milestoneId: string;
  projectId: string;
  onDeliverableSubmitted: () => void;
}

export default function DeliverableSubmission({
  milestoneId,
  projectId,
  onDeliverableSubmitted
}: DeliverableSubmissionProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliverable, setDeliverable] = useState({
    description: '',
    deliverable_type: 'note',
    content: '',
    file: null as File | null
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDeliverable(prev => ({
        ...prev,
        file: e.target.files![0],
        content: e.target.files![0].name
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      let fileUrl = '';
      if (deliverable.deliverable_type === 'file' && deliverable.file) {
        const fileExt = deliverable.file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `deliverables/${projectId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('project-files')
          .upload(filePath, deliverable.file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('project-files')
          .getPublicUrl(filePath);

        fileUrl = publicUrl;
      }

      const { error: deliverableError } = await supabase
        .from('project_deliverables')
        .insert({
          description: deliverable.description,
          deliverable_type: deliverable.deliverable_type,
          content: deliverable.deliverable_type === 'file' ? null : deliverable.content,
          file_url: fileUrl,
          milestone_id: milestoneId,
          project_id: projectId,
          uploaded_by: (await supabase.auth.getUser()).data.user?.id,
          created_at: new Date().toISOString()
        });

      if (deliverableError) throw deliverableError;

      // Create a status update
      const { error: updateError } = await supabase
        .from('project_updates')
        .insert({
          project_id: projectId,
          update_type: 'status_change',
          status_update: 'work_submitted',
          message: `New deliverable submitted: ${deliverable.description}`,
          metadata: {
            milestone_id: milestoneId,
            deliverable_type: deliverable.deliverable_type
          }
        });

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Deliverable submitted successfully"
      });

      setIsOpen(false);
      setDeliverable({
        description: '',
        deliverable_type: 'note',
        content: '',
        file: null
      });
      onDeliverableSubmitted();
    } catch (error) {
      console.error('Error submitting deliverable:', error);
      toast({
        title: "Error",
        description: "Failed to submit deliverable",
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
          <Upload className="h-4 w-4 mr-2" />
          Submit Deliverable
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit Deliverable</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={deliverable.description}
              onChange={(e) => setDeliverable(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your deliverable..."
            />
          </div>

          <div>
            <Label htmlFor="type">Type</Label>
            <Select
              value={deliverable.deliverable_type}
              onValueChange={(value) => setDeliverable(prev => ({ ...prev, deliverable_type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="note">Note</SelectItem>
                <SelectItem value="file">File</SelectItem>
                <SelectItem value="link">Link</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {deliverable.deliverable_type === 'file' ? (
            <div>
              <Label htmlFor="file">File</Label>
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                accept="*/*"
              />
            </div>
          ) : deliverable.deliverable_type === 'link' ? (
            <div>
              <Label htmlFor="content">URL</Label>
              <Input
                id="content"
                type="url"
                value={deliverable.content}
                onChange={(e) => setDeliverable(prev => ({ ...prev, content: e.target.value }))}
                placeholder="https://..."
              />
            </div>
          ) : (
            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={deliverable.content}
                onChange={(e) => setDeliverable(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Enter your note..."
              />
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !deliverable.description || 
                (deliverable.deliverable_type === 'file' && !deliverable.file) ||
                (deliverable.deliverable_type !== 'file' && !deliverable.content)}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 