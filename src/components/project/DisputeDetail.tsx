
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { disputeService, Dispute, DisputeMessage, DisputeDocument, DisputeStatusHistory } from '@/services/disputeService';
import { format } from 'date-fns';
import { AlertCircle, MessageSquare, FileText, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import FileUpload from './FileUpload';
import { fileService } from '@/services/fileService';

interface DisputeDetailProps {
  disputeId: string;
  projectId: string;
}

const DisputeDetail: React.FC<DisputeDetailProps> = ({
  disputeId,
  projectId
}) => {
  const [dispute, setDispute] = useState<Dispute | null>(null);
  const [messages, setMessages] = useState<DisputeMessage[]>([]);
  const [documents, setDocuments] = useState<DisputeDocument[]>([]);
  const [statusHistory, setStatusHistory] = useState<DisputeStatusHistory[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [resolution, setResolution] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchDisputeData();
  }, [disputeId]);

  const fetchDisputeData = async () => {
    try {
      const [disputeData, messagesData, documentsData, historyData] = await Promise.all([
        disputeService.getDispute(disputeId),
        disputeService.getDisputeMessages(disputeId),
        disputeService.getDisputeDocuments(disputeId),
        disputeService.getStatusHistory(disputeId)
      ]);

      setDispute(disputeData);
      setMessages(messagesData);
      setDocuments(documentsData);
      setStatusHistory(historyData);
    } catch (error) {
      console.error('Error fetching dispute data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch dispute data.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setIsSubmitting(true);
    try {
      const message = await disputeService.addMessage(disputeId, newMessage);
      setMessages([...messages, message]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddDocument = async (file: File) => {
    try {
      const uploadedFile = await fileService.uploadFileVersion(
        projectId,
        dispute!.work_version_id || '',
        file,
        'Dispute document',
        'private'
      );

      const document = await disputeService.addDocument(
        disputeId,
        uploadedFile.id,
        'Dispute document'
      );

      setDocuments([...documents, document]);
      toast({
        title: 'Success',
        description: 'Document added successfully.'
      });
    } catch (error) {
      console.error('Error adding document:', error);
      toast({
        title: 'Error',
        description: 'Failed to add document.',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateStatus = async (status: Dispute['status']) => {
    setIsSubmitting(true);
    try {
      const updatedDispute = await disputeService.updateDisputeStatus(
        disputeId,
        status,
        `Status changed to ${status}`
      );
      setDispute(updatedDispute);
      await fetchDisputeData();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update status.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddResolution = async () => {
    if (!resolution.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide a resolution.',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedDispute = await disputeService.addResolution(disputeId, resolution);
      setDispute(updatedDispute);
      await fetchDisputeData();
      setResolution('');
    } catch (error) {
      console.error('Error adding resolution:', error);
      toast({
        title: 'Error',
        description: 'Failed to add resolution.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !dispute) {
    return <div>Loading dispute details...</div>;
  }

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

  return (
    <div className="space-y-8">
      {/* Dispute Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{dispute.title}</h2>
          {getStatusBadge(dispute.status)}
        </div>
        <p className="text-gray-600">{dispute.description}</p>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>Created: {format(new Date(dispute.created_at), 'PPP')}</span>
          {dispute.resolved_at && (
            <span>Resolved: {format(new Date(dispute.resolved_at), 'PPP')}</span>
          )}
        </div>
      </div>

      {/* Status Actions */}
      {dispute.status !== 'closed' && (
        <div className="flex items-center gap-4">
          {dispute.status === 'open' && (
            <Button
              onClick={() => handleUpdateStatus('in_review')}
              disabled={isSubmitting}
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              Start Review
            </Button>
          )}
          {dispute.status === 'in_review' && (
            <>
              <Button
                onClick={() => handleUpdateStatus('resolved')}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark as Resolved
              </Button>
              <Button
                onClick={() => handleUpdateStatus('closed')}
                disabled={isSubmitting}
                variant="destructive"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Close Dispute
              </Button>
            </>
          )}
        </div>
      )}

      {/* Resolution Section */}
      {dispute.status === 'in_review' && !dispute.resolution && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Add Resolution</h3>
          <Textarea
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            placeholder="Enter resolution details..."
            className="min-h-[100px]"
          />
          <Button onClick={handleAddResolution} disabled={isSubmitting}>
            Submit Resolution
          </Button>
        </div>
      )}

      {dispute.resolution && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Resolution</h3>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600">{dispute.resolution}</p>
          </div>
        </div>
      )}

      {/* Documents Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Documents</h3>
        <FileUpload
          projectId={projectId}
          versionId={dispute.work_version_id || ''}
          onUploadComplete={(file) => handleAddDocument(file as unknown as File)}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc) => (
            <div key={doc.id} className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">{doc.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Messages Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Messages</h3>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-4 rounded-lg ${
                message.is_internal ? 'bg-blue-50' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">
                  {format(new Date(message.created_at), 'PPP')}
                </span>
                {message.is_internal && (
                  <Badge variant="secondary">Internal</Badge>
                )}
              </div>
              <p className="text-gray-600">{message.content}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="min-h-[80px]"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isSubmitting || !newMessage.trim()}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </div>

      {/* Status History */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Status History</h3>
        <div className="space-y-2">
          {statusHistory.map((history) => (
            <div key={history.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">
                  {getStatusBadge(history.status)}
                </span>
                <span className="text-sm text-gray-500">
                  {format(new Date(history.created_at), 'PPP')}
                </span>
              </div>
              {history.reason && (
                <p className="text-sm text-gray-600">{history.reason}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DisputeDetail;
