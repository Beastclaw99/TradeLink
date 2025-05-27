
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ProjectCompletionChart: React.FC = () => {
  // Mock data for demonstration
  const data = [
    { month: 'Jan', completed: 85, started: 92 },
    { month: 'Feb', completed: 78, started: 88 },
    { month: 'Mar', completed: 92, started: 95 },
    { month: 'Apr', completed: 88, started: 90 },
    { month: 'May', completed: 95, started: 98 },
    { month: 'Jun', completed: 89, started: 94 },
  ];

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis domain={[0, 100]} />
          <Tooltip 
            formatter={(value, name) => [
              `${value}%`, 
              name === 'completed' ? 'Completion Rate' : 'Projects Started'
            ]}
          />
          <Line 
            type="monotone" 
            dataKey="completed" 
            stroke="#10b981" 
            strokeWidth={2}
            name="completed"
          />
          <Line 
            type="monotone" 
            dataKey="started" 
            stroke="#3b82f6" 
            strokeWidth={2}
            name="started"
          />
        </LineChart>
      </ResponsiveContainer>
      
      <div className="flex justify-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Completion Rate</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span>Projects Started</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCompletionChart;
