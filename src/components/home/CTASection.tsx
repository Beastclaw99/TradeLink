import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { FileText, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const CTASection: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePostProject = () => {
    if (!user) {
      navigate('/login', { state: { redirectTo: '/client/create-project' } });
    } else {
      navigate('/client/create-project');
    }
  };

  return (
    <section className="py-16 bg-ttc-blue-800 text-white">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-ttc-blue-700 rounded-lg p-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Need help with your project?
            </h2>
            <p className="text-blue-100 mb-6">
              Post your project details and get connected with skilled professionals in Trinidad and Tobago.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="mr-4 bg-white/10 p-2 rounded">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Create a service contract</h3>
                  <p className="text-sm text-blue-100">Specify your requirements and budget</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mr-4 bg-white/10 p-2 rounded">
                  <Search className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Get matched with professionals</h3>
                  <p className="text-sm text-blue-100">Review profiles and choose the best fit</p>
                </div>
              </div>
            </div>
            
            <Button 
              className="mt-8 bg-white text-ttc-blue-700 hover:bg-blue-50 font-semibold py-5 px-6"
              onClick={handlePostProject}
            >
              Post a Project
            </Button>
          </div>
          
          <div className="bg-ttc-green-700 rounded-lg p-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Are you a professional?
            </h2>
            <p className="text-green-100 mb-6">
              Join our network of skilled trade professionals and grow your business.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="mr-4 bg-white/10 p-2 rounded">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Create your profile</h3>
                  <p className="text-sm text-green-100">Showcase your skills and experience</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mr-4 bg-white/10 p-2 rounded">
                  <Search className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Find new clients</h3>
                  <p className="text-sm text-green-100">Connect with clients looking for your services</p>
                </div>
              </div>
            </div>
            
            <Link to="/signup" className="mt-8 inline-block">
              <Button className="bg-white text-ttc-green-700 hover:bg-green-50 font-semibold py-5 px-6">
                Join as a Professional
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-sm text-blue-200">
            Over 1,000+ professionals and 5,000+ clients already on Trade Link across Trinidad & Tobago
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
