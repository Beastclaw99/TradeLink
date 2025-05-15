
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { FileText, Search } from 'lucide-react';

const CTASection: React.FC = () => {
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
            
            <Link to="/post-job" className="mt-8 inline-block">
              <Button className="bg-white text-ttc-blue-700 hover:bg-blue-50 font-semibold py-5 px-6">
                Post a Job
              </Button>
            </Link>
          </div>
          
          <div className="bg-ttc-green-600 rounded-lg p-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Are you a skilled professional?
            </h2>
            <p className="text-green-50 mb-6">
              Join our network of professionals and connect with clients looking for your skills.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="mr-4 bg-white/10 p-2 rounded">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Create a professional profile</h3>
                  <p className="text-sm text-green-50">Showcase your skills, experience, and portfolio</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mr-4 bg-white/10 p-2 rounded">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Accept projects & get paid</h3>
                  <p className="text-sm text-green-50">Grow your business with a steady flow of clients</p>
                </div>
              </div>
            </div>
            
            <Link to="/join-network" className="mt-8 inline-block">
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
