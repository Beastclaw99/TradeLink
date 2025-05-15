
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const CTASection: React.FC = () => {
  return (
    <section className="py-16 bg-ttc-blue-600 text-white">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to get started with your project?
          </h2>
          <p className="text-lg mb-8 text-blue-100">
            Join thousands of satisfied clients across Trinidad and Tobago who've found the perfect professional for their projects.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/post-job">
              <Button className="bg-white text-ttc-blue-600 hover:bg-blue-50 font-semibold py-6 px-8 text-lg">
                Post a Job
              </Button>
            </Link>
            <Link to="/find-pros">
              <Button className="bg-ttc-green-500 hover:bg-ttc-green-600 text-white font-semibold py-6 px-8 text-lg">
                Find a Professional
              </Button>
            </Link>
          </div>
          
          <p className="mt-8 text-sm text-blue-200">
            Are you a skilled tradesman? <Link to="/pro-signup" className="underline">Join our network</Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
