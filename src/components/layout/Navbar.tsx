
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, Briefcase } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-custom flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <Briefcase className="h-6 w-6 text-ttc-blue-700 mr-2" />
            <span className="text-2xl font-bold text-ttc-blue-700">Trade</span>
            <span className="text-2xl font-bold text-ttc-neutral-700">Link</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/find-pros" className="text-ttc-neutral-700 hover:text-ttc-blue-700 transition-colors">
            Find Tradesmen
          </Link>
          <Link to="/project-marketplace" className="text-ttc-neutral-700 hover:text-ttc-blue-700 transition-colors">
            Project Marketplace
          </Link>
          <Link to="/how-it-works" className="text-ttc-neutral-700 hover:text-ttc-blue-700 transition-colors">
            How It Works
          </Link>
          <Link to="/about" className="text-ttc-neutral-700 hover:text-ttc-blue-700 transition-colors">
            About
          </Link>
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/login">
            <Button variant="outline" size="sm" className="border-ttc-blue-700 text-ttc-blue-700 hover:bg-ttc-blue-50 hover:text-ttc-blue-700">
              Login
            </Button>
          </Link>
          <Link to="/signup">
            <Button size="sm" className="bg-ttc-blue-700 text-white hover:bg-ttc-blue-800">
              Register
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={toggleMenu}
            className="p-2 text-ttc-neutral-700 hover:text-ttc-blue-700 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b">
          <div className="container-custom py-4 space-y-4">
            <nav className="flex flex-col space-y-3">
              <Link 
                to="/find-pros" 
                className="px-2 py-2 text-ttc-neutral-700 hover:bg-ttc-blue-50 hover:text-ttc-blue-700 rounded-md"
                onClick={toggleMenu}
              >
                Find Tradesmen
              </Link>
              <Link 
                to="/project-marketplace" 
                className="px-2 py-2 text-ttc-neutral-700 hover:bg-ttc-blue-50 hover:text-ttc-blue-700 rounded-md"
                onClick={toggleMenu}
              >
                Project Marketplace
              </Link>
              <Link 
                to="/how-it-works" 
                className="px-2 py-2 text-ttc-neutral-700 hover:bg-ttc-blue-50 hover:text-ttc-blue-700 rounded-md"
                onClick={toggleMenu}
              >
                How It Works
              </Link>
              <Link 
                to="/about" 
                className="px-2 py-2 text-ttc-neutral-700 hover:bg-ttc-blue-50 hover:text-ttc-blue-700 rounded-md"
                onClick={toggleMenu}
              >
                About
              </Link>
            </nav>

            <div className="pt-2 flex flex-col space-y-2 border-t border-gray-200">
              <Link 
                to="/login" 
                className="w-full py-2 text-center border border-ttc-blue-700 text-ttc-blue-700 rounded-md hover:bg-ttc-blue-50"
                onClick={toggleMenu}
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="w-full py-2 text-center bg-ttc-blue-700 text-white rounded-md hover:bg-ttc-blue-800"
                onClick={toggleMenu}
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
