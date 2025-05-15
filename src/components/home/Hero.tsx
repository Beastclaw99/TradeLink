
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="hero-gradient py-16 md:py-24 text-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Find Skilled Tradesmen for Your Projects
            </h1>
            <p className="text-lg md:text-xl mb-8 text-blue-50">
              Connect with qualified professionals in Trinidad & Tobago. From plumbers and electricians to contractors and landscapers.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link to="/find-pros" className="flex-1">
                <Button className="w-full bg-white text-ttc-blue-600 hover:bg-blue-50 hover:text-ttc-blue-700 py-6 font-semibold text-lg">
                  <Search size={20} className="mr-2" /> Find a Professional
                </Button>
              </Link>
              <Link to="/post-job" className="flex-1">
                <Button className="w-full bg-ttc-green-500 hover:bg-ttc-green-600 text-white py-6 font-semibold text-lg">
                  Post a Job
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-ttc-blue-300 overflow-hidden flex items-center justify-center text-xs font-bold">
                    {/* Would be profile images in a real app */}
                    {i}
                  </div>
                ))}
              </div>
              <p className="ml-4 text-sm">
                <span className="font-bold">1,000+ professionals</span> ready to help with your projects
              </p>
            </div>
          </div>
          
          <div className="hidden lg:block relative">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md mx-auto">
              <h3 className="text-ttc-neutral-800 font-semibold text-xl mb-4">Find the right professional today</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-ttc-neutral-600 mb-1">
                    What service do you need?
                  </label>
                  <select 
                    id="service" 
                    className="w-full py-2 px-3 border border-ttc-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ttc-blue-500"
                  >
                    <option value="">Select a service</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="electrical">Electrical</option>
                    <option value="carpentry">Carpentry</option>
                    <option value="masonry">Masonry</option>
                    <option value="painting">Painting</option>
                    <option value="landscaping">Landscaping</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-ttc-neutral-600 mb-1">
                    Your location
                  </label>
                  <select 
                    id="location" 
                    className="w-full py-2 px-3 border border-ttc-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ttc-blue-500"
                  >
                    <option value="">Select location</option>
                    <option value="port-of-spain">Port of Spain</option>
                    <option value="san-fernando">San Fernando</option>
                    <option value="arima">Arima</option>
                    <option value="chaguanas">Chaguanas</option>
                    <option value="point-fortin">Point Fortin</option>
                    <option value="tobago">Tobago</option>
                  </select>
                </div>
                
                <Button className="w-full bg-ttc-blue-500 hover:bg-ttc-blue-600 text-white py-5">
                  Search Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
