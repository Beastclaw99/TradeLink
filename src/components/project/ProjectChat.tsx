import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, AlertCircle, Info, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

interface ProjectMessage {
  id: string;
  project_id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  sent_at: string;
  sender_name: string;
  sender_role: 'client' | 'professional';
  metadata?: {
    type?: string;
    title?: string;
  };
  sender?: {
    first_name: string;
    last_name: string;
  };
}

type DatabaseMessage = {
  id: string;
  project_id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  sent_at: string;
  metadata?: {
    type?: string;
    title?: string;
  };
  sender: {
    first_name: string;
    last_name: string;
  } | null;
};

interface ProjectChatProps {
  projectId: string;
  projectStatus: string;
  clientId: string;
  professionalId: string;
}

const ProjectChat: React.FC<ProjectChatProps> = ({
  projectId,
  projectStatus,
  clientId,
  professionalId
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ProjectMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userRole = user?.id === clientId ? 'client' : 'professional';

  // Define chat restrictions based on project status
  const getChatRestrictions = () => {
    switch (projectStatus) {
      case 'open':
        return {
          allowed: false,
          readOnly: false,
          message: 'Chat is only available after a professional is assigned to the project.'
        };
      case 'assigned':
        return {
          allowed: true,
          readOnly: false,
          message: 'Chat is now available. You can discuss project details with the professional.'
        };
      case 'in_progress':
        return {
          allowed: true,
          readOnly: false,
          message: 'Chat is available for discussing work progress and updates.'
        };
      case 'work_submitted':
        return {
          allowed: true,
          readOnly: false,
          message: 'Chat is available for discussing the submitted work and providing feedback.'
        };
      case 'work_revision_requested':
        return {
          allowed: true,
          readOnly: false,
          message: 'Chat is available for discussing revision requirements and clarifications.'
        };
      case 'work_approved':
        return {
          allowed: true,
          readOnly: false,
          message: 'Chat is available for discussing project completion and final details.'
        };
      case 'completed':
        return {
          allowed: true,
          readOnly: true,
          message: 'Chat is read-only for completed projects. All messages are preserved for reference.'
        };
      case 'archived':
        return {
          allowed: false,
          readOnly: true,
          message: 'Chat is no longer available for archived projects.'
        };
      case 'cancelled':
        return {
          allowed: false,
          readOnly: true,
          message: 'Chat is no longer available for cancelled projects.'
        };
      case 'disputed':
        return {
          allowed: true,
          readOnly: true,
          message: 'Chat is read-only during dispute resolution. All messages are preserved for reference.'
        };
      default:
        return {
          allowed: false,
          readOnly: false,
          message: 'Chat is currently unavailable.'
        };
    }
  };

  const chatRestrictions = getChatRestrictions();
  const isChatDisabled = !chatRestrictions.allowed;
  const isReadOnly = chatRestrictions.readOnly;

  useEffect(() => {
    if (chatRestrictions.allowed) {
      fetchMessages();
      subscribeToMessages();
    }
  }, [projectId, chatRestrictions.allowed]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('project_messages')
        .select(`
          id,
          project_id,
          sender_id,
          recipient_id,
          content,
          sent_at,
          metadata,
          sender:profiles!project_messages_sender_id_fkey(
            first_name,
            last_name
          )
        `)
        .eq('project_id', projectId)
        .order('sent_at', { ascending: true });

      if (error) throw error;

      const formattedMessages: ProjectMessage[] = (data as unknown as DatabaseMessage[]).map(msg => ({
        id: msg.id,
        project_id: msg.project_id,
        sender_id: msg.sender_id,
        recipient_id: msg.recipient_id,
        content: msg.content,
        sent_at: msg.sent_at,
        metadata: msg.metadata,
        sender_name: msg.sender ? `${msg.sender.first_name} ${msg.sender.last_name}` : 'Unknown User',
        sender_role: msg.sender_id === clientId ? 'client' : 'professional' as const
      }));

      setMessages(formattedMessages);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const subscribeToMessages = () => {
    const subscription = supabase
      .channel(`project_messages:${projectId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'project_messages',
        filter: `project_id=eq.${projectId}`
      }, (payload) => {
        const newMessage = payload.new as ProjectMessage;
        setMessages(prev => [...prev, newMessage]);
        scrollToBottom();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user?.id) return;

    try {
      const messageData = {
        project_id: projectId,
        sender_id: user.id,
        recipient_id: user.id === clientId ? professionalId : clientId,
        content: newMessage.trim(),
        sent_at: new Date().toISOString(),
        metadata: {
          type: 'message',
          title: 'New Message'
        }
      };

      const { error } = await supabase
        .from('project_messages')
        .insert(messageData);

      if (error) throw error;

      setNewMessage('');
      scrollToBottom();
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add message validation
  const validateMessage = (content: string) => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Message cannot be empty",
        variant: "destructive"
      });
      return false;
    }

    if (content.length > 1000) {
      toast({
        title: "Error",
        description: "Message is too long (maximum 1000 characters)",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  // Add message sanitization
  const sanitizeMessage = (content: string) => {
    // Remove any HTML tags
    const sanitized = content.replace(/<[^>]*>/g, '');
    // Remove any script tags
    return sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  };

  // Update sendMessage to use validation and sanitization
  const handleSendMessage = async () => {
    if (!user?.id) return;

    const sanitizedMessage = sanitizeMessage(newMessage);
    if (!validateMessage(sanitizedMessage)) return;

    try {
      const messageData = {
        project_id: projectId,
        sender_id: user.id,
        recipient_id: user.id === clientId ? professionalId : clientId,
        content: sanitizedMessage,
        sent_at: new Date().toISOString(),
        metadata: {
          type: 'message',
          title: 'New Message'
        }
      };

      const { error } = await supabase
        .from('project_messages')
        .insert(messageData);

      if (error) throw error;

      setNewMessage('');
      scrollToBottom();
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin w-8 h-8 border-4 border-ttc-blue-700 border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle>Project Chat</CardTitle>
          <div className="flex items-center gap-2">
            {isReadOnly && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                Read Only
              </Badge>
            )}
            <Badge variant="secondary" className={isChatDisabled ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
              {isChatDisabled ? 'Chat Disabled' : 'Chat Active'}
            </Badge>
          </div>
        </div>
        {chatRestrictions.message && (
          <Alert className="mt-2">
            <Info className="h-4 w-4" />
            <AlertDescription>{chatRestrictions.message}</AlertDescription>
          </Alert>
        )}
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs lg:max-w-md ${
              message.sender_id === user?.id ? 'bg-ttc-blue-700 text-white' : 'bg-gray-100'
            } rounded-lg px-4 py-2`}>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className={`${
                  message.sender_role === 'client' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                }`}>
                  {message.sender_role === 'client' ? 'Client' : 'Professional'}
                </Badge>
                <span className="text-xs opacity-75">{message.sender_name}</span>
              </div>
              {message.metadata?.type === 'status_change' && (
                <div className="mb-2">
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    {message.metadata.title || 'Status Update'}
                  </Badge>
                </div>
              )}
              <p className="text-sm">{message.content}</p>
              <div className="text-xs opacity-75 mt-1">
                {new Date(message.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </CardContent>

      {isChatDisabled ? (
        <div className="border-t p-4 bg-gray-50">
          <Alert variant="destructive">
            <Lock className="h-4 w-4" />
            <AlertDescription>
              Chat is currently disabled. {chatRestrictions.message}
            </AlertDescription>
          </Alert>
        </div>
      ) : isReadOnly ? (
        <div className="border-t p-4 bg-gray-50">
          <Alert>
            <Lock className="h-4 w-4" />
            <AlertDescription>
              Chat is read-only. {chatRestrictions.message}
            </AlertDescription>
          </Alert>
        </div>
      ) : (
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ProjectChat; 