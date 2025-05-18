import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"

interface AuthLinkProps {
  isMobile?: boolean;
}

const Navbar: React.FC = () => {
  const { user } = useAuth();

  return (
    <nav className="bg-white py-4 shadow-md">
      <div className="container-custom flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-ttc-blue-700">
          Talent Track Connect
        </Link>

        {user ? (
          <AuthenticatedLinks />
        ) : (
          <GuestLinks />
        )}

        <MobileNav user={user} />
      </div>
    </nav>
  );
};

const GuestLinks: React.FC = () => (
  <div className="hidden md:flex items-center gap-4">
    <NavLink to="/how-it-works">How It Works</NavLink>
    <NavLink to="/about">About</NavLink>
    <Button asChild variant="outline">
      <Link to="/login">Log In</Link>
    </Button>
    <Button asChild>
      <Link to="/signup">Sign Up</Link>
    </Button>
  </div>
);

const AuthenticatedLinks: React.FC<AuthLinkProps> = ({ isMobile = false }) => {
  const { user, signOut } = useAuth();
  
  return (
    <div className={`${isMobile ? '' : 'flex items-center gap-4'}`}>
      <NavLink to="/dashboard" className={isMobile ? 'block py-2' : ''}>Dashboard</NavLink>
      <NavLink to="/profile" className={isMobile ? 'block py-2' : ''}>Profile</NavLink>
      <Button 
        variant="outline" 
        className={`${isMobile ? 'mt-2 w-full justify-center' : ''}`}
        onClick={signOut}
      >
        Sign Out
      </Button>
    </div>
  );
};

const MobileNav: React.FC<{ user: any }> = ({ user }) => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden">
        <Menu />
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-3/4 md:w-1/2">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>
            Explore Talent Track Connect
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          {user ? (
            <AuthenticatedLinks isMobile={true} />
          ) : (
            <>
              <NavLink to="/how-it-works" className="block py-2">How It Works</NavLink>
              <NavLink to="/about" className="block py-2">About</NavLink>
              <Button asChild variant="outline" className="w-full">
                <Link to="/login" className="block py-2">Log In</Link>
              </Button>
              <Button asChild className="w-full">
                <Link to="/signup" className="block py-2">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Navbar;
