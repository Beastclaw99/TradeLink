
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, TrendingUp, TrendingDown } from 'lucide-react';

interface Professional {
  id: string;
  name: string;
  avatar?: string;
  specialty: string;
  rating: number;
  projectsCompleted: number;
  onTimeRate: number;
  revenue: number;
  trend: 'up' | 'down' | 'stable';
}

const ProfessionalPerformanceTable: React.FC = () => {
  // Mock data for demonstration
  const professionals: Professional[] = [
    {
      id: '1',
      name: 'John Smith',
      avatar: '/placeholder.svg',
      specialty: 'Plumbing',
      rating: 4.9,
      projectsCompleted: 47,
      onTimeRate: 96,
      revenue: 85000,
      trend: 'up'
    },
    {
      id: '2',
      name: 'Maria Rodriguez',
      avatar: '/placeholder.svg',
      specialty: 'Electrical',
      rating: 4.8,
      projectsCompleted: 39,
      onTimeRate: 94,
      revenue: 72000,
      trend: 'up'
    },
    {
      id: '3',
      name: 'David Williams',
      avatar: '/placeholder.svg',
      specialty: 'Carpentry',
      rating: 4.7,
      projectsCompleted: 52,
      onTimeRate: 88,
      revenue: 68000,
      trend: 'stable'
    },
    {
      id: '4',
      name: 'Sarah Johnson',
      avatar: '/placeholder.svg',
      specialty: 'Painting',
      rating: 4.6,
      projectsCompleted: 34,
      onTimeRate: 91,
      revenue: 45000,
      trend: 'down'
    },
    {
      id: '5',
      name: 'Michael Brown',
      avatar: '/placeholder.svg',
      specialty: 'Landscaping',
      rating: 4.8,
      projectsCompleted: 28,
      onTimeRate: 93,
      revenue: 52000,
      trend: 'up'
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getOnTimeRateBadge = (rate: number) => {
    if (rate >= 95) return 'bg-green-100 text-green-800';
    if (rate >= 90) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Professional</TableHead>
            <TableHead>Specialty</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Projects</TableHead>
            <TableHead>On-Time Rate</TableHead>
            <TableHead>Revenue (TTD)</TableHead>
            <TableHead>Trend</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {professionals.map((professional) => (
            <TableRow key={professional.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={professional.avatar} />
                    <AvatarFallback>
                      {professional.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{professional.name}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{professional.specialty}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{professional.rating}</span>
                </div>
              </TableCell>
              <TableCell className="font-medium">
                {professional.projectsCompleted}
              </TableCell>
              <TableCell>
                <Badge className={getOnTimeRateBadge(professional.onTimeRate)}>
                  {professional.onTimeRate}%
                </Badge>
              </TableCell>
              <TableCell className="font-medium">
                {professional.revenue.toLocaleString()}
              </TableCell>
              <TableCell>
                {getTrendIcon(professional.trend)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProfessionalPerformanceTable;
