
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProfessionalSearchFiltersProps {
  filters: {
    location: string;
    skills: string[];
    rating: string;
    availability: string;
    experience: string;
  };
  onFiltersChange: (filters: any) => void;
}

const TRADE_SKILLS = [
  'Plumbing',
  'Electrical',
  'Carpentry',
  'Masonry',
  'Painting',
  'Roofing',
  'Landscaping',
  'HVAC',
  'Tile Work',
  'Flooring'
];

const ProfessionalSearchFilters: React.FC<ProfessionalSearchFiltersProps> = ({
  filters,
  onFiltersChange
}) => {
  const handleLocationChange = (location: string) => {
    onFiltersChange({ ...filters, location });
  };

  const handleSkillToggle = (skill: string) => {
    const updatedSkills = filters.skills.includes(skill)
      ? filters.skills.filter(s => s !== skill)
      : [...filters.skills, skill];
    onFiltersChange({ ...filters, skills: updatedSkills });
  };

  const clearFilters = () => {
    onFiltersChange({
      location: '',
      skills: [],
      rating: '',
      availability: '',
      experience: ''
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Location */}
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="Enter city or area"
            value={filters.location}
            onChange={(e) => handleLocationChange(e.target.value)}
          />
        </div>

        {/* Skills */}
        <div>
          <Label>Trade Skills</Label>
          <div className="grid grid-cols-1 gap-2 mt-2">
            {TRADE_SKILLS.map((skill) => (
              <div key={skill} className="flex items-center space-x-2">
                <Checkbox
                  id={skill}
                  checked={filters.skills.includes(skill)}
                  onCheckedChange={() => handleSkillToggle(skill)}
                />
                <Label htmlFor={skill} className="text-sm">{skill}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div>
          <Label htmlFor="rating">Minimum Rating</Label>
          <Select value={filters.rating} onValueChange={(value) => onFiltersChange({ ...filters, rating: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4+ Stars</SelectItem>
              <SelectItem value="3">3+ Stars</SelectItem>
              <SelectItem value="2">2+ Stars</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Availability */}
        <div>
          <Label htmlFor="availability">Availability</Label>
          <Select value={filters.availability} onValueChange={(value) => onFiltersChange({ ...filters, availability: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="immediate">Available Now</SelectItem>
              <SelectItem value="week">Within a Week</SelectItem>
              <SelectItem value="month">Within a Month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Experience */}
        <div>
          <Label htmlFor="experience">Experience Level</Label>
          <Select value={filters.experience} onValueChange={(value) => onFiltersChange({ ...filters, experience: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select experience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="entry">Entry Level (1-2 years)</SelectItem>
              <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
              <SelectItem value="senior">Senior Level (5+ years)</SelectItem>
              <SelectItem value="expert">Expert (10+ years)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={clearFilters} variant="outline" className="w-full">
          Clear All Filters
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfessionalSearchFilters;
