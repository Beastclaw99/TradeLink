
import React from 'react';
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onPostProject: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onPostProject }) => {
  return (
    <section className="bg-ttc-blue-800 py-12 text-white">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Project Marketplace</h1>
          <p className="text-lg mb-6">Browse available projects or post your own project to find the right professional</p>
          <Button 
            size="lg" 
            className="bg-ttc-green-500 hover:bg-ttc-green-600 mt-2"
            onClick={onPostProject}
          >
            Post a New Project
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
