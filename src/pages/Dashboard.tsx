
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { ClientDashboard } from '@/components/dashboard/ClientDashboard';
import ProfessionalDashboard from '@/components/dashboard/ProfessionalDashboard';

const Dashboard: React.FC = () => {
  const { user, profile } = useAuth();

  if (!user || !profile) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <p>Please log in to access your dashboard.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {profile.account_type === 'client' ? (
        <ClientDashboard />
      ) : (
        <ProfessionalDashboard />
      )}
    </Layout>
  );
};

export default Dashboard;
