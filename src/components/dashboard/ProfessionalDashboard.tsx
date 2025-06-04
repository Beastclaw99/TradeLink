
import React from 'react';
import { useProfessionalDashboard } from '@/hooks/useProfessionalDashboard';
import ProfessionalSidebar from './ProfessionalSidebar';

interface ProfessionalDashboardProps {
  userId: string;
}

const ProfessionalDashboard: React.FC<ProfessionalDashboardProps> = ({ userId }) => {
  const dashboardData = useProfessionalDashboard(userId);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <ProfessionalSidebar {...dashboardData} />
      </div>
    </div>
  );
};

export default ProfessionalDashboard;
