
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  online: boolean;
}

interface ContactListProps {
  contacts: Contact[];
  selectedContact: Contact | null;
  onSelectContact: (contact: Contact) => void;
}

const ContactList: React.FC<ContactListProps> = ({ 
  contacts, 
  selectedContact, 
  onSelectContact 
}) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Messages</CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search conversations..." className="pl-10" />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className={`p-3 cursor-pointer border-b hover:bg-gray-50 transition-colors ${
                selectedContact?.id === contact.id ? 'bg-blue-50 border-blue-200' : ''
              }`}
              onClick={() => onSelectContact(contact)}
            >
              <div className="flex items-start gap-3">
                <div className="relative flex-shrink-0">
                  <img
                    src={contact.avatar || '/placeholder.svg'}
                    alt={contact.name}
                    className="w-12 h-12 rounded-full"
                  />
                  {contact.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm truncate">{contact.name}</h4>
                    <span className="text-xs text-gray-500">{contact.timestamp}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate">{contact.lastMessage}</p>
                    {contact.unreadCount > 0 && (
                      <Badge variant="default" className="ml-2 text-xs h-5 w-5 flex items-center justify-center p-0">
                        {contact.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactList;
