
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  recipient_id: string;
  project_id: string | null;
  file_url: string | null;
  message_type: string | null;
  is_read: boolean | null;
}

interface ChatInterfaceProps {
  projectId: string;
  currentUserId: string;
  recipientId: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  projectId, 
  currentUserId, 
  recipientId 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, [projectId, currentUserId, recipientId]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('direct_messages')
        .select('*')
        .eq('project_id', projectId)
        .or(`and(sender_id.eq.${currentUserId},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${currentUserId})`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Transform data to match Message interface
      const transformedMessages: Message[] = (data || []).map(msg => ({
        ...msg,
        created_at: msg.created_at || new Date().toISOString(),
        project_id: msg.project_id || null,
        file_url: msg.file_url || null,
        message_type: msg.message_type || null,
        is_read: msg.is_read || null
      }));

      setMessages(transformedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('direct_messages')
        .insert([
          {
            content: newMessage,
            sender_id: currentUserId,
            recipient_id: recipientId,
            project_id: projectId
          }
        ]);

      if (error) throw error;

      setNewMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-96">
      <CardHeader>
        <CardTitle>Project Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto mb-4 space-y-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-2 rounded max-w-xs ${
                message.sender_id === currentUserId
                  ? 'bg-blue-500 text-white ml-auto'
                  : 'bg-gray-200'
              }`}
            >
              <p>{message.content}</p>
              <p className="text-xs opacity-70">
                {new Date(message.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <Button onClick={sendMessage} disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;
