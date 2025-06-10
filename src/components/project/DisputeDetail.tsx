
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft,
  MessageSquare,
  Clock,
  User
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface Dispute {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  created_at: string;
  initiator_id: string;
  respondent_id: string;
  project_id: string;
  resolution?: string;
}

interface DisputeMessage {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  is_internal: boolean;
}

interface DisputeDetailProps {
  disputeId: string;
  projectId: string;
}

const DisputeDetail: React.FC<DisputeDetailProps> = ({ disputeId, projectId }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [dispute, setDispute] = useState<Dispute | null>(null);
  const [messages, setMessages] = useState<DisputeMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchDispute = async () => {
      setIsLoading(true);
      try {
        if (!disputeId) throw new Error("Dispute ID is missing.");

        const { data: disputeData, error: disputeError } = await supabase
          .from('disputes')
          .select('*')
          .eq('id', disputeId)
          .single();

        if (disputeError) throw disputeError;

        // Transform the data to match our interface
        const transformedDispute: Dispute = {
          id: disputeData.id,
          title: disputeData.title,
          description: disputeData.description,
          type: disputeData.type,
          status: disputeData.status,
          created_at: disputeData.created_at || new Date().toISOString(),
          initiator_id: disputeData.initiator_id,
          respondent_id: disputeData.respondent_id,
          project_id: disputeData.project_id,
          resolution: disputeData.resolution || undefined
        };

        setDispute(transformedDispute);

        const { data: messagesData, error: messagesError } = await supabase
          .from('dispute_messages')
          .select('*')
          .eq('dispute_id', disputeId)
          .order('created_at', { ascending: true });

        if (messagesError) throw messagesError;

        // Transform messages data to match our interface
        const transformedMessages: DisputeMessage[] = (messagesData || []).map(msg => ({
          id: msg.id,
          content: msg.content,
          created_at: msg.created_at || new Date().toISOString(),
          sender_id: msg.sender_id,
          is_internal: msg.is_internal || false
        }));

        setMessages(transformedMessages);
      } catch (error: any) {
        console.error("Error fetching dispute details:", error);
        toast({
          title: "Error",
          description: "Failed to load dispute details.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDispute();
  }, [disputeId, toast]);

  const handleSubmitMessage = async () => {
    setIsSubmitting(true);
    try {
      if (!disputeId) throw new Error("Dispute ID is missing.");

      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase.from('dispute_messages').insert([
        {
          dispute_id: disputeId,
          content: newMessage,
          sender_id: user?.id,
          is_internal: false,
        },
      ]);

      if (error) throw error;

      setNewMessage('');
      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully.",
      });

      // Refresh messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('dispute_messages')
        .select('*')
        .eq('dispute_id', disputeId)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;

      // Transform messages data to match our interface
      const transformedMessages: DisputeMessage[] = (messagesData || []).map(msg => ({
        id: msg.id,
        content: msg.content,
        created_at: msg.created_at || new Date().toISOString(),
        sender_id: msg.sender_id,
        is_internal: msg.is_internal || false
      }));

      setMessages(transformedMessages);
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Loading dispute details...</div>;
  }

  if (!dispute) {
    return <div>Dispute not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Dispute Details</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{dispute.title}</CardTitle>
            <Badge variant="outline">{dispute.status}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-gray-600">{dispute.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-1">Type</h4>
                <p className="text-gray-600">{dispute.type}</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Created</h4>
                <p className="text-gray-600">
                  {format(new Date(dispute.created_at), 'PPP')}
                </p>
              </div>
            </div>
            {dispute.resolution && (
              <div>
                <h4 className="font-medium mb-2">Resolution</h4>
                <p className="text-gray-600">{dispute.resolution}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="font-medium">User</span>
                    {message.is_internal && (
                      <Badge variant="secondary" className="text-xs">Internal</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="h-3 w-3" />
                    {format(new Date(message.created_at), 'PPP')}
                  </div>
                </div>
                <p className="text-gray-700">{message.content}</p>
              </div>
            ))}

            <div className="border-t pt-4">
              <Textarea
                placeholder="Add a message to this dispute..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="mb-4"
              />
              <Button 
                onClick={handleSubmitMessage}
                disabled={isSubmitting || !newMessage.trim()}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DisputeDetail;
