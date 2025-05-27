
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, MessageSquare, Briefcase, DollarSign, Star } from 'lucide-react';

const Notifications: React.FC = () => {
  const [notifications] = useState([
    {
      id: 1,
      type: 'message',
      title: 'New message from Sarah Johnson',
      description: 'Regarding the bathroom renovation project',
      time: '5 minutes ago',
      unread: true,
      icon: <MessageSquare className="h-5 w-5" />
    },
    {
      id: 2,
      type: 'project',
      title: 'New project match',
      description: 'Kitchen electrical work in San Fernando - $3,500',
      time: '1 hour ago',
      unread: true,
      icon: <Briefcase className="h-5 w-5" />
    },
    {
      id: 3,
      type: 'payment',
      title: 'Payment received',
      description: '$2,400 from residential plumbing project',
      time: '3 hours ago',
      unread: false,
      icon: <DollarSign className="h-5 w-5" />
    },
    {
      id: 4,
      type: 'review',
      title: 'New 5-star review',
      description: 'Client left positive feedback for your work',
      time: '1 day ago',
      unread: false,
      icon: <Star className="h-5 w-5" />
    },
    {
      id: 5,
      type: 'project',
      title: 'Project deadline reminder',
      description: 'Office renovation due in 3 days',
      time: '2 days ago',
      unread: false,
      icon: <Briefcase className="h-5 w-5" />
    }
  ]);

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'message': return 'text-blue-600';
      case 'project': return 'text-green-600';
      case 'payment': return 'text-purple-600';
      case 'review': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getNotificationBg = (type: string) => {
    switch (type) {
      case 'message': return 'bg-blue-100';
      case 'project': return 'bg-green-100';
      case 'payment': return 'bg-purple-100';
      case 'review': return 'bg-yellow-100';
      default: return 'bg-gray-100';
    }
  };

  return (
    <Layout>
      <div className="container-custom py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Notifications</h1>
            <p className="text-gray-600">Stay updated with your latest activities and opportunities</p>
          </div>
          <Button variant="outline">
            <Bell className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
        </div>

        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card key={notification.id} className={`transition-all duration-200 hover:shadow-md ${
              notification.unread ? 'border-l-4 border-l-ttc-blue-500 bg-blue-50/30' : ''
            }`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${getNotificationBg(notification.type)} ${getNotificationColor(notification.type)}`}>
                    {notification.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{notification.title}</h3>
                      {notification.unread && <Badge variant="secondary" className="bg-ttc-blue-100 text-ttc-blue-700">New</Badge>}
                    </div>
                    <p className="text-gray-600 mb-2">{notification.description}</p>
                    <p className="text-sm text-gray-400">{notification.time}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">New Project Matches</h4>
                  <p className="text-sm text-gray-600">Get notified when projects match your skills</p>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Messages</h4>
                  <p className="text-sm text-gray-600">Client messages and communication updates</p>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Payment Updates</h4>
                  <p className="text-sm text-gray-600">Payment confirmations and invoice updates</p>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Notifications;
