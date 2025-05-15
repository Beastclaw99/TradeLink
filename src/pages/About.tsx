
import React from 'react';
import Layout from '@/components/layout/Layout';

const About: React.FC = () => {
  return (
    <Layout>
      <div className="container-custom py-12">
        <h1 className="text-3xl font-bold mb-6">About Trini Trade Connect</h1>
        <p className="text-ttc-neutral-600 mb-8">
          Learn more about our mission to connect tradesmen and clients across Trinidad and Tobago.
        </p>
        <div className="bg-ttc-neutral-100 p-8 rounded-lg text-center">
          <p className="text-lg font-medium">This is a placeholder for the About page</p>
          <p className="mt-4 text-ttc-neutral-500">Full implementation would include company information, mission statement, team members, and contact details.</p>
        </div>
      </div>
    </Layout>
  );
};

export default About;
