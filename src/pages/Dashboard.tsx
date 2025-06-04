
import React from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { ProfessionalDashboard } from '@/components/dashboard/ProfessionalDashboard';
import { ClientDashboard } from '@/components/dashboard/ClientDashboard';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import AccountTypeSelection from '@/components/auth/AccountTypeSelection';

const Dashboard: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {user.user_metadata?.account_type === 'professional' ? (
          <ProfessionalDashboard userId={user.id} />
        ) : user.user_metadata?.account_type === 'client' ? (
          <ClientDashboard userId={user.id} />
        ) : (
          <AccountTypeSelection />
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
