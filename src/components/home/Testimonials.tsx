
import React from 'react';

const testimonials = [
  {
    id: 1,
    quote: "I found an excellent plumber through Trini Trade Connect who fixed my leaking pipes quickly and at a fair price. The platform was easy to use and I'll definitely use it again.",
    name: "Michelle R.",
    location: "Port of Spain",
    role: "Homeowner",
    image: "https://i.pravatar.cc/100?img=5" // Placeholder image
  },
  {
    id: 2,
    quote: "As an electrician, joining Trini Trade Connect has helped me grow my business significantly. The platform connects me with clients I wouldn't have found otherwise.",
    name: "David J.",
    location: "San Fernando", 
    role: "Electrician",
    image: "https://i.pravatar.cc/100?img=12" // Placeholder image
  },
  {
    id: 3,
    quote: "I've used Trini Trade Connect for multiple home renovation projects. Being able to compare quotes and reviews made it easy to find quality professionals.",
    name: "Sarah T.",
    location: "Arima",
    role: "Homeowner",
    image: "https://i.pravatar.cc/100?img=9" // Placeholder image
  }
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-16 bg-ttc-neutral-50">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-ttc-neutral-800">
            What Our Users Say
          </h2>
          <p className="text-ttc-neutral-600">
            Don't just take our word for it. Here's what clients and professionals are saying about Trini Trade Connect.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-lg p-6 shadow-sm flex flex-col"
            >
              <div className="mb-6">
                {/* Star rating */}
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                
                <p className="text-ttc-neutral-600 italic">"{testimonial.quote}"</p>
              </div>
              
              <div className="mt-auto flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <h4 className="font-semibold text-ttc-neutral-800">{testimonial.name}</h4>
                  <p className="text-sm text-ttc-neutral-500">{testimonial.role}, {testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
