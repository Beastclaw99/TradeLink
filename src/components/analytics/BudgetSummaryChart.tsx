
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const BudgetSummaryChart: React.FC = () => {
  const data = [
    { name: 'Construction', value: 45000, color: '#0088FE' },
    { name: 'Landscaping', value: 28000, color: '#00C49F' },
    { name: 'Electrical', value: 22000, color: '#FFBB28' },
    { name: 'Plumbing', value: 18000, color: '#FF8042' },
    { name: 'Other', value: 12000, color: '#8884D8' },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`TTD ${value}`, 'Budget']} />
        </PieChart>
      </ResponsiveContainer>
      
      <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: COLORS[index] }}
            ></div>
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetSummaryChart;
