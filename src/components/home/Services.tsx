
import React from 'react';
import { Link } from 'react-router-dom';

// Service category data
const serviceCategories = [
  {
    id: 1,
    title: "Plumbing",
    description: "Expert plumbing services for your home or business",
    icon: "🔧",
    href: "/marketplace?skill=Plumbing",
    gradient: "from-blue-50 to-blue-100"
  },
  {
    id: 2,
    title: "Electrical",
    description: "Professional electrical work and repairs",
    icon: "⚡",
    href: "/marketplace?skill=Electrical",
    gradient: "from-yellow-50 to-yellow-100"
  },
  {
    id: 3,
    title: "Carpentry",
    description: "Custom woodwork and furniture making",
    icon: "🪚",
    href: "/marketplace?skill=Carpentry",
    gradient: "from-amber-50 to-amber-100"
  },
  {
    id: 4,
    title: "Masonry",
    description: "Brickwork, concrete, and stone masonry",
    icon: "🏗️",
    href: "/marketplace?skill=Masonry",
    gradient: "from-stone-50 to-stone-100"
  },
  {
    id: 5,
    title: "Painting",
    description: "Interior and exterior painting services",
    icon: "🎨",
    href: "/marketplace?skill=Painting",
    gradient: "from-rose-50 to-rose-100"
  },
  {
    id: 6,
    title: "Roofing",
    description: "Roof repairs, installation, and maintenance",
    icon: "🏠",
    href: "/marketplace?skill=Roofing",
    gradient: "from-red-50 to-red-100"
  },
  {
    id: 7,
    title: "Landscaping",
    description: "Garden design and maintenance",
    icon: "🌳",
    href: "/marketplace?skill=Landscaping",
    gradient: "from-green-50 to-green-100"
  },
  {
    id: 8,
    title: "HVAC",
    description: "Heating, ventilation, and air conditioning",
    icon: "❄️",
    href: "/marketplace?skill=HVAC",
    gradient: "from-cyan-50 to-cyan-100"
  }
];

const Services: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container-custom">
        <div className="text-center max-w-4xl mx-auto mb-16 px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-ttc-neutral-800 leading-tight">
            Find Services You Need
          </h2>
          <p className="text-lg sm:text-xl text-ttc-neutral-600 leading-relaxed">
            Browse through our popular service categories and find the perfect professional for your project needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {serviceCategories.map(category => (
            <Link 
              key={category.id} 
              to={category.href} 
              className="group"
            >
              <div className={`bg-gradient-to-br ${category.gradient} rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 flex flex-col h-full overflow-hidden border border-white/50`}>
                <div className="p-8">
                  <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">{category.icon}</div>
                  <h3 className="text-xl font-bold mb-4 text-ttc-neutral-800 group-hover:text-ttc-blue-600 transition-colors">{category.title}</h3>
                  <p className="text-ttc-neutral-600 leading-relaxed">{category.description}</p>
                </div>
                <div className="mt-auto p-8 pt-0">
                  <div className="inline-flex items-center text-ttc-blue-600 font-semibold group-hover:text-ttc-blue-700 transition-colors">
                    Explore
                    <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Link to="/marketplace" className="inline-flex items-center text-ttc-blue-600 hover:text-ttc-blue-700 font-bold text-lg transition-colors group">
            View all service categories
            <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;
