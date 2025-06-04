import React from 'react';
import { StarRating } from '@/components/ui/star-rating';

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
                <StarRating
                  value={5}
                  onChange={() => {}}
                  className="mb-3"
                />
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
