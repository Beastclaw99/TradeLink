
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from "@/components/ui/toaster";
import './App.css';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PostJob from './pages/PostJob';
import About from './pages/About';
import HowItWorks from './pages/HowItWorks';
import FindPros from './pages/FindPros';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ProjectMarketplace from './pages/ProjectMarketplace';
import ProjectDetails from './pages/ProjectDetails';
import JoinNetwork from './pages/JoinNetwork';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/about" element={<About />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/find-pros" element={<FindPros />} />
            <Route path="/join-network" element={<JoinNetwork />} />
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/marketplace" element={<ProjectMarketplace />} />
            <Route path="/projects/:projectId" element={<ProjectDetails />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
