import React, { useState, useEffect } from 'react';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import NotificationBell from '@/components/shared/NotificationBell';
import { supabase } from '@/integrations/supabase/client';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [accountType, setAccountType] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccountType = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('account_type')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        setAccountType(data.account_type);
      } catch (error) {
        console.error('Error fetching account type:', error);
      }
    };

    fetchAccountType();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="border-b">
      <div className="container-custom h-16 flex items-center justify-between">
        <Link to="/" className="mr-4 flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 0 0 3-3H6a3 3 0 0 0 3 3V6a3 3 0 0 0-3 3h12a3 3 0 0 0-3-3Z" />
          </svg>
          <span className="font-bold">ProLinkTT</span>
        </Link>
        <NavigationMenu>
          <NavigationMenuList className="space-x-6">
            <NavigationMenuItem>
              <NavigationMenuLink>
                <Link to="/marketplace" className="text-sm font-medium leading-none text-ttc-blue-700 hover:text-ttc-blue-800 focus:text-ttc-blue-800 transition-colors">
                  Professional Marketplace
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink>
                <Link to="/project-marketplace" className="text-sm font-medium leading-none text-ttc-blue-700 hover:text-ttc-blue-800 focus:text-ttc-blue-800 transition-colors">
                  Project Marketplace
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            {user && (
              <NavigationMenuItem>
                <NavigationMenuLink>
                  <Link to="/dashboard" className="text-sm font-medium leading-none text-ttc-blue-700 hover:text-ttc-blue-800 focus:text-ttc-blue-800 transition-colors">
                    {accountType === 'professional' ? 'Professional Dashboard' : 'Client Dashboard'}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
            <NavigationMenuItem>
              <NavigationMenuLink>
                <Link to="/resources" className="text-sm font-medium leading-none text-ttc-blue-700 hover:text-ttc-blue-800 focus:text-ttc-blue-800 transition-colors">
                  Resources
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        {user ? (
          <div className="flex items-center space-x-4">
            <NotificationBell />
            <Link to="/dashboard">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Link>
            <Button size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">Sign Up</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
