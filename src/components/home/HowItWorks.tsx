
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
    <section className="py-16 md:py-24 bg-white">
      <div className="container-custom">
        <div className="text-center max-w-4xl mx-auto mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-ttc-neutral-800 leading-tight">
            How ProLinkTT Works
          </h2>
          <p className="text-lg sm:text-xl text-ttc-neutral-600 leading-relaxed">
            Our platform makes it easy for clients to find skilled professionals and for professionals to grow their business.
          </p>
        </div>

        {/* For Clients Section */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-ttc-blue-600">
              For Clients
            </h3>
            <p className="text-lg text-ttc-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Get your projects done by connecting with skilled trade professionals in Trinidad & Tobago.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {clientSteps.map(step => (
              <div key={step.id} className="relative group">
                <div className="bg-gradient-to-br from-ttc-blue-50 to-ttc-blue-100 rounded-2xl p-8 text-center h-full flex flex-col items-center shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-ttc-blue-200/50">
                  <div className="bg-gradient-to-br from-ttc-blue-500 to-ttc-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mb-6 text-xl font-bold shadow-lg group-hover:animate-pulse-glow">
                    {step.id}
                  </div>
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{step.icon}</div>
                  <h4 className="text-xl font-bold text-ttc-neutral-800 mb-4 leading-tight">{step.title}</h4>
                  <p className="text-ttc-neutral-600 leading-relaxed">{step.description}</p>
                </div>
                
                {/* Connector line */}
                {step.id < clientSteps.length && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 w-8 h-1 bg-gradient-to-r from-ttc-blue-300 to-ttc-blue-400 rounded-full" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* For Professionals Section */}
        <div className="mb-16">
          <div className="text-center mb-16">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-ttc-green-600">
              For Professionals
            </h3>
            <p className="text-lg text-ttc-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Grow your trade business by connecting with clients who need your expertise.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {professionalSteps.map(step => (
              <div key={step.id} className="relative group">
                <div className="bg-gradient-to-br from-ttc-green-50 to-ttc-green-100 rounded-2xl p-8 text-center h-full flex flex-col items-center shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-ttc-green-200/50">
                  <div className="bg-gradient-to-br from-ttc-green-500 to-ttc-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center mb-6 text-xl font-bold shadow-lg group-hover:animate-pulse-glow">
                    {step.id}
                  </div>
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{step.icon}</div>
                  <h4 className="text-xl font-bold text-ttc-neutral-800 mb-4 leading-tight">{step.title}</h4>
                  <p className="text-ttc-neutral-600 leading-relaxed">{step.description}</p>
                </div>
                
                {/* Connector line */}
                {step.id < professionalSteps.length && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 w-8 h-1 bg-gradient-to-r from-ttc-green-300 to-ttc-green-400 rounded-full" />
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/client/create-project">
              <Button className="bg-ttc-blue-500 hover:bg-ttc-blue-600 text-white px-10 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Post a Project
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="outline" className="border-2 border-ttc-green-500 text-ttc-green-600 hover:bg-ttc-green-50 hover:border-ttc-green-600 px-10 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
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
