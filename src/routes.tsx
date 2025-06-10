import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProfessionalMarketplace from './pages/ProfessionalMarketplace';
import ProjectDetails from './pages/ProjectDetails';
import CalendarPage from './pages/CalendarPage';
import MessagingPage from './pages/MessagingPage';
import AnalyticsPage from './pages/AnalyticsPage';
import CompliancePage from './pages/CompliancePage';
import CreateProject from '@/pages/CreateProject';
import ProjectDispatch from '@/pages/ProjectDispatch';
import ProjectMarketplace from '@/pages/ProjectMarketplace';
import ProjectApplications from '@/pages/ProjectApplications';
import Resources from './pages/Resources';
import Insights from './pages/Insights';
import Notifications from './pages/Notifications';
import Support from './pages/Support';
import Help from './pages/Help';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Network from './pages/Network';
import Invoices from './pages/Invoices';
import Settings from './pages/Settings';
import Onboarding from './pages/Onboarding';

const AppRoutes = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/marketplace" element={<ProfessionalMarketplace />} />
        <Route path="/project-marketplace" element={<ProjectMarketplace />} />
        <Route path="/projects/:projectId" element={<ProjectDetails />} />
        <Route path="/client/projects/:projectId/applications" element={<ProjectApplications />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/messages" element={<MessagingPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/compliance" element={<CompliancePage />} />
        <Route path="/client/create-project" element={<CreateProject />} />
        <Route path="/client/dispatch/:projectId" element={<ProjectDispatch />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/support" element={<Support />} />
        <Route path="/help" element={<Help />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/network" element={<Network />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  );
};

export default AppRoutes; 