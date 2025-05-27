
import React from 'react';

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
  senderName: string;
  senderAvatar?: string;
}

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  if (message.isOwn) {
    return (
      <div className="flex justify-end">
        <div className="max-w-xs lg:max-w-md">
          <div className="bg-blue-500 text-white rounded-lg px-4 py-2">
            <p className="text-sm">{message.text}</p>
          </div>
          <div className="text-xs text-gray-500 mt-1 text-right">
            {message.timestamp}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="flex items-start gap-2 max-w-xs lg:max-w-md">
        <img
          src={message.senderAvatar || '/placeholder.svg'}
          alt={message.senderName}
          className="w-8 h-8 rounded-full flex-shrink-0"
        />
        <div>
          <div className="bg-gray-100 rounded-lg px-4 py-2">
            <p className="text-sm text-gray-900">{message.text}</p>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {message.senderName} • {message.timestamp}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
