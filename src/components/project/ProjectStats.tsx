
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  Users,
  FileText,
} from 'lucide-react';

interface ProjectStat {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    type: 'up' | 'down';
  };
  color?: string;
}

interface ProjectStatsProps {
  stats: ProjectStat[];
  className?: string;
}

const ProjectStats: React.FC<ProjectStatsProps> = ({ stats, className }) => {
  const defaultStats: ProjectStat[] = [
    {
      label: 'Total Budget',
      value: '$12,500',
      icon: <DollarSign className="h-4 w-4" />,
      trend: { value: 5.2, type: 'up' },
      color: 'text-green-600'
    },
    {
      label: 'Tasks Completed',
      value: '24/30',
      icon: <CheckCircle className="h-4 w-4" />,
      trend: { value: 8.1, type: 'up' },
      color: 'text-blue-600'
    },
    {
      label: 'Days Remaining',
      value: 12,
      icon: <Calendar className="h-4 w-4" />,
      trend: { value: 2.3, type: 'down' },
      color: 'text-orange-600'
    },
    {
      label: 'Active Hours',
      value: '142h',
      icon: <Clock className="h-4 w-4" />,
      trend: { value: 12.5, type: 'up' },
      color: 'text-purple-600'
    },
    {
      label: 'Team Members',
      value: 6,
      icon: <Users className="h-4 w-4" />,
      color: 'text-indigo-600'
    },
    {
      label: 'Documents',
      value: 23,
      icon: <FileText className="h-4 w-4" />,
      color: 'text-gray-600'
    }
  ];

  const displayStats = stats.length > 0 ? stats : defaultStats;

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className || ''}`}>
      {displayStats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`p-2 rounded-lg bg-gray-100 ${stat.color || 'text-gray-600'}`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
              {stat.trend && (
                <div className="flex items-center space-x-1">
                  {stat.trend.type === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <Badge
                    variant={stat.trend.type === 'up' ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {stat.trend.value}%
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProjectStats;
