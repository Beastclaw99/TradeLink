import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { Clock, CheckCircle, XCircle, Eye, DollarSign } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type Payment = Database['public']['Tables']['payments']['Row'];
type Project = Database['public']['Tables']['projects']['Row'];
type PaymentStatus = Database['public']['Enums']['payment_status'];

interface PaymentCardProps {
  payment: Payment;
  project?: Project;
  onViewDetails?: (payment: Payment) => void;
  onApprove?: (payment: Payment) => void;
  onReject?: (payment: Payment) => void;
  isProfessional?: boolean;
}

const PaymentCard: React.FC<PaymentCardProps> = ({
  payment,
  project,
  onViewDetails,
  onApprove,
  onReject,
  isProfessional = false
}) => {
  const getStatusBadge = (status: PaymentStatus | null) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      processing: { color: 'bg-blue-100 text-blue-800', icon: Clock },
      completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      failed: { color: 'bg-red-100 text-red-800', icon: XCircle },
      refunded: { color: 'bg-gray-100 text-gray-800', icon: XCircle },
      overdue: { color: 'bg-red-100 text-red-800', icon: XCircle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <Badge variant="outline" className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">
              {project?.title || 'Unknown Project'}
            </CardTitle>
            <CardDescription>
              Created on {payment.created_at ? format(new Date(payment.created_at), 'MMM d, yyyy') : 'Unknown date'}
            </CardDescription>
          </div>
          {getStatusBadge(payment.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span className="text-sm font-medium">
              Amount: ${payment.amount?.toLocaleString() || 'Not specified'} {payment.currency || 'USD'}
            </span>
          </div>
          
          {payment.metadata && (
            <div>
              <p className="text-sm font-medium mb-1">Details:</p>
              <p className="text-sm text-gray-600 line-clamp-3">
                {JSON.stringify(payment.metadata)}
              </p>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm text-gray-500">Payment ID: </span>
              <span className="font-medium">
                {payment.id}
              </span>
            </div>
            <div className="flex gap-2">
              {onViewDetails && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDetails(payment)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>
              )}
              {!isProfessional && payment.status === 'pending' && (
                <>
                  {onApprove && (
                    <Button
                      size="sm"
                      onClick={() => onApprove(payment)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Approve
                    </Button>
                  )}
                  {onReject && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onReject(payment)}
                    >
                      Reject
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentCard; 