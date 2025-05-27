
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import ProfessionalSidebar from '@/components/dashboard/ProfessionalSidebar';
import ClientSidebar from '@/components/dashboard/ClientSidebar';
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [accountType, setAccountType] = useState<string | null>(null);
  
  // Fetch user account type
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
  
  // Show sidebar only for logged-in users on relevant pages
  const showSidebar = user && (
    location.pathname === '/dashboard' ||
    location.pathname === '/insights' ||
    location.pathname === '/analytics' ||
    location.pathname === '/notifications' ||
    location.pathname === '/messages' ||
    location.pathname === '/calendar' ||
    location.pathname === '/settings' ||
    location.pathname === '/support' ||
    location.pathname === '/help' ||
    location.pathname === '/profile' ||
    location.pathname === '/network' ||
    location.pathname === '/invoices'
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      {showSidebar && accountType === 'professional' && <ProfessionalSidebar />}
      {showSidebar && accountType === 'client' && <ClientSidebar />}
    </div>
  );
};

export default Layout;
