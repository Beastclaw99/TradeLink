import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Phone, Video, MoreVertical } from 'lucide-react';
import ContactList from './ContactList';
import MessageBubble from './MessageBubble';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
  senderName: string;
  senderAvatar?: string;
}

interface Contact {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  online: boolean;
}

const ChatInterface: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?.id) {
      fetchContacts();
      subscribeToMessages();
    }
  }, [user?.id]);

  useEffect(() => {
    if (selectedContact) {
      fetchMessages(selectedContact.id);
    }
  }, [selectedContact]);

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          first_name,
          last_name,
          profile_image_url,
          direct_messages!direct_messages_recipient_id_fkey(
            id,
            content,
            sent_at,
            sender_id
          )
        `)
        .neq('id', user?.id)
        .order('direct_messages.sent_at', { ascending: false });

      if (error) throw error;

      const formattedContacts: Contact[] = (data || []).map(contact => ({
        id: contact.id,
        name: `${contact.first_name} ${contact.last_name}`,
        avatar: contact.profile_image_url || '/placeholder.svg',
        lastMessage: contact.direct_messages?.[0]?.content || '',
        timestamp: contact.direct_messages?.[0]?.sent_at || '',
        unreadCount: contact.direct_messages?.filter((m: { sender_id: string }) => m.sender_id !== user?.id).length || 0,
        online: false // You might want to implement online status tracking
      }));

      setContacts(formattedContacts);
    } catch (error: any) {
      console.error('Error fetching contacts:', error);
      toast({
        title: "Error",
        description: "Failed to load contacts. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (contactId: string) => {
    try {
      const { data, error } = await supabase
        .from('direct_messages')
        .select(`
          id,
          sender_id,
          recipient_id,
          content,
          sent_at,
          sender:profiles!direct_messages_sender_id_fkey(
            first_name,
            last_name,
            profile_image_url
          )
        `)
        .or(`and(sender_id.eq.${user?.id},recipient_id.eq.${contactId}),and(sender_id.eq.${contactId},recipient_id.eq.${user?.id})`)
        .order('sent_at', { ascending: true });

      if (error) throw error;

      const formattedMessages: Message[] = (data || []).map(message => ({
        id: message.id,
        text: message.content,
        timestamp: new Date(message.sent_at || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: message.sender_id === user?.id,
        senderName: message.sender ? `${message.sender.first_name} ${message.sender.last_name}` : 'Unknown',
        senderAvatar: message.sender?.profile_image_url
      }));

      setMessages(formattedMessages);
      scrollToBottom();
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages. Please try again later.",
        variant: "destructive"
      });
    }
  };

  const subscribeToMessages = () => {
    const subscription = supabase
      .channel('direct_messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'direct_messages',
        filter: `or(recipient_id.eq.${user?.id},sender_id.eq.${user?.id})`
      }, (payload: any) => {
        const newMessage = payload.new;
        const formattedMessage: Message = {
          id: newMessage.id,
          text: newMessage.content,
          timestamp: new Date(newMessage.sent_at || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isOwn: newMessage.sender_id === user?.id,
          senderName: newMessage.sender ? `${newMessage.sender.first_name} ${newMessage.sender.last_name}` : 'Unknown',
          senderAvatar: newMessage.sender?.profile_image_url
        };
        setMessages(prev => [...prev, formattedMessage]);
        scrollToBottom();
        fetchContacts(); // Refresh contacts to update last message
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user?.id || !selectedContact) return;

    try {
      const messageData = {
        sender_id: user.id,
        recipient_id: selectedContact.id,
        content: newMessage.trim(),
        sent_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('direct_messages')
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

  return (
    <div className="flex h-full">
      <div className="w-1/3 border-r">
        <ContactList
          contacts={contacts}
          selectedContact={selectedContact}
          onSelectContact={setSelectedContact}
        />
      </div>
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            <div className="flex items-center p-4 border-b">
              <img
                src={selectedContact.avatar || '/placeholder.svg'}
                alt={selectedContact.name}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <h3 className="font-medium">{selectedContact.name}</h3>
                <p className="text-sm text-gray-500">Online</p>
              </div>
              <div className="ml-auto flex gap-2">
                <Button variant="ghost" size="icon">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <Button onClick={sendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
