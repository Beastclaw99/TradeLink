import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-ttc-neutral-800 text-ttc-neutral-200">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold text-white">ProLinkTT</span>
              </Link>
            </div>
            <p className="text-ttc-neutral-400 text-sm mb-4">
              Connecting quality tradesmen with clients across Trinidad and Tobago.
              Find skilled professionals for your projects or grow your business.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-4">For Clients</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/project-marketplace" className="text-ttc-neutral-400 hover:text-white text-sm transition-colors">
                  Project Marketplace
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="text-ttc-neutral-400 hover:text-white text-sm transition-colors">
                  Professional Marketplace
                </Link>
              </li>
              <li>
                <Link to="/client/create-project" className="text-ttc-neutral-400 hover:text-white text-sm transition-colors">
                  Post a Project
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-ttc-neutral-400 hover:text-white text-sm transition-colors">
                  Resources
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-4">For Professionals</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/signup" className="text-ttc-neutral-400 hover:text-white text-sm transition-colors">
                  Join as Professional
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="text-ttc-neutral-400 hover:text-white text-sm transition-colors">
                  Find Projects
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-ttc-neutral-400 hover:text-white text-sm transition-colors">
                  Professional Resources
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-ttc-neutral-400 hover:text-white text-sm transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-ttc-neutral-400 hover:text-white text-sm transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-ttc-neutral-400 hover:text-white text-sm transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-ttc-neutral-700">
          <p className="text-ttc-neutral-400 text-sm text-center">
            © {new Date().getFullYear()} ProLinkTT. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
