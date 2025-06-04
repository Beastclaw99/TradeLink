import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Hero: React.FC = () => {
  return <section className="bg-ttc-blue-800 py-16 md:py-24 text-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Connect with skilled trade professionals for your projects</h1>
            <p className="text-lg md:text-xl mb-8 text-blue-50">Find, hire, and work with professionals. Manage contracts, track progress, and make secure payments all in one place.</p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link to="/project-marketplace" className="flex-1">
                <Button className="w-full bg-white text-ttc-blue-700 hover:bg-blue-50 hover:text-ttc-blue-800 py-6 font-semibold text-lg">Project Marketplace</Button>
              </Link>
              <Link to="/marketplace" className="flex-1">
                <Button className="w-full bg-ttc-green-500 hover:bg-ttc-green-600 text-white py-6 font-semibold text-lg">Professional Marketplace</Button>
              </Link>
            </div>
            
            <div className="flex items-center">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-ttc-blue-300 overflow-hidden flex items-center justify-center text-xs font-bold">
                    {i}
                  </div>)}
              </div>
              <p className="ml-4 text-sm">
                <span className="font-bold">1,000+ professionals</span> ready to help with your projects
              </p>
            </div>
          </div>
          
          <div className="hidden lg:grid lg:grid-cols-2 gap-4">
            <div className="rounded-lg overflow-hidden h-80">
              <img alt="Solar panel installation" className="w-full h-full object-cover" src="/lovable-uploads/93c3c189-5561-4881-a790-6565fbe4f664.jpg" />
            </div>
            <div className="rounded-lg overflow-hidden h-80">
              <img alt="Professional tradesman working" className="w-full h-full object-cover" src="/lovable-uploads/e9e54bb8-66ec-480c-9ca6-85914ac0e861.jpg" />
            </div>
          </div>
        </div>
      </div>
    </section>;
};

export default Hero;