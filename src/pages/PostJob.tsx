
import React from 'react';
import Layout from '@/components/layout/Layout';

const PostJob: React.FC = () => {
  return (
    <Layout>
      <div className="container-custom py-12">
        <h1 className="text-3xl font-bold mb-6">Post a Job</h1>
        <p className="text-ttc-neutral-600 mb-8">
          This page would contain a form to post a new job or project.
        </p>
        <div className="bg-ttc-neutral-100 p-8 rounded-lg text-center">
          <p className="text-lg font-medium">This is a placeholder for the Post a Job page</p>
          <p className="mt-4 text-ttc-neutral-500">Full implementation would include a job posting form with details like job type, location, budget, and description.</p>
        </div>
      </div>
    </Layout>
  );
};

export default PostJob;
