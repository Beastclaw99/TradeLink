
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const BudgetSummaryChart: React.FC = () => {
  // Mock data for demonstration
  const data = [
    { name: 'Plumbing', value: 45000, projects: 32 },
    { name: 'Electrical', value: 38000, projects: 28 },
    { name: 'Carpentry', value: 35000, projects: 45 },
    { name: 'Painting', value: 22000, projects: 38 },
    { name: 'Landscaping', value: 28000, projects: 25 },
    { name: 'Other', value: 15000, projects: 18 },
  ];

  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-md">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-blue-600">
            Revenue: TTD {data.value.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">
            Projects: {data.projects}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => 
              percent > 10 ? `${name} ${(percent * 100).toFixed(0)}%` : ''
            }
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            ></div>
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetSummaryChart;
