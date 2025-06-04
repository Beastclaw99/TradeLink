
import React, { useState } from 'react';
import { useProfessionalDashboard } from '@/hooks/useProfessionalDashboard';
import ProfessionalSidebar from './ProfessionalSidebar';

interface ProfessionalDashboardProps {
  userId: string;
}

const ProfessionalDashboard: React.FC<ProfessionalDashboardProps> = ({ userId }) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const dashboardData = useProfessionalDashboard(userId);

  const handleSidebarExpand = (expanded: boolean) => {
    setSidebarExpanded(expanded);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <ProfessionalSidebar 
          {...dashboardData}
          onExpand={handleSidebarExpand}
        />
        <div className={`flex-1 transition-all duration-300 ${sidebarExpanded ? 'mr-64' : 'mr-16'}`}>
          {/* Main dashboard content will go here */}
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900">Professional Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome to your professional dashboard</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;
