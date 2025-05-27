
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface ProjectFormData {
  title: string;
  description: string;
  category: string;
  budget: string;
  expected_timeline: string;
  location: string;
  urgency: string;
  requirements: string[];
  required_skills: string;
}

interface ProjectFormProps {
  initialData?: Partial<ProjectFormData>;
  onSubmit: (data: ProjectFormData) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

const PROJECT_CATEGORIES = [
  'Plumbing',
  'Electrical',
  'Carpentry',
  'Masonry',
  'Painting',
  'Roofing',
  'Landscaping',
  'HVAC',
  'Tile Work',
  'Flooring',
  'General Renovation'
];

const REQUIREMENTS = [
  'Licensed Professional Required',
  'Insurance Required',
  'Background Check Required',
  'References Required',
  'Equipment Provided',
  'Materials Included',
  'Weekend Work Available',
  'Emergency Service'
];

const ProjectForm: React.FC<ProjectFormProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
  isEditing = false
}) => {
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    category: '',
    budget: '',
    expected_timeline: '',
    location: '',
    urgency: '',
    requirements: [],
    required_skills: '',
    ...initialData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof ProjectFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleRequirementToggle = (requirement: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.includes(requirement)
        ? prev.requirements.filter(r => r !== requirement)
        : [...prev.requirements, requirement]
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Project title is required';
    if (!formData.description.trim()) newErrors.description = 'Project description is required';
    if (!formData.category) newErrors.category = 'Project category is required';
    if (!formData.budget) newErrors.budget = 'Budget range is required';
    if (!formData.expected_timeline) newErrors.expected_timeline = 'Timeline is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>
          {isEditing ? 'Edit Project' : 'Create New Project'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Title */}
          <div>
            <Label htmlFor="title">Project Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., Kitchen Cabinet Installation"
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Project Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your project in detail..."
              rows={4}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Category and Budget */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>

            <div>
              <Label htmlFor="budget">Budget Range *</Label>
              <Select value={formData.budget} onValueChange={(value) => handleInputChange('budget', value)}>
                <SelectTrigger className={errors.budget ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-1000">Under $1,000</SelectItem>
                  <SelectItem value="1000-5000">$1,000 - $5,000</SelectItem>
                  <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                  <SelectItem value="10000-25000">$10,000 - $25,000</SelectItem>
                  <SelectItem value="over-25000">Over $25,000</SelectItem>
                </SelectContent>
              </Select>
              {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget}</p>}
            </div>
          </div>

          {/* Timeline and Location */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expected_timeline">Expected Timeline *</Label>
              <Select value={formData.expected_timeline} onValueChange={(value) => handleInputChange('expected_timeline', value)}>
                <SelectTrigger className={errors.expected_timeline ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select timeline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asap">ASAP</SelectItem>
                  <SelectItem value="1-week">Within 1 week</SelectItem>
                  <SelectItem value="2-weeks">Within 2 weeks</SelectItem>
                  <SelectItem value="1-month">Within 1 month</SelectItem>
                  <SelectItem value="3-months">Within 3 months</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
              {errors.expected_timeline && <p className="text-red-500 text-sm mt-1">{errors.expected_timeline}</p>}
            </div>

            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g., Port of Spain, Trinidad"
                className={errors.location ? 'border-red-500' : ''}
              />
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
            </div>
          </div>

          {/* Urgency and Required Skills */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="urgency">Project Urgency</Label>
              <Select value={formData.urgency} onValueChange={(value) => handleInputChange('urgency', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select urgency level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - Can wait</SelectItem>
                  <SelectItem value="medium">Medium - Preferred timeline</SelectItem>
                  <SelectItem value="high">High - Urgent</SelectItem>
                  <SelectItem value="emergency">Emergency - Immediate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="required_skills">Required Skills</Label>
              <Input
                id="required_skills"
                value={formData.required_skills}
                onChange={(e) => handleInputChange('required_skills', e.target.value)}
                placeholder="e.g., Certified electrician, 5+ years experience"
              />
            </div>
          </div>

          {/* Requirements */}
          <div>
            <Label>Project Requirements</Label>
            <div className="grid md:grid-cols-2 gap-2 mt-2">
              {REQUIREMENTS.map((requirement) => (
                <div key={requirement} className="flex items-center space-x-2">
                  <Checkbox
                    id={requirement}
                    checked={formData.requirements.includes(requirement)}
                    onCheckedChange={() => handleRequirementToggle(requirement)}
                  />
                  <Label htmlFor={requirement} className="text-sm">
                    {requirement}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit">
              {isEditing ? 'Update Project' : 'Create Project'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProjectForm;
