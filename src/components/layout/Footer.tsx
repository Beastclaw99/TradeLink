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
                <Link to="/project-marketplace" className="text-ttc-neutral-400 hover:text-white text-sm">
                  Project Marketplace
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="text-ttc-neutral-400 hover:text-white text-sm">
                  Professional Marketplace
                </Link>
              </li>
              <li>
                <Link to="/client/create-project" className="text-ttc-neutral-400 hover:text-white text-sm">
                  Post a Project
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-ttc-neutral-400 hover:text-white text-sm">
                  Resources
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-4">For Professionals</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/signup" className="text-ttc-neutral-400 hover:text-white text-sm">
                  Join as Professional
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="text-ttc-neutral-400 hover:text-white text-sm">
                  Find Projects
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-ttc-neutral-400 hover:text-white text-sm">
                  Professional Resources
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-ttc-neutral-400 hover:text-white text-sm">
                  About
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-ttc-neutral-400 hover:text-white text-sm">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-ttc-neutral-400 hover:text-white text-sm">
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-ttc-neutral-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-ttc-neutral-400 text-sm">
              © {new Date().getFullYear()} ProLinkTT. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-ttc-neutral-400 hover:text-white text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-ttc-neutral-400 hover:text-white text-sm">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
