
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Eye, 
  MessageSquare,
  TrendingUp,
  Calendar
} from "lucide-react";
import { Application } from '../../types';

interface ApplicationStatusTrackerProps {
  applications: Application[];
  onViewApplication: (application: Application) => void;
  onWithdrawApplication?: (application: Application) => void;
}

const ApplicationStatusTracker: React.FC<ApplicationStatusTrackerProps> = ({
  applications,
  onViewApplication,
  onWithdrawApplication
}) => {
  const getStatusConfig = (status: string) => {
    const configs = {
      pending: {
        icon: Clock,
        color: 'text-yellow-600',
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        badge: 'bg-yellow-100 text-yellow-800',
        title: 'Under Review',
        description: 'Your application is being reviewed by the client'
      },
      accepted: {
        icon: CheckCircle2,
        color: 'text-green-600',
        bg: 'bg-green-50',
        border: 'border-green-200',
        badge: 'bg-green-100 text-green-800',
        title: 'Accepted',
        description: 'Congratulations! Your application was accepted'
      },
      rejected: {
        icon: XCircle,
        color: 'text-red-600',
        bg: 'bg-red-50',
        border: 'border-red-200',
        badge: 'bg-red-100 text-red-800',
        title: 'Not Selected',
        description: 'Your application was not selected for this project'
      },
      withdrawn: {
        icon: AlertCircle,
        color: 'text-gray-600',
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        badge: 'bg-gray-100 text-gray-800',
        title: 'Withdrawn',
        description: 'You withdrew your application'
      }
    };
    
    return configs[status as keyof typeof configs] || configs.pending;
  };

  const getStatusPriority = (status: string) => {
    const priorities = { accepted: 1, pending: 2, rejected: 3, withdrawn: 4 };
    return priorities[status as keyof typeof priorities] || 5;
  };

  const sortedApplications = [...applications].sort((a, b) => {
    const priorityDiff = getStatusPriority(a.status) - getStatusPriority(b.status);
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const pendingCount = applications.filter(app => app.status === 'pending').length;
  const acceptedCount = applications.filter(app => app.status === 'accepted').length;

  if (applications.length === 0) {
    return (
      <Card className="text-center py-8">
        <CardContent>
          <TrendingUp className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Applications Yet</h3>
          <p className="text-gray-500 mb-4">Start applying to projects to track your progress here</p>
          <Button variant="outline">Browse Projects</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Applications</p>
                <p className="text-2xl font-bold text-blue-700">{applications.length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-700">{pendingCount}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Accepted</p>
                <p className="text-2xl font-bold text-green-700">{acceptedCount}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applications List */}
      <div className="space-y-3">
        {sortedApplications.map(application => {
          const config = getStatusConfig(application.status);
          const Icon = config.icon;
          
          return (
            <Card key={application.id} className={`${config.bg} ${config.border} border-l-4`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className={`h-5 w-5 ${config.color}`} />
                      <h3 className="font-semibold text-gray-900">
                        {application.project?.title || 'Unknown Project'}
                      </h3>
                      <Badge variant="outline" className={config.badge}>
                        {config.title}
                      </Badge>
                    </div>
                    
                    <p className={`text-sm ${config.color} mb-2`}>
                      {config.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Applied {new Date(application.created_at).toLocaleDateString()}</span>
                      </div>
                      {application.bid_amount && (
                        <div className="flex items-center gap-1">
                          <span>Bid: ${application.bid_amount.toLocaleString()}</span>
                        </div>
                      )}
                      {application.project?.budget && (
                        <div className="flex items-center gap-1">
                          <span>Budget: ${application.project.budget.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewApplication(application)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    
                    {application.status === 'pending' && onWithdrawApplication && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => onWithdrawApplication(application)}
                      >
                        Withdraw
                      </Button>
                    )}
                    
                    {application.status === 'accepted' && (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Message Client
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ApplicationStatusTracker;
