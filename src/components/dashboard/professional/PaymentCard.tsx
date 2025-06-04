import { Payment } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PaymentCardProps {
  payment: Payment;
}

export const PaymentCard = ({ payment }: PaymentCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <span className="line-clamp-1">{payment.project?.title}</span>
          <Badge variant={
            payment.status === 'completed' ? 'default' :
            payment.status === 'failed' ? 'destructive' :
            'secondary'
          }>
            {payment.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm font-medium">
          Amount: ${payment.amount}
        </p>
        <p className="text-sm text-muted-foreground">
          Paid at: {payment.paid_at ? new Date(payment.paid_at).toLocaleDateString() : 'Pending'}
        </p>
      </CardContent>
    </Card>
  );
}; 