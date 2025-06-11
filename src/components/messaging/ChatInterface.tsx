import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Phone, Video, MoreVertical } from 'lucide-react';
import ContactList from './ContactList';
import MessageBubble from './MessageBubble';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  sent_at: string;
  read: boolean;
  metadata?: {
    type?: string;
    title?: string;
  };
  sender?: {
    first_name: string;
    last_name: string;
    profile_image: string;
  };
}

interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  profile_image: string;
  last_message?: Message;
  unread_count: number;
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
          profile_image,
          last_message:messages!messages_recipient_id_fkey(
            id,
            content,
            sent_at,
            read
          ),
          unread_count:messages!messages_recipient_id_fkey(
            count
          )
        `)
        .neq('id', user?.id)
        .order('last_message.sent_at', { ascending: false });

      if (error) throw error;

      const formattedContacts: Contact[] = (data || []).map(contact => ({
        id: contact.id,
        first_name: contact.first_name,
        last_name: contact.last_name,
        profile_image: contact.profile_image,
        last_message: contact.last_message?.[0],
        unread_count: contact.unread_count?.[0]?.count || 0
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
        .from('messages')
        .select(`
          id,
          sender_id,
          recipient_id,
          content,
          sent_at,
          read,
          metadata,
          sender:profiles!messages_sender_id_fkey(
            first_name,
            last_name,
            profile_image
          )
        `)
        .or(`and(sender_id.eq.${user?.id},recipient_id.eq.${contactId}),and(sender_id.eq.${contactId},recipient_id.eq.${user?.id})`)
        .order('sent_at', { ascending: true });

      if (error) throw error;

      setMessages(data || []);
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
      .channel('messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `or(recipient_id.eq.${user?.id},sender_id.eq.${user?.id})`
      }, (payload) => {
        const newMessage = payload.new as Message;
        setMessages(prev => [...prev, newMessage]);
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
        sent_at: new Date().toISOString(),
        read: false,
        metadata: {
          type: 'message',
          title: 'New Message'
        }
      };

      const { error } = await supabase
        .from('messages')
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

  return (
    <div className="grid lg:grid-cols-4 gap-6 h-[600px]">
      {/* Contact List */}
      <div className="lg:col-span-1">
        <ContactList
          contacts={contacts}
          selectedContact={selectedContact}
          onSelectContact={setSelectedContact}
          isLoading={isLoading}
        />
      </div>

      {/* Chat Area */}
      <div className="lg:col-span-3">
        {selectedContact ? (
          <div className="flex flex-col h-full">
            {/* Chat Header */}
            <div className="flex items-center p-4 border-b">
              <img
                src={selectedContact.profile_image || '/default-avatar.png'}
                alt={`${selectedContact.first_name} ${selectedContact.last_name}`}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <h3 className="font-medium">
                  {selectedContact.first_name} {selectedContact.last_name}
                </h3>
                <p className="text-sm text-gray-500">Online</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md ${
                    message.sender_id === user?.id ? 'bg-ttc-blue-700 text-white' : 'bg-gray-100'
                  } rounded-lg px-4 py-2`}>
                    <p className="text-sm">{message.content}</p>
                    <div className="text-xs opacity-75 mt-1">
                      {new Date(message.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a contact to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
