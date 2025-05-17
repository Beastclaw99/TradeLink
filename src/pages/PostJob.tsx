
import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';

const PostJob: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If the user is logged in, redirect them to the dashboard
    if (user) {
      navigate('/dashboard', { state: { activeTab: 'create' } });
    }
  }, [user, navigate]);

  return (
    <Layout>
      <div className="container-custom py-12">
        <h1 className="text-3xl font-bold mb-6">Post a Job</h1>
        
        {user ? (
          <div className="flex justify-center items-center py-8">
            <p>Redirecting to dashboard...</p>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <p className="text-lg text-ttc-neutral-600 mb-8">
              You need to be logged in as a client to post a job. Please log in or sign up first.
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={() => navigate('/login', { state: { redirect: '/post-job' } })}
                className="bg-ttc-blue-700 hover:bg-ttc-blue-800"
              >
                Login
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/signup', { state: { redirect: '/post-job', accountType: 'client' } })}
                className="border-ttc-blue-700 text-ttc-blue-700 hover:bg-ttc-blue-50"
              >
                Sign Up as Client
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PostJob;
