
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Service category data
const serviceCategories = [{
  id: 1,
  title: "Carpentry",
  description: "Professional carpenters for custom woodwork and furniture.",
  image: "lovable-uploads/carpenter-working.jpg",
  href: "/find-pros/carpentry"
}, {
  id: 2,
  title: "Electrical",
  description: "Licensed electricians for all your electrical needs.",
  image: "/lovable-uploads/electrical.jpg",
  href: "/find-pros/electrical"
}, {
  id: 3,
  title: "Plumbing",
  description: "Expert plumbers for repairs, installations and maintenance.",
  image: "/lovable-uploads/plumbing.jpg",
  href: "/find-pros/plumbing"
}, {
  id: 4,
  title: "Painting",
  description: "Professional painters for interior and exterior painting.",
  image: "/lovable-uploads/painting.jpg",
  href: "/find-pros/painting"
}, {
  id: 5,
  title: "Roofing",
  description: "Roofing professionals for repairs and installations.",
  image: "/lovable-uploads/roofing.jpg",
  href: "/find-pros/roofing"
}, {
  id: 6,
  title: "Landscaping",
  description: "Transform your outdoor space with our landscape experts.",
  image: "/lovable-uploads/landscaping.jpg",
  href: "/find-pros/landscaping"
}, {
  id: 7,
  title: "Masonry",
  description: "Skilled masons for brickwork, concrete and stone projects.",
  image: "/lovable-uploads/masonry.jpg",
  href: "/find-pros/masonry"
}, {
  id: 8,
  title: "Flooring",
  description: "Flooring specialists for installation and refinishing.",
  image: "/lovable-uploads/flooring.jpg",
  href: "/find-pros/flooring"
}];

const Services: React.FC = () => {
  // State to track which images have been loaded
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  
  // For SSR/hydration consistency
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    
    // Preload images for better performance
    serviceCategories.forEach(category => {
      const img = new Image();
      img.src = category.image;
      img.onload = () => {
        setLoadedImages(prev => ({
          ...prev,
          [category.id]: true
        }));
      };
    });
  }, []);
  
  // If not client-side yet, don't render images to prevent hydration mismatch
  if (!isClient) {
    return <div className="py-16 bg-ttc-neutral-100">Loading services...</div>;
  }

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
              <div className="relative h-40 sm:h-44 md:h-48 w-full bg-ttc-neutral-200">
                {/* Image with loading placeholder */}
                <div className={`absolute inset-0 transition-opacity duration-300 ${loadedImages[category.id] ? 'opacity-100' : 'opacity-0'}`}>
                  <img 
                    src={category.image} 
                    alt={category.title} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                    width="400"
                    height="300"
                  />
                </div>
                <div className={`absolute inset-0 bg-ttc-neutral-200 transition-opacity duration-300 ${loadedImages[category.id] ? 'opacity-0' : 'opacity-100'}`}>
                  <div className="flex items-center justify-center h-full">
                    <div className="w-8 h-8 border-4 border-ttc-blue-300 border-t-ttc-blue-600 rounded-full animate-spin"></div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 flex items-end">
                  <h3 className="text-lg sm:text-xl font-semibold text-white p-4">{category.title}</h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-xs sm:text-sm text-ttc-neutral-600">{category.description}</p>
                <div className="mt-3 sm:mt-4 text-ttc-blue-700 font-medium text-sm flex items-center">
                  Find professionals
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-8 sm:mt-10 text-center">
          <Link to="/find-pros" className="inline-block text-ttc-blue-700 hover:text-ttc-blue-800 font-semibold transition-colors">
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
