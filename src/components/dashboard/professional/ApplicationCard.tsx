import { Application } from '../types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from '@/utils/dateUtils';
import { formatCurrency } from '@/utils/currencyUtils';

interface ApplicationCardProps {
  application: Application;
  onApplicationUpdate: (applicationId: string, status: string) => void;
}

export const ApplicationCard = ({ application, onApplicationUpdate }: ApplicationCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <div>
            <span className="line-clamp-1">{application.project?.title}</span>
            <p className="text-sm text-muted-foreground">
              Applied on {formatDate(application.created_at)}
            </p>
          </div>
          <Badge variant={
            application.status === 'accepted' ? 'default' :
            application.status === 'rejected' ? 'destructive' :
            'secondary'
          }>
            {application.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Cover Letter</h4>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {application.cover_letter}
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Proposal</h4>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {application.proposal_message}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium">Bid Amount:</span>
              <p className="text-sm">{formatCurrency(application.bid_amount)}</p>
            </div>
            <div>
              <span className="text-sm font-medium">Availability:</span>
              <p className="text-sm">{application.availability || 'Not specified'}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        {application.status === 'pending' && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onApplicationUpdate(application.id, 'rejected')}
            >
              Reject
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => onApplicationUpdate(application.id, 'accepted')}
            >
              Accept
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}; 