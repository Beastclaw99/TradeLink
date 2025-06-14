
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProjectData } from '@/types/project';

interface BasicDetailsStepProps {
  data: ProjectData;
  onUpdate: (data: Partial<ProjectData>) => void;
}

const BasicDetailsStep: React.FC<BasicDetailsStepProps> = ({ data, onUpdate }) => {
  const categories = [
    'Technology & Development',
    'Design & Creative',
    'Construction & Trades',
    'Professional Services',
    'Education & Training',
    'Health & Wellness',
    'Business & Consulting',
    'Marketing & Sales',
    'Writing & Content',
    'Other'
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Basic Project Details</h3>
        <p className="text-gray-600 mb-6">
          Let's start with the essential information about your project.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Project Title *</Label>
            <Input
              id="title"
              value={data.title || ''}
              onChange={(e) => onUpdate({ title: e.target.value })}
              placeholder="Enter a clear, descriptive title for your project"
            />
          </div>

          <div>
            <Label htmlFor="description">Project Description *</Label>
            <Textarea
              id="description"
              value={data.description || ''}
              onChange={(e) => onUpdate({ description: e.target.value })}
              placeholder="Describe what you need done, including any specific requirements or goals"
              className="min-h-32"
            />
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Select value={data.category || ''} onValueChange={(value) => onUpdate({ category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={data.location || ''}
              onChange={(e) => onUpdate({ location: e.target.value })}
              placeholder="Where should the work be performed? (e.g., Remote, Trinidad, Tobago, etc.)"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BasicDetailsStep;
