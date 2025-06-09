import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Briefcase, 
  FileText, 
  DollarSign, 
  Star,
  Clock,
  CheckCircle
} from 'lucide-react';

interface StatCard {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
}

interface DashboardStatsProps {
  stats: {
    totalProjects?: number;
    activeProjects?: number;
    completedProjects?: number;
    totalApplications?: number;
    totalEarnings?: number;
    averageRating?: number;
  };
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const statCards: StatCard[] = [
    {
      title: 'Total Projects',
      value: stats.totalProjects || 0,
      icon: <Briefcase className="h-4 w-4 text-muted-foreground" />,
      description: 'All time projects'
    },
    {
      title: 'Active Projects',
      value: stats.activeProjects || 0,
      icon: <Clock className="h-4 w-4 text-muted-foreground" />,
      description: 'Currently in progress'
    },
    {
      title: 'Completed',
      value: stats.completedProjects || 0,
      icon: <CheckCircle className="h-4 w-4 text-muted-foreground" />,
      description: 'Successfully delivered'
    },
    {
      title: 'Applications',
      value: stats.totalApplications || 0,
      icon: <FileText className="h-4 w-4 text-muted-foreground" />,
      description: 'Total applications'
    },
    {
      title: 'Total Earnings',
      value: `$${stats.totalEarnings?.toLocaleString() || 0}`,
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
      description: 'All time earnings'
    },
    {
      title: 'Average Rating',
      value: stats.averageRating?.toFixed(1) || '0.0',
      icon: <Star className="h-4 w-4 text-muted-foreground" />,
      description: 'Client satisfaction'
    }
  ];

  return (
    <>
      {statCards.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            {stat.description && (
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </>
  );
}; 