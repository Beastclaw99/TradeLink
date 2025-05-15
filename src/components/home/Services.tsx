
import React from 'react';
import { Link } from 'react-router-dom';

// Service category data
const serviceCategories = [
  {
    id: 1,
    title: "Plumbing",
    description: "Professional plumbers for repairs, installations and maintenance.",
    icon: "🔧", // Using an emoji as placeholder, would be replaced with actual icons
    href: "/find-pros/plumbing",
  },
  {
    id: 2,
    title: "Electrical",
    description: "Licensed electricians for all your electrical needs.",
    icon: "⚡",
    href: "/find-pros/electrical",
  },
  {
    id: 3,
    title: "Carpentry",
    description: "Expert carpenters for custom woodwork and furniture.",
    icon: "🔨",
    href: "/find-pros/carpentry",
  },
  {
    id: 4,
    title: "Masonry",
    description: "Skilled masons for brickwork, concrete and stone projects.",
    icon: "🧱",
    href: "/find-pros/masonry",
  },
  {
    id: 5,
    title: "Painting",
    description: "Professional painters for interior and exterior painting.",
    icon: "🖌️",
    href: "/find-pros/painting",
  },
  {
    id: 6,
    title: "Landscaping",
    description: "Transform your outdoor space with our landscape experts.",
    icon: "🌱",
    href: "/find-pros/landscaping",
  },
  {
    id: 7,
    title: "Roofing",
    description: "Roofing professionals for repairs and installations.",
    icon: "🏠",
    href: "/find-pros/roofing",
  },
  {
    id: 8,
    title: "Air Conditioning",
    description: "HVAC technicians for installation and maintenance.",
    icon: "❄️",
    href: "/find-pros/air-conditioning",
  },
];

const Services: React.FC = () => {
  return (
    <section className="py-16 bg-ttc-neutral-100">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-ttc-neutral-800">
            Find Services You Need
          </h2>
          <p className="text-ttc-neutral-600">
            Browse through our popular service categories and find the perfect professional for your project needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {serviceCategories.map((category) => (
            <Link
              key={category.id}
              to={category.href}
              className="bg-white rounded-lg p-6 shadow-sm card-hover flex flex-col h-full"
            >
              <div className="text-3xl mb-4">{category.icon}</div>
              <h3 className="text-xl font-semibold text-ttc-neutral-800 mb-2">{category.title}</h3>
              <p className="text-ttc-neutral-600 text-sm flex-grow">{category.description}</p>
              <div className="mt-4 text-ttc-blue-500 font-medium text-sm flex items-center">
                Find pros
                <svg
                  className="ml-1 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <Link
            to="/find-pros"
            className="inline-block text-ttc-blue-500 hover:text-ttc-blue-700 font-semibold transition-colors"
          >
            View all service categories
            <svg
              className="ml-1 w-5 h-5 inline"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;
