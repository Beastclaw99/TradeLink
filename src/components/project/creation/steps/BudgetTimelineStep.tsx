import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, Clock, AlertCircle } from 'lucide-react';
import { ProjectData } from '../types';

interface BudgetTimelineStepProps {
  data: ProjectData;
  onUpdate: (data: Partial<ProjectData>) => void;
}

const TIMELINE_OPTIONS = [
  { value: 'less_than_1_month', label: 'Less than 1 month' },
  { value: '1_to_3_months', label: '1-3 months' },
  { value: '3_to_6_months', label: '3-6 months' },
  { value: 'more_than_6_months', label: 'More than 6 months' }
];

const URGENCY_OPTIONS = [
  { value: 'low', label: 'Low - Flexible timeline' },
  { value: 'medium', label: 'Medium - Standard timeline' },
  { value: 'high', label: 'High - Urgent completion needed' }
];

const BudgetTimelineStep: React.FC<BudgetTimelineStepProps> = ({ data, onUpdate }) => {
  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      onUpdate({ budget: 0 });
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue >= 0) {
        onUpdate({ budget: numValue });
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Budget & Timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="budget">Project Budget</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                id="budget"
                type="number"
                value={data.budget === 0 ? '' : data.budget}
                onChange={handleBudgetChange}
                className="pl-9"
                placeholder="Enter your budget"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeline">Expected Timeline</Label>
            <Select
              value={data.timeline}
              onValueChange={(value) => onUpdate({ timeline: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select timeline" />
              </SelectTrigger>
              <SelectContent>
                {TIMELINE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="urgency">Project Urgency</Label>
            <Select
              value={data.urgency}
              onValueChange={(value) => onUpdate({ urgency: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select urgency level" />
              </SelectTrigger>
              <SelectContent>
                {URGENCY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetTimelineStep;
