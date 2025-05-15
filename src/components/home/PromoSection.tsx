
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
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-ttc-neutral-800">
              The Best Way to Find Qualified Tradesmen in Trinidad & Tobago
            </h2>
            
            <p className="text-ttc-neutral-700 mb-8">
              Whether you need a quick repair or a complete renovation, Trini Trade Connect helps you find the right professionals for any job. Our platform connects you with verified local tradesmen who can get your job done right.
            </p>
            
            <h3 className="text-xl font-semibold mb-4 text-ttc-neutral-800">
              For Clients:
            </h3>
            
            <ul className="space-y-3 mb-8">
              {benefitsForClients.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="text-ttc-green-500 mt-1 mr-3 flex-shrink-0" size={18} />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            
            <h3 className="text-xl font-semibold mb-4 text-ttc-neutral-800">
              For Professionals:
            </h3>
            
            <ul className="space-y-3">
              {benefitsForPros.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="text-ttc-blue-500 mt-1 mr-3 flex-shrink-0" size={18} />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-ttc-blue-50 p-8 rounded-lg">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-ttc-neutral-800 mb-2">
                Why Choose Trini Trade Connect?
              </h3>
              <p className="text-ttc-neutral-600">
                We're building Trinidad & Tobago's most trusted platform for home services.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded shadow-sm">
                <div className="text-4xl mb-2 text-ttc-blue-500">🔍</div>
                <h4 className="text-lg font-semibold mb-2 text-ttc-neutral-800">Verified Professionals</h4>
                <p className="text-sm text-ttc-neutral-600">
                  All tradesmen are verified and reviewed to ensure quality service.
                </p>
              </div>
              
              <div className="bg-white p-4 rounded shadow-sm">
                <div className="text-4xl mb-2 text-ttc-blue-500">💰</div>
                <h4 className="text-lg font-semibold mb-2 text-ttc-neutral-800">Transparent Pricing</h4>
                <p className="text-sm text-ttc-neutral-600">
                  Get clear quotes upfront with no hidden fees or surprises.
                </p>
              </div>
              
              <div className="bg-white p-4 rounded shadow-sm">
                <div className="text-4xl mb-2 text-ttc-blue-500">⭐</div>
                <h4 className="text-lg font-semibold mb-2 text-ttc-neutral-800">Quality Assurance</h4>
                <p className="text-sm text-ttc-neutral-600">
                  Our rating system helps maintain high service standards.
                </p>
              </div>
              
              <div className="bg-white p-4 rounded shadow-sm">
                <div className="text-4xl mb-2 text-ttc-blue-500">🔒</div>
                <h4 className="text-lg font-semibold mb-2 text-ttc-neutral-800">Secure Payments</h4>
                <p className="text-sm text-ttc-neutral-600">
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
