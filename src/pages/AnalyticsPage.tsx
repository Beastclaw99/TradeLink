
import React from 'react';
import Layout from '@/components/layout/Layout';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';

const AnalyticsPage: React.FC = () => {
  return (
    <Layout>
      <div className="bg-gray-50 py-8">
        <div className="container-custom">
          <h1 className="text-3xl font-bold mb-2">Analytics & Reports</h1>
          <p className="text-gray-600 mb-8">
            Track performance, project completion rates, and business insights on ProLinkTT
          </p>
          
          <AnalyticsDashboard />
        </div>
      </div>
    </Layout>
  );
};

export default AnalyticsPage;
