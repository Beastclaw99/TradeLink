
import React from 'react';
import Layout from '@/components/layout/Layout';
import ComplianceUploadForm from '@/components/compliance/ComplianceUploadForm';

const CompliancePage: React.FC = () => {
  return (
    <Layout>
      <div className="bg-gray-50 py-8">
        <div className="container-custom">
          <h1 className="text-3xl font-bold mb-2">Compliance & Documentation</h1>
          <p className="text-gray-600 mb-8">
            Manage your professional certifications, licenses, and compliance documents on ProLinkTT
          </p>
          
          <ComplianceUploadForm />
        </div>
      </div>
    </Layout>
  );
};

export default CompliancePage;
