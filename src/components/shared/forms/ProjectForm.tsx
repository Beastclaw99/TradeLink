import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Database } from '@/integrations/supabase/types';

type Project = Database['public']['Tables']['projects']['Row'];
type ProjectStatus = Database['public']['Enums']['project_status_enum'];

interface ProjectFormData {
  title: string;
  description: string;
  category: string;
  budget: number;
  timeline: string;
  location: string;
  urgency: string;
  requirements: string[];
  recommended_skills: string[];
  status: 'draft' | 'open' | 'assigned' | 'in_progress' | 'work_submitted' | 'work_revision_requested' | 'work_approved' | 'completed' | 'archived' | 'cancelled' | 'disputed';
  rich_description?: string;
  scope?: string;
  industry_specific_fields?: Record<string, any>;
  location_coordinates?: { lat: number; lng: number };
  contract_template_id?: string;
  payment_required: boolean;
  payment_due_date?: string;
  project_start_time?: string;
  client_id?: string;
  sla_terms?: Record<string, any>;
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

const COMMON_SKILLS = [
  'Pipe Installation',
  'Electrical Wiring',
  'Woodworking',
  'Concrete Work',
  'Interior Painting',
  'Roof Repair',
  'Garden Design',
  'AC Installation',
  'Tile Installation',
  'Floor Installation',
  'Project Management',
  'Safety Compliance',
  'Blueprint Reading',
  'Equipment Operation',
  'Quality Control'
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

const BUDGET_RANGES = [
  { value: 'under-1000', label: 'Under $1,000', description: 'Small projects and repairs' },
  { value: '1000-5000', label: '$1,000 - $5,000', description: 'Medium-sized projects' },
  { value: '5000-10000', label: '$5,000 - $10,000', description: 'Large renovations' },
  { value: '10000-25000', label: '$10,000 - $25,000', description: 'Major renovations' },
  { value: 'over-25000', label: 'Over $25,000', description: 'Full-scale projects' }
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
    budget: 0,
    timeline: '',
    location: '',
    urgency: '',
    requirements: [],
    recommended_skills: [],
    status: 'draft',
    payment_required: false,
    ...initialData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newSkill, setNewSkill] = useState('');
  const [openSkillsPopover, setOpenSkillsPopover] = useState(false);

  const handleInputChange = (field: keyof ProjectFormData, value: string | number | string[] | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field when user makes a change
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
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

  const handleAddSkill = (skill: string) => {
    if (skill && !formData.recommended_skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        recommended_skills: [...prev.recommended_skills, skill]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      recommended_skills: prev.recommended_skills.filter(s => s !== skill)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Project title is required';
    if (!formData.description.trim()) newErrors.description = 'Project description is required';
    if (!formData.category) newErrors.category = 'Project category is required';
    if (!formData.budget) newErrors.budget = 'Budget is required';
    if (!formData.timeline) newErrors.timeline = 'Timeline is required';
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Label htmlFor="budget">Budget *</Label>
              <Input
                id="budget"
                value={formData.budget.toString()}
                onChange={(e) => handleInputChange('budget', Number(e.target.value))}
                placeholder="e.g., $5,000 or Negotiable"
                className={errors.budget ? 'border-red-500' : ''}
              />
              {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget}</p>}
            </div>
          </div>

          {/* Timeline and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="timeline">Project Timeline *</Label>
              <Select value={formData.timeline} onValueChange={(value) => handleInputChange('timeline', value)}>
                <SelectTrigger className={errors.timeline ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select timeline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="less_than_1_month">Less than 1 month</SelectItem>
                  <SelectItem value="1_to_3_months">1-3 months</SelectItem>
                  <SelectItem value="3_to_6_months">3-6 months</SelectItem>
                  <SelectItem value="more_than_6_months">More than 6 months</SelectItem>
                </SelectContent>
              </Select>
              {errors.timeline && <p className="text-red-500 text-sm mt-1">{errors.timeline}</p>}
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

          {/* Required Skills */}
          <div>
            <Label>Required Skills (Optional)</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill(newSkill);
                    }
                  }}
                />
                <Button onClick={() => handleAddSkill(newSkill)} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.recommended_skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveSkill(skill)}
                    />
                  </Badge>
                ))}
              </div>
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
          <div className="flex justify-end gap-4">
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
