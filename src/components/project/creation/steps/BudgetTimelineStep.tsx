
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface BudgetTimelineStepProps {
  data: any;
  onUpdate: (data: any) => void;
}

const BudgetTimelineStep: React.FC<BudgetTimelineStepProps> = ({ data, onUpdate }) => {
  const timelineOptions = [
    'ASAP (Within 1 week)',
    'Within 2 weeks',
    'Within 1 month',
    'Within 3 months',
    'Flexible timing'
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Low Priority', description: 'Can wait if needed' },
    { value: 'medium', label: 'Medium Priority', description: 'Prefer sooner than later' },
    { value: 'high', label: 'High Priority', description: 'Needs attention soon' },
    { value: 'urgent', label: 'Urgent', description: 'Critical/emergency situation' }
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="budget">Budget (TTD)</Label>
        <Input
          id="budget"
          type="number"
          value={data.budget}
          onChange={(e) => onUpdate({ budget: Number(e.target.value) })}
          placeholder="0"
        />
        <p className="text-sm text-gray-600">
          Enter your total budget for this project
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="timeline">Timeline</Label>
        <Select value={data.timeline} onValueChange={(value) => onUpdate({ timeline: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select timeline" />
          </SelectTrigger>
          <SelectContent>
            {timelineOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <Label className="text-base font-medium">Project Urgency</Label>
        <RadioGroup 
          value={data.urgency} 
          onValueChange={(value) => onUpdate({ urgency: value })}
        >
          {urgencyLevels.map((level) => (
            <div key={level.value} className="flex items-start space-x-3 p-3 border rounded-lg">
              <RadioGroupItem value={level.value} id={level.value} className="mt-1" />
              <div className="flex-1">
                <Label htmlFor={level.value} className="font-medium cursor-pointer">
                  {level.label}
                </Label>
                <p className="text-sm text-gray-600">{level.description}</p>
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};

export default BudgetTimelineStep;
