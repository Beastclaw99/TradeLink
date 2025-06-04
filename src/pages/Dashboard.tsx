
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ClientDashboard from '@/components/dashboard/ClientDashboard';
import ProfessionalDashboard from '@/components/dashboard/ProfessionalDashboard';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const Dashboard: React.FC = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardContent className="p-6">
            <p>Please log in to access your dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return profile.account_type === 'client' ? (
    <ClientDashboard />
  ) : (
    <ProfessionalDashboard userId={user.id} />
  );
};

export default Dashboard;
