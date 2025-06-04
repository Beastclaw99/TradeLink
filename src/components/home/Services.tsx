import React from 'react';
import { Link } from 'react-router-dom';

// Service category data
const serviceCategories = [
  {
    id: 1,
    title: "Plumbing",
    description: "Expert plumbing services for your home or business",
    icon: "🔧",
    href: "/marketplace?skill=Plumbing"
  },
  {
    id: 2,
    title: "Electrical",
    description: "Professional electrical work and repairs",
    icon: "⚡",
    href: "/marketplace?skill=Electrical"
  },
  {
    id: 3,
    title: "Carpentry",
    description: "Custom woodwork and furniture making",
    icon: "🪚",
    href: "/marketplace?skill=Carpentry"
  },
  {
    id: 4,
    title: "Masonry",
    description: "Brickwork, concrete, and stone masonry",
    icon: "🏗️",
    href: "/marketplace?skill=Masonry"
  },
  {
    id: 5,
    title: "Painting",
    description: "Interior and exterior painting services",
    icon: "🎨",
    href: "/marketplace?skill=Painting"
  },
  {
    id: 6,
    title: "Roofing",
    description: "Roof repairs, installation, and maintenance",
    icon: "🏠",
    href: "/marketplace?skill=Roofing"
  },
  {
    id: 7,
    title: "Landscaping",
    description: "Garden design and maintenance",
    icon: "🌳",
    href: "/marketplace?skill=Landscaping"
  },
  {
    id: 8,
    title: "HVAC",
    description: "Heating, ventilation, and air conditioning",
    icon: "❄️",
    href: "/marketplace?skill=HVAC"
  }
];

const Services: React.FC = () => {
  return (
    <section className="py-8 sm:py-12 md:py-16 bg-ttc-neutral-100">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-12 px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 text-ttc-neutral-800">
            Find Services You Need
          </h2>
          <p className="text-sm sm:text-base text-ttc-neutral-600">
            Browse through our popular service categories and find the perfect professional for your project needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {serviceCategories.map(category => (
            <Link 
              key={category.id} 
              to={category.href} 
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col h-full overflow-hidden"
            >
              <div className="p-6">
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="text-lg font-semibold mb-2 text-ttc-neutral-800">{category.title}</h3>
                <p className="text-sm text-ttc-neutral-600">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-8 sm:mt-10 text-center">
          <Link to="/marketplace" className="inline-block text-ttc-blue-700 hover:text-ttc-blue-800 font-semibold transition-colors">
            View all service categories
            <svg className="ml-1 w-4 h-4 sm:w-5 sm:h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;
