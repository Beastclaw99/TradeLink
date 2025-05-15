
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Hero: React.FC = () => {
  return (
    <section className="bg-ttc-blue-800 py-16 md:py-24 text-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Connect with skilled tradesmen for your projects
            </h1>
            <p className="text-lg md:text-xl mb-8 text-blue-50">
              Find, hire, and work with professional tradesmen. Manage contracts, track progress, and make secure payments all in one place.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link to="/find-pros" className="flex-1">
                <Button className="w-full bg-white text-ttc-blue-700 hover:bg-blue-50 hover:text-ttc-blue-800 py-6 font-semibold text-lg">
                  Find Tradesmen
                </Button>
              </Link>
              <Link to="/join-network" className="flex-1">
                <Button className="w-full bg-ttc-green-500 hover:bg-ttc-green-600 text-white py-6 font-semibold text-lg">
                  Join as a Tradesman
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-ttc-blue-300 overflow-hidden flex items-center justify-center text-xs font-bold">
                    {i}
                  </div>
                ))}
              </div>
              <p className="ml-4 text-sm">
                <span className="font-bold">1,000+ professionals</span> ready to help with your projects
              </p>
            </div>
          </div>
          
          <div className="hidden lg:grid lg:grid-cols-2 gap-4">
            <div className="rounded-lg overflow-hidden h-80">
              <img 
                src="/lovable-uploads/8bbf4ce1-7690-4c37-9adf-b2751ac81a84.png" 
                alt="Solar panel installation" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-lg overflow-hidden h-80">
              <img 
                src="/lovable-uploads/848377f4-0205-491b-a416-42eea8acae4b.png" 
                alt="Professional tradesman working" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
