import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster"

// Import pages
import Index from '@/pages/Index';
import About from '@/pages/About';
import HowItWorks from '@/pages/HowItWorks';
import JoinNetwork from '@/pages/JoinNetwork';
import FindPros from '@/pages/FindPros';
import PostJob from '@/pages/PostJob';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import ProjectMarketplace from '@/pages/ProjectMarketplace';
import Dashboard from '@/pages/Dashboard';
import ProjectDetails from '@/pages/ProjectDetails';
import NotFound from '@/pages/NotFound';
import Profile from '@/pages/Profile';

// Import contexts
import { AuthProvider } from '@/contexts/AuthContext';

function App() {
  return (
    <BrowserRouter>
      {/* Toast Provider */}
      <Toaster />
      
      {/* Auth Provider */}
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/join-network" element={<JoinNetwork />} />
          <Route path="/find-pros" element={<FindPros />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/marketplace" element={<ProjectMarketplace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/project/:id" element={<ProjectDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
