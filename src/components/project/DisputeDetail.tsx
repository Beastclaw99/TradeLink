
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { disputeService, Dispute, DisputeMessage } from '@/services/disputeService';
import { MessageSquare, FileText, Clock } from 'lucide-react';
import { format } from 'date-fns';
import FileUpload from './FileUpload';

interface DisputeDetailProps {
  disputeId: string;
  projectId?: string;
  onStatusChange?: () => void;
}

const DisputeDetail: React.FC<DisputeDetailProps> = ({ disputeId, projectId, onStatusChange }) => {
  const [dispute, setDispute] = useState<Dispute | null>(null);
  const [messages, setMessages] = useState<DisputeMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadDisputeData();
  }, [disputeId]);

  const loadDisputeData = async () => {
    try {
      const [disputeData, messagesData] = await Promise.all([
        disputeService.getDispute(disputeId),
        disputeService.getDisputeMessages(disputeId)
      ]);
      
      setDispute(disputeData);
      setMessages(messagesData);
    } catch (error: any) {
      console.error('Error loading dispute data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dispute details.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      setSending(true);
      await disputeService.addMessage(disputeId, newMessage);
      setNewMessage('');
      await loadDisputeData(); // Reload to get the new message
      
      toast({
        title: 'Message sent',
        description: 'Your message has been added to the dispute.'
      });
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message.',
        variant: 'destructive'
      });
    } finally {
      setSending(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div>Loading dispute details...</div>;
  }

  if (!dispute) {
    return <div>Dispute not found.</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{dispute.title}</CardTitle>
              <p className="text-gray-600 mt-2">{dispute.description}</p>
            </div>
            <Badge className={getStatusColor(dispute.status)}>
              {dispute.status.replace('_', ' ')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium">Type</h4>
              <p className="text-gray-600">{dispute.type}</p>
            </div>
            <div>
              <h4 className="font-medium">Created</h4>
              <p className="text-gray-600">
                {format(new Date(dispute.created_at), 'MMM d, yyyy h:mm a')}
              </p>
            </div>
          </div>
          
          {dispute.resolution && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800">Resolution</h4>
              <p className="text-green-700 mt-1">{dispute.resolution}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {messages.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No messages yet.</p>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="border-l-4 border-blue-200 pl-4">
                  <div className="flex justify-between items-start">
                    <p className="text-gray-800">{message.content}</p>
                    <span className="text-xs text-gray-500">
                      {format(new Date(message.created_at), 'MMM d, h:mm a')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {dispute.status === 'open' && (
            <div className="mt-4 space-y-2">
              <Textarea
                placeholder="Add a message to this dispute..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="min-h-[80px]"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || sending}
                className="w-full"
              >
                {sending ? 'Sending...' : 'Send Message'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DisputeDetail;
