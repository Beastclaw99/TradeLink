
import React from 'react';
import Layout from '@/components/layout/Layout';
import ProjectCalendar from '@/components/calendar/ProjectCalendar';

const CalendarPage: React.FC = () => {
  return (
    <Layout>
      <div className="bg-gray-50 py-8">
        <div className="container-custom">
          <h1 className="text-3xl font-bold mb-2">Project Calendar</h1>
          <p className="text-gray-600 mb-8">
            Schedule and track your projects, tasks, and appointments with ProLinkTT
          </p>
          
          <ProjectCalendar />
        </div>
      </div>
    </Layout>
  );
};

export default CalendarPage;
