
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, User, Search } from 'lucide-react';

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
            <span className="text-2xl font-bold text-ttc-blue-500">Trini</span>
            <span className="text-2xl font-bold text-ttc-green-500">Trade</span>
            <span className="text-2xl font-bold text-ttc-neutral-700">Connect</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/find-pros" className="text-ttc-neutral-700 hover:text-ttc-blue-500 transition-colors">
            Find Pros
          </Link>
          <Link to="/post-job" className="text-ttc-neutral-700 hover:text-ttc-blue-500 transition-colors">
            Post a Job
          </Link>
          <Link to="/how-it-works" className="text-ttc-neutral-700 hover:text-ttc-blue-500 transition-colors">
            How It Works
          </Link>
          <Link to="/about" className="text-ttc-neutral-700 hover:text-ttc-blue-500 transition-colors">
            About
          </Link>
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/login">
            <Button variant="outline" size="sm" className="border-ttc-blue-500 text-ttc-blue-500 hover:bg-ttc-blue-50 hover:text-ttc-blue-600">
              Log In
            </Button>
          </Link>
          <Link to="/signup">
            <Button size="sm" className="bg-ttc-blue-500 text-white hover:bg-ttc-blue-600">
              Sign Up
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={toggleMenu}
            className="p-2 text-ttc-neutral-700 hover:text-ttc-blue-500 transition-colors"
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
                className="px-2 py-2 text-ttc-neutral-700 hover:bg-ttc-blue-50 hover:text-ttc-blue-500 rounded-md"
                onClick={toggleMenu}
              >
                Find Pros
              </Link>
              <Link 
                to="/post-job" 
                className="px-2 py-2 text-ttc-neutral-700 hover:bg-ttc-blue-50 hover:text-ttc-blue-500 rounded-md"
                onClick={toggleMenu}
              >
                Post a Job
              </Link>
              <Link 
                to="/how-it-works" 
                className="px-2 py-2 text-ttc-neutral-700 hover:bg-ttc-blue-50 hover:text-ttc-blue-500 rounded-md"
                onClick={toggleMenu}
              >
                How It Works
              </Link>
              <Link 
                to="/about" 
                className="px-2 py-2 text-ttc-neutral-700 hover:bg-ttc-blue-50 hover:text-ttc-blue-500 rounded-md"
                onClick={toggleMenu}
              >
                About
              </Link>
            </nav>

            <div className="pt-2 flex flex-col space-y-2 border-t border-gray-200">
              <Link 
                to="/login" 
                className="w-full py-2 text-center border border-ttc-blue-500 text-ttc-blue-500 rounded-md hover:bg-ttc-blue-50"
                onClick={toggleMenu}
              >
                Log In
              </Link>
              <Link 
                to="/signup" 
                className="w-full py-2 text-center bg-ttc-blue-500 text-white rounded-md hover:bg-ttc-blue-600"
                onClick={toggleMenu}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
