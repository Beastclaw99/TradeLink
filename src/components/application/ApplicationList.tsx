import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle,
  DollarSign,
  MessageSquare
} from 'lucide-react';

interface Application {
  id: string;
  project: {
    id: string;
    title: string;
    budget: number;
  };
  status: 'pending' | 'accepted' | 'rejected';
  cover_letter: string;
  bid_amount: number;
  created_at: string;
  professional?: {
    name: string;
    avatar_url?: string;
  };
  client?: {
    name: string;
    avatar_url?: string;
  };
}

interface ApplicationListProps {
  applications: Application[];
  onApplicationUpdate?: () => void;
}

export const ApplicationList: React.FC<ApplicationListProps> = ({
  applications,
  onApplicationUpdate
}) => {
  const getStatusBadge = (status: Application['status']) => {
    const statusConfig = {
      pending: {
        label: 'Pending',
        icon: <Clock className="h-4 w-4" />,
        variant: 'secondary' as const
      },
      accepted: {
        label: 'Accepted',
        icon: <CheckCircle className="h-4 w-4" />,
        variant: 'default' as const
      },
      rejected: {
        label: 'Rejected',
        icon: <XCircle className="h-4 w-4" />,
        variant: 'destructive' as const
      }
    };

    const config = statusConfig[status];
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      {applications.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No applications found</p>
          </CardContent>
        </Card>
      ) : (
        applications.map((application) => (
          <Card key={application.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold">
                {application.project.title}
              </CardTitle>
              {getStatusBadge(application.status)}
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                {application.cover_letter}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>Bid: ${application.bid_amount.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>Budget: ${application.project.budget.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span>Applied {formatDistanceToNow(new Date(application.created_at), { addSuffix: true })}</span>
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = `/projects/${application.project.id}`}
                >
                  View Project
                </Button>
                {application.status === 'pending' && (
                  <Button
                    size="sm"
                    onClick={() => window.location.href = `/applications/${application.id}`}
                  >
                    Review Application
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}; 