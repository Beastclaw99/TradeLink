
import React from 'react';
import Layout from '@/components/layout/Layout';

const HowItWorks: React.FC = () => {
  return (
    <Layout>
      <div className="container-custom py-12">
        <h1 className="text-3xl font-bold mb-6">How It Works</h1>
        <p className="text-ttc-neutral-600 mb-8">
          Learn more about how Trini Trade Connect helps you find professionals or grow your business.
        </p>
        <div className="bg-ttc-neutral-100 p-8 rounded-lg text-center">
          <p className="text-lg font-medium">This is a placeholder for the How It Works page</p>
          <p className="mt-4 text-ttc-neutral-500">Full implementation would include detailed explanations of the platform's processes for both clients and professionals.</p>
        </div>
      </div>
    </Layout>
  );
};

export default HowItWorks;
