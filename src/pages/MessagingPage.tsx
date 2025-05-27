
import React from 'react';
import Layout from '@/components/layout/Layout';
import ChatInterface from '@/components/messaging/ChatInterface';

const MessagingPage: React.FC = () => {
  return (
    <Layout>
      <div className="bg-gray-50 py-8">
        <div className="container-custom">
          <h1 className="text-3xl font-bold mb-2">Messages</h1>
          <p className="text-gray-600 mb-8">
            Communicate with professionals and clients on ProLinkTT
          </p>
          
          <ChatInterface />
        </div>
      </div>
    </Layout>
  );
};

export default MessagingPage;
