import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NotificationSystem from '@/components/shared/NotificationSystem';

const Notifications: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <NotificationSystem />
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;
