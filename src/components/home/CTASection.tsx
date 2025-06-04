
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { FileText, Search, ArrowRight } from 'lucide-react';
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
    <section className="py-16 md:py-24 bg-gradient-to-br from-ttc-blue-600 to-ttc-blue-700 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <div className="container-custom relative">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          <div className="bg-gradient-to-br from-ttc-blue-700/80 to-ttc-blue-800/80 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border border-white/10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 leading-tight">
              Need help with your project?
            </h2>
            <p className="text-blue-100 mb-8 text-lg leading-relaxed">
              Post your project details and get connected with skilled professionals in Trinidad and Tobago.
            </p>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start group">
                <div className="mr-6 bg-white/20 p-3 rounded-2xl group-hover:bg-white/30 transition-colors">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Create a service contract</h3>
                  <p className="text-blue-100 leading-relaxed">Specify your requirements and budget</p>
                </div>
              </div>
              
              <div className="flex items-start group">
                <div className="mr-6 bg-white/20 p-3 rounded-2xl group-hover:bg-white/30 transition-colors">
                  <Search className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Get matched with professionals</h3>
                  <p className="text-blue-100 leading-relaxed">Review profiles and choose the best fit</p>
                </div>
              </div>
            </div>
            
            <Button 
              className="bg-white text-ttc-blue-700 hover:bg-blue-50 font-bold py-6 px-8 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
              onClick={handlePostProject}
            >
              Post a Project
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          
          <div className="bg-gradient-to-br from-ttc-green-600/90 to-ttc-green-700/90 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border border-white/10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 leading-tight">
              Are you a professional?
            </h2>
            <p className="text-green-100 mb-8 text-lg leading-relaxed">
              Join our network of skilled trade professionals and grow your business.
            </p>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start group">
                <div className="mr-6 bg-white/20 p-3 rounded-2xl group-hover:bg-white/30 transition-colors">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Create your profile</h3>
                  <p className="text-green-100 leading-relaxed">Showcase your skills and experience</p>
                </div>
              </div>
              
              <div className="flex items-start group">
                <div className="mr-6 bg-white/20 p-3 rounded-2xl group-hover:bg-white/30 transition-colors">
                  <Search className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Find new clients</h3>
                  <p className="text-green-100 leading-relaxed">Connect with clients looking for your services</p>
                </div>
              </div>
            </div>
            
            <Link to="/signup" className="inline-block">
              <Button className="bg-white text-ttc-green-700 hover:bg-green-50 font-bold py-6 px-8 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                Join as a Professional
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-blue-200 text-lg">
            Over 1,000+ professionals and 5,000+ clients already on Trade Link across Trinidad & Tobago
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
