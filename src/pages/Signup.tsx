
import React from 'react';
import Layout from '@/components/layout/Layout';
import AuthCard from '@/components/auth/AuthCard';
import SignupForm from '@/components/auth/SignupForm';

const Signup: React.FC = () => {
  return (
    <Layout>
      <AuthCard 
        title="Create Your Account" 
        description="Join ProLinkTT to connect with professionals or find new clients"
      >
        <SignupForm />
      </AuthCard>
    </Layout>
  );
};

export default Signup;
