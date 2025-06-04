
import React from 'react';
import { CheckCircle } from 'lucide-react';

const benefitsForClients = [
  "Find verified, skilled professionals quickly",
  "Compare quotes from multiple tradesmen",
  "Read authentic reviews from past clients",
  "Secure payment system through WiPay",
  "Track project progress from start to finish"
];

const benefitsForPros = [
  "Get connected with new clients in your area",
  "Build your online reputation with reviews",
  "Showcase your skills and portfolio",
  "Flexible job opportunities",
  "Get paid securely and on time"
];

const PromoSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 text-ttc-neutral-800 leading-tight">
              The Best Way to Find Qualified Tradesmen in Trinidad & Tobago
            </h2>
            
            <p className="text-lg sm:text-xl text-ttc-neutral-700 leading-relaxed">
              Whether you need a quick repair or a complete renovation, Trini Trade Connect helps you find the right professionals for any job. Our platform connects you with verified local tradesmen who can get your job done right.
            </p>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold mb-6 text-ttc-blue-600">
                  For Clients:
                </h3>
                
                <ul className="space-y-4">
                  {benefitsForClients.map((benefit, index) => (
                    <li key={index} className="flex items-start group">
                      <CheckCircle className="text-ttc-blue-500 mt-1 mr-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" size={22} />
                      <span className="text-lg leading-relaxed">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl sm:text-2xl font-bold mb-6 text-ttc-green-600">
                  For Professionals:
                </h3>
                
                <ul className="space-y-4">
                  {benefitsForPros.map((benefit, index) => (
                    <li key={index} className="flex items-start group">
                      <CheckCircle className="text-ttc-green-500 mt-1 mr-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" size={22} />
                      <span className="text-lg leading-relaxed">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-white to-gray-50 p-10 rounded-3xl shadow-2xl border border-gray-200">
            <div className="text-center mb-10">
              <h3 className="text-2xl sm:text-3xl font-bold text-ttc-neutral-800 mb-4">
                Why Choose Trini Trade Connect?
              </h3>
              <p className="text-lg text-ttc-neutral-600 leading-relaxed">
                We're building Trinidad & Tobago's most trusted platform for home services.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100">
                <div className="text-5xl mb-4 text-ttc-blue-500">🔍</div>
                <h4 className="text-lg font-bold mb-3 text-ttc-neutral-800">Verified Professionals</h4>
                <p className="text-ttc-neutral-600 leading-relaxed">
                  All tradesmen are verified and reviewed to ensure quality service.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100">
                <div className="text-5xl mb-4 text-ttc-blue-500">💰</div>
                <h4 className="text-lg font-bold mb-3 text-ttc-neutral-800">Transparent Pricing</h4>
                <p className="text-ttc-neutral-600 leading-relaxed">
                  Get clear quotes upfront with no hidden fees or surprises.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100">
                <div className="text-5xl mb-4 text-ttc-blue-500">⭐</div>
                <h4 className="text-lg font-bold mb-3 text-ttc-neutral-800">Quality Assurance</h4>
                <p className="text-ttc-neutral-600 leading-relaxed">
                  Our rating system helps maintain high service standards.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100">
                <div className="text-5xl mb-4 text-ttc-blue-500">🔒</div>
                <h4 className="text-lg font-bold mb-3 text-ttc-neutral-800">Secure Payments</h4>
                <p className="text-ttc-neutral-600 leading-relaxed">
                  WiPay integration for safe and convenient transactions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoSection;
