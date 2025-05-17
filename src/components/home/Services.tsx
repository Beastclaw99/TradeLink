
import React from 'react';
import { Link } from 'react-router-dom';

// Service category data
const serviceCategories = [{
  id: 1,
  title: "Carpentry",
  description: "Professional carpenters for custom woodwork and furniture.",
  image: "lovable-uploads/83edf7f3-bcae-47be-bd73-826afca8a7c3.jpg", // Carpentry image
  href: "/find-pros/carpentry"
}, {
  id: 2,
  title: "Electrical",
  description: "Licensed electricians for all your electrical needs.",
  image: "/lovable-uploads/8bbf4ce1-7690-4c37-9adf-b2751ac81a84.png", // Electrical image
  href: "/find-pros/electrical"
}, {
  id: 3,
  title: "Plumbing",
  description: "Expert plumbers for repairs, installations and maintenance.",
  image: "/lovable-uploads/bdca5a09-3b4b-4b3d-b094-5a9848a5ace0.jpg", // Plumbing image
  href: "/find-pros/plumbing"
}, {
  id: 4,
  title: "Painting",
  description: "Professional painters for interior and exterior painting.",
  image: "/lovable-uploads/b895389d-d481-4e54-9d12-e9e52e4af165.jpg", // Painting image
  href: "/find-pros/painting"
}, {
  id: 5,
  title: "Roofing",
  description: "Roofing professionals for repairs and installations.",
  image: "/lovable-uploads/93c3c189-5561-4881-a790-6565fbe4f664.jpg", // Roofing image
  href: "/find-pros/roofing"
}, {
  id: 6,
  title: "Landscaping",
  description: "Transform your outdoor space with our landscape experts.",
  image: "/lovable-uploads/848377f4-0205-491b-a416-42eea8acae4b.png", // Landscaping image
  href: "/find-pros/landscaping"
}, {
  id: 7,
  title: "Masonry",
  description: "Skilled masons for brickwork, concrete and stone projects.",
  image: "/lovable-uploads/83edf7f3-bcae-47be-bd73-826afca8a7c3.jpg", // Masonry image
  href: "/find-pros/masonry"
}, {
  id: 8,
  title: "Flooring",
  description: "Flooring specialists for installation and refinishing.",
  image: "/lovable-uploads/e9e54bb8-66ec-480c-9ca6-85914ac0e861.jpg", // Flooring image
  href: "/find-pros/flooring"
}];

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
          {serviceCategories.map(category => (
            <Link 
              key={category.id} 
              to={category.href} 
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col h-full overflow-hidden"
            >
              <div className="relative h-48 w-full">
                <img src={category.image} alt={category.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 flex items-end">
                  <h3 className="text-xl font-semibold text-white p-4">{category.title}</h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-ttc-neutral-600 text-sm">{category.description}</p>
                <div className="mt-4 text-ttc-blue-700 font-medium text-sm flex items-center">
                  Find professionals
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <Link to="/find-pros" className="inline-block text-ttc-blue-700 hover:text-ttc-blue-800 font-semibold transition-colors">
            View all service categories
            <svg className="ml-1 w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;
