import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

interface ProjectBudgetProps {
  budget: number;
}

export const ProjectBudget: React.FC<ProjectBudgetProps> = ({ budget }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium">Budget</h4>
            <p className="text-sm text-muted-foreground">
              {formatCurrency(budget)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 