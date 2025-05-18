
import React from 'react';
import { Button } from "@/components/ui/button";

interface CTASectionProps {
  onPostProject: () => void;
}

const CTASection: React.FC<CTASectionProps> = ({ onPostProject }) => {
  return (
    <section className="py-12 bg-white">
      <div className="container-custom">
        <div className="bg-ttc-blue-700 rounded-lg shadow-xl p-8 text-white">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">Have a project you need help with?</h2>
              <p className="mb-6">Post your project for free and get connected with qualified professionals in Trinidad & Tobago.</p>
              <Button className="bg-white text-ttc-blue-700 hover:bg-blue-50" onClick={onPostProject}>
                Post Your Project
              </Button>
            </div>
            <div className="hidden md:block">
              <img 
                src="/lovable-uploads/8bbf4ce1-7690-4c37-9adf-b2751ac81a84.png" 
                alt="Post a project" 
                className="rounded-lg max-h-48 w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
