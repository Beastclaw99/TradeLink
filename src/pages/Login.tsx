
import React from 'react';
import Layout from '@/components/layout/Layout';
import AuthCard from '@/components/auth/AuthCard';
import LoginForm from '@/components/auth/LoginForm';

const Login: React.FC = () => {
  return (
    <Layout>
      <AuthCard 
        title="Welcome Back" 
        description="Sign in to your ProLinkTT account"
      >
        <LoginForm />
      </AuthCard>
    </Layout>
  );
};

export default Login;
