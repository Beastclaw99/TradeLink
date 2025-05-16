import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
const steps = [{
  id: 1,
  title: "Post Your Job",
  description: "Describe the work you need done, and when you need it completed.",
  icon: "📝"
}, {
  id: 2,
  title: "Get Matched",
  description: "Qualified professionals will send you quotes for your project.",
  icon: "🔍"
}, {
  id: 3,
  title: "Hire the Best",
  description: "Compare bids, profiles, reviews and hire the perfect pro for your job.",
  icon: "👍"
}, {
  id: 4,
  title: "Pay Securely",
  description: "Pay through our secure WiPay platform once work is completed to your satisfaction.",
  icon: "🔒"
}];
const HowItWorks: React.FC = () => {
  return <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-ttc-neutral-800">
            How Trini Trade Connect Works
          </h2>
          <p className="text-ttc-neutral-600">
            Our platform makes it easy to find and hire skilled professionals for any job, big or small.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map(step => <div key={step.id} className="relative">
              <div className="bg-ttc-blue-50 rounded-lg p-6 text-center h-full flex flex-col items-center">
                <div className="bg-ttc-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center mb-4 text-xl font-bold">
                  {step.id}
                </div>
                <div className="">{step.icon}</div>
                <h3 className="text-xl font-semibold text-ttc-neutral-800 mb-3">{step.title}</h3>
                <p className="text-ttc-neutral-600">{step.description}</p>
              </div>
              
              {/* Connector line */}
              {step.id < steps.length && <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 w-8 h-1 bg-ttc-blue-300" />}
            </div>)}
        </div>
        
        <div className="mt-12 text-center">
          <Link to="/how-it-works">
            <Button className="bg-ttc-blue-500 hover:bg-ttc-blue-600 text-white">
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </section>;
};
export default HowItWorks;