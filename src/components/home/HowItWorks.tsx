
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const clientSteps = [
  {
    id: 1,
    title: "Post Your Project",
    description: "Describe the work you need done, set your budget, and specify your timeline.",
    icon: "📝"
  },
  {
    id: 2,
    title: "Review Proposals",
    description: "Qualified professionals will send you detailed proposals with quotes and timelines.",
    icon: "🔍"
  },
  {
    id: 3,
    title: "Select & Hire",
    description: "Compare profiles, reviews, and proposals to hire the perfect professional for your job.",
    icon: "👍"
  },
  {
    id: 4,
    title: "Pay Securely",
    description: "Pay through our secure platform once work is completed to your satisfaction.",
    icon: "🔒"
  }
];

const professionalSteps = [
  {
    id: 1,
    title: "Create Your Profile",
    description: "Showcase your skills, experience, certifications, and previous work samples.",
    icon: "👤"
  },
  {
    id: 2,
    title: "Browse Projects",
    description: "Find projects that match your expertise and submit competitive proposals.",
    icon: "🔍"
  },
  {
    id: 3,
    title: "Get Hired",
    description: "Communicate with clients, negotiate terms, and start working on approved projects.",
    icon: "🤝"
  },
  {
    id: 4,
    title: "Get Paid",
    description: "Complete the work, get client approval, and receive secure payments through our platform.",
    icon: "💰"
  }
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-ttc-neutral-800">
            How ProLinkTT Works
          </h2>
          <p className="text-ttc-neutral-600">
            Our platform makes it easy for clients to find skilled professionals and for professionals to grow their business.
          </p>
        </div>

        {/* For Clients Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-ttc-blue-700">
              For Clients
            </h3>
            <p className="text-ttc-neutral-600 max-w-2xl mx-auto">
              Get your projects done by connecting with skilled trade professionals in Trinidad & Tobago.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {clientSteps.map(step => (
              <div key={step.id} className="relative">
                <div className="bg-ttc-blue-50 rounded-lg p-6 text-center h-full flex flex-col items-center">
                  <div className="bg-ttc-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center mb-4 text-xl font-bold">
                    {step.id}
                  </div>
                  <div className="text-2xl mb-3">{step.icon}</div>
                  <h4 className="text-xl font-semibold text-ttc-neutral-800 mb-3">{step.title}</h4>
                  <p className="text-ttc-neutral-600 text-sm">{step.description}</p>
                </div>
                
                {/* Connector line */}
                {step.id < clientSteps.length && <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 w-8 h-1 bg-ttc-blue-300" />}
              </div>
            ))}
          </div>
        </div>

        {/* For Professionals Section */}
        <div className="mb-12">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-ttc-green-600">
              For Professionals
            </h3>
            <p className="text-ttc-neutral-600 max-w-2xl mx-auto">
              Grow your trade business by connecting with clients who need your expertise.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {professionalSteps.map(step => (
              <div key={step.id} className="relative">
                <div className="bg-ttc-green-50 rounded-lg p-6 text-center h-full flex flex-col items-center">
                  <div className="bg-ttc-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center mb-4 text-xl font-bold">
                    {step.id}
                  </div>
                  <div className="text-2xl mb-3">{step.icon}</div>
                  <h4 className="text-xl font-semibold text-ttc-neutral-800 mb-3">{step.title}</h4>
                  <p className="text-ttc-neutral-600 text-sm">{step.description}</p>
                </div>
                
                {/* Connector line */}
                {step.id < professionalSteps.length && <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 w-8 h-1 bg-ttc-green-300" />}
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/client/create-project">
              <Button className="bg-ttc-blue-500 hover:bg-ttc-blue-600 text-white px-8 py-3">
                Post a Project
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="outline" className="border-ttc-green-500 text-ttc-green-600 hover:bg-ttc-green-50 px-8 py-3">
                Join as Professional
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
