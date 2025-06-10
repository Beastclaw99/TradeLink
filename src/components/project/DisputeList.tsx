
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { disputeService, Dispute } from '@/services/disputeService';
import { format } from 'date-fns';
import { AlertCircle, MessageSquare, FileText } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

interface DisputeListProps {
  projectId: string;
}

const DisputeList: React.FC<DisputeListProps> = ({ projectId }) => {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchDisputes();
  }, [projectId]);

  const fetchDisputes = async () => {
    try {
      const data = await disputeService.getProjectDisputes(projectId);
      setDisputes(data);
    } catch (error) {
      console.error('Error fetching disputes:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch disputes.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: Dispute['status']) => {
    const variants: Record<Dispute['status'], { variant: 'default' | 'secondary' | 'destructive' | 'outline', label: string }> = {
      open: { variant: 'default', label: 'Open' },
      in_review: { variant: 'secondary', label: 'In Review' },
      resolved: { variant: 'outline', label: 'Resolved' },
      escalated: { variant: 'destructive', label: 'Escalated' },
      closed: { variant: 'destructive', label: 'Closed' }
    };

    const { variant, label } = variants[status];
    return <Badge variant={variant}>{label}</Badge>;
  };

  const getTypeBadge = (type: Dispute['type']) => {
    const variants: Record<Dispute['type'], { variant: 'default' | 'secondary' | 'destructive' | 'outline', label: string }> = {
      quality: { variant: 'default', label: 'Quality' },
      timeline: { variant: 'secondary', label: 'Timeline' },
      payment: { variant: 'destructive', label: 'Payment' },
      communication: { variant: 'outline', label: 'Communication' },
      scope: { variant: 'default', label: 'Scope' },
      other: { variant: 'outline', label: 'Other' }
    };

    const { variant, label } = variants[type];
    return <Badge variant={variant}>{label}</Badge>;
  };

  if (isLoading) {
    return <div>Loading disputes...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Disputes</h3>
        <Button onClick={() => router.push(`/projects/${projectId}/disputes/new`)}>
          Create Dispute
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {disputes.map((dispute) => (
            <TableRow key={dispute.id}>
              <TableCell className="font-medium">{dispute.title}</TableCell>
              <TableCell>{getTypeBadge(dispute.type)}</TableCell>
              <TableCell>{getStatusBadge(dispute.status)}</TableCell>
              <TableCell>
                {format(new Date(dispute.created_at), 'PPP')}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/projects/${projectId}/disputes/${dispute.id}`)}
                  >
                    <AlertCircle className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Messages
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Dispute Messages</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        {/* Messages will be loaded here */}
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        Documents
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Dispute Documents</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        {/* Documents will be loaded here */}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DisputeList;
