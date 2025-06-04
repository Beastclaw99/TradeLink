
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProjectData } from '@/types';

interface BasicDetailsStepProps {
  data: ProjectData;
  onUpdate: (data: Partial<ProjectData>) => void;
}

const CATEGORY_OPTIONS = [
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'carpentry', label: 'Carpentry' },
  { value: 'painting', label: 'Painting' },
  { value: 'masonry', label: 'Masonry' },
  { value: 'roofing', label: 'Roofing' },
  { value: 'landscaping', label: 'Landscaping' },
  { value: 'other', label: 'Other' }
];

const BasicDetailsStep: React.FC<BasicDetailsStepProps> = ({ data, onUpdate }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              placeholder="Enter a descriptive title"
              value={data.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Project Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your project in detail"
              value={data.description}
              onChange={(e) => onUpdate({ description: e.target.value })}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Project Category</Label>
            <Select
              value={data.category}
              onValueChange={(value) => onUpdate({ category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="Enter project location"
              value={data.location}
              onChange={(e) => onUpdate({ location: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BasicDetailsStep;
