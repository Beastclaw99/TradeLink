
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectsTab from './client/ProjectsTab';
import ApplicationsTab from './client/ApplicationsTab';
import PaymentsTab from './client/PaymentsTab';
import ProfileTab from './client/ProfileTab';
import CreateProjectTab from './client/CreateProjectTab';
import { useClientDashboard } from '@/hooks/useClientDashboard';

export const ClientDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('projects');
  
  const {
    projects,
    applications,
    payments,
    reviews,
    isLoading,
    error,
    fetchDashboardData
  } = useClientDashboard(user?.id || '');

  if (!user) {
    return <div>Please log in to access your dashboard.</div>;
  }

  if (error) {
    return <div>Error loading dashboard: {error.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Client Dashboard</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="create">Create Project</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>
        
        <TabsContent value="projects" className="mt-6">
          <ProjectsTab 
            projects={projects}
            isLoading={isLoading}
            onUpdate={fetchDashboardData}
          />
        </TabsContent>
        
        <TabsContent value="applications" className="mt-6">
          <ApplicationsTab 
            applications={applications}
            projects={projects}
            isLoading={isLoading}
            onUpdate={fetchDashboardData}
          />
        </TabsContent>
        
        <TabsContent value="payments" className="mt-6">
          <PaymentsTab 
            payments={payments}
            isLoading={isLoading}
          />
        </TabsContent>
        
        <TabsContent value="create" className="mt-6">
          <CreateProjectTab onProjectCreated={fetchDashboardData} />
        </TabsContent>
        
        <TabsContent value="profile" className="mt-6">
          <ProfileTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientDashboard;
