
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Phone, Video, MoreVertical } from 'lucide-react';
import ContactList from './ContactList';
import MessageBubble from './MessageBubble';

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
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! I saw your project posting for the kitchen renovation. I have 10 years of experience in similar projects.',
      timestamp: '10:30 AM',
      isOwn: false,
      senderName: 'John Smith',
      senderAvatar: '/placeholder.svg'
    },
    {
      id: '2',
      text: 'Great! Could you share some examples of your previous work?',
      timestamp: '10:35 AM',
      isOwn: true,
      senderName: 'You'
    },
    {
      id: '3',
      text: 'Of course! I\'ll send you a portfolio. When would be a good time to visit the site?',
      timestamp: '10:37 AM',
      isOwn: false,
      senderName: 'John Smith',
      senderAvatar: '/placeholder.svg'
    }
  ]);

  // Mock contacts data
  const contacts: Contact[] = [
    {
      id: '1',
      name: 'John Smith',
      avatar: '/placeholder.svg',
      lastMessage: 'Of course! I\'ll send you a portfolio...',
      timestamp: '10:37 AM',
      unreadCount: 0,
      online: true
    },
    {
      id: '2',
      name: 'Maria Rodriguez',
      avatar: '/placeholder.svg',
      lastMessage: 'When can we schedule the electrical work?',
      timestamp: 'Yesterday',
      unreadCount: 2,
      online: false
    },
    {
      id: '3',
      name: 'David Williams',
      avatar: '/placeholder.svg',
      lastMessage: 'Project completed successfully!',
      timestamp: '2 days ago',
      unreadCount: 0,
      online: true
    }
  ];

  const sendMessage = () => {
    if (messageText.trim() && selectedContact) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: messageText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true,
        senderName: 'You'
      };
      
      setMessages([...messages, newMessage]);
      setMessageText('');
      
      // TODO: Integrate with backend messaging API
    }
  };

  return (
    <div className="grid lg:grid-cols-4 gap-6 h-[600px]">
      {/* Contact List */}
      <div className="lg:col-span-1">
        <ContactList
          contacts={contacts}
          selectedContact={selectedContact}
          onSelectContact={setSelectedContact}
        />
      </div>

      {/* Chat Area */}
      <div className="lg:col-span-3">
        {selectedContact ? (
          <Card className="h-full flex flex-col">
            {/* Chat Header */}
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={selectedContact.avatar || '/placeholder.svg'}
                      alt={selectedContact.name}
                      className="w-10 h-10 rounded-full"
                    />
                    {selectedContact.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{selectedContact.name}</CardTitle>
                    <p className="text-sm text-gray-500">
                      {selectedContact.online ? 'Online' : 'Last seen 2h ago'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
            </CardContent>

            {/* Message Input */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type a message..."
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <Button onClick={sendMessage} disabled={!messageText.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="h-full flex items-center justify-center">
            <div className="text-center text-gray-500">
              <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
              <p>Choose a contact from the list to start messaging</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
