import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Clock,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';

interface ProjectStatsProps {
  project: any;
}

const ProjectStats: React.FC<ProjectStatsProps> = ({ project }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Project Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Status */}
          <Card>
            <CardContent className="flex items-center space-x-4">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              <div>
                <p className="text-sm font-medium">Status</p>
                <Badge variant="secondary">{project.status}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Start Date */}
          <Card>
            <CardContent className="flex items-center space-x-4">
              <Calendar className="h-6 w-6 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Start Date</p>
                <p className="text-sm text-gray-600">{new Date(project.startDate).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>

          {/* Due Date */}
          <Card>
            <CardContent className="flex items-center space-x-4">
              <Clock className="h-6 w-6 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Due Date</p>
                <p className="text-sm text-gray-600">{new Date(project.dueDate).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>

          {/* Budget */}
          <Card>
            <CardContent className="flex items-center space-x-4">
              <DollarSign className="h-6 w-6 text-green-500" />
              <div>
                <p className="text-sm font-medium">Budget</p>
                <p className="text-sm text-gray-600">${project.budget}</p>
              </div>
            </CardContent>
          </Card>

          {/* Overdue */}
          {project.isOverdue && (
            <Card>
              <CardContent className="flex items-center space-x-4">
                <AlertTriangle className="h-6 w-6 text-red-500" />
                <div>
                  <p className="text-sm font-medium">Overdue</p>
                  <p className="text-sm text-gray-600">This project is overdue.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectStats;
