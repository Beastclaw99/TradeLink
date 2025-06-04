
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Hero: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-ttc-blue-600 to-ttc-blue-700 py-20 md:py-32 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <div className="container-custom relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-in space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Connect with skilled 
                <span className="block text-ttc-blue-200">trade professionals</span>
                for your projects
              </h1>
              
              <p className="text-xl md:text-2xl text-blue-100 leading-relaxed max-w-2xl">
                Find, hire, and work with professionals. Manage contracts, track progress, and make secure payments all in one place.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <Link to="/project-marketplace" className="flex-1">
                <Button className="w-full bg-white text-ttc-blue-700 hover:bg-blue-50 hover:text-ttc-blue-800 py-6 px-8 font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  Project Marketplace
                </Button>
              </Link>
              <Link to="/marketplace" className="flex-1">
                <Button className="w-full bg-ttc-green-500 hover:bg-ttc-green-600 text-white py-6 px-8 font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  Professional Marketplace
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center pt-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-3 border-white bg-gradient-to-br from-ttc-blue-300 to-ttc-blue-400 overflow-hidden flex items-center justify-center text-sm font-bold shadow-lg animate-float" style={{ animationDelay: `${i * 0.2}s` }}>
                    {i}
                  </div>
                ))}
              </div>
              <div className="ml-6">
                <p className="text-lg">
                  <span className="font-bold text-white">1,000+ professionals</span>
                  <br />
                  <span className="text-blue-200">ready to help with your projects</span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:grid lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="rounded-2xl overflow-hidden h-80 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-300">
                <img alt="Solar panel installation" className="w-full h-full object-cover" src="/lovable-uploads/93c3c189-5561-4881-a790-6565fbe4f664.jpg" />
              </div>
            </div>
            <div className="space-y-6 pt-12">
              <div className="rounded-2xl overflow-hidden h-80 shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                <img alt="Professional tradesman working" className="w-full h-full object-cover" src="/lovable-uploads/e9e54bb8-66ec-480c-9ca6-85914ac0e861.jpg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
