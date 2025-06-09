import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { disputeService, Dispute } from '@/services/disputeService';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';

interface DisputeFormProps {
  projectId: string;
  workVersionId: string;
  respondentId: string;
  onSuccess?: (dispute: Dispute) => void;
}

const DisputeForm: React.FC<DisputeFormProps> = ({
  projectId,
  workVersionId,
  respondentId,
  onSuccess
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<Dispute['type']>('quality');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const dispute = await disputeService.createDispute(
        projectId,
        workVersionId,
        respondentId,
        type,
        title,
        description
      );

      toast({
        title: 'Success',
        description: 'Dispute created successfully.'
      });

      if (onSuccess) {
        onSuccess(dispute);
      } else {
        router.push(`/projects/${projectId}/disputes/${dispute.id}`);
      }
    } catch (error) {
      console.error('Error creating dispute:', error);
      toast({
        title: 'Error',
        description: 'Failed to create dispute. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter dispute title"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select
            value={type}
            onValueChange={(value: Dispute['type']) => setType(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select dispute type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="quality">Quality</SelectItem>
              <SelectItem value="timeline">Timeline</SelectItem>
              <SelectItem value="payment">Payment</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue in detail..."
            className="min-h-[200px]"
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Dispute'}
        </Button>
      </div>
    </form>
  );
};

export default DisputeForm; 