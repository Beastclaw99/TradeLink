
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProjectCompletionChart from './ProjectCompletionChart';
import ProfessionalPerformanceTable from './ProfessionalPerformanceTable';
import BudgetSummaryChart from './BudgetSummaryChart';
import { TrendingUp, Users, DollarSign, CheckCircle } from 'lucide-react';

const AnalyticsDashboard: React.FC = () => {
  // Mock summary data
  const summaryStats = [
    {
      title: 'Total Projects',
      value: '247',
      change: '+12%',
      trend: 'up',
      icon: CheckCircle
    },
    {
      title: 'Active Professionals',
      value: '89',
      change: '+8%',
      trend: 'up',
      icon: Users
    },
    {
      title: 'Total Revenue',
      value: 'TTD 245K',
      change: '+15%',
      trend: 'up',
      icon: DollarSign
    },
    {
      title: 'Completion Rate',
      value: '94%',
      change: '+2%',
      trend: 'up',
      icon: TrendingUp
    }
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <IconComponent className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Project Completion Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Project Completion Rates</CardTitle>
            <p className="text-sm text-gray-600">
              Monthly project completion trends
            </p>
          </CardHeader>
          <CardContent>
            <ProjectCompletionChart />
          </CardContent>
        </Card>

        {/* Budget Summary Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Analysis</CardTitle>
            <p className="text-sm text-gray-600">
              Revenue by project category
            </p>
          </CardHeader>
          <CardContent>
            <BudgetSummaryChart />
          </CardContent>
        </Card>
      </div>

      {/* Professional Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Professional Performance</CardTitle>
          <p className="text-sm text-gray-600">
            Top performing professionals by rating and project completion
          </p>
        </CardHeader>
        <CardContent>
          <ProfessionalPerformanceTable />
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
