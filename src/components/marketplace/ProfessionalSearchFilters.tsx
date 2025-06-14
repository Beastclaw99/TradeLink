
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, MapPin, DollarSign, Clock } from 'lucide-react';
import { StarRating } from '@/components/ui/star-rating';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProfessionalSearchFiltersProps {
  filters: {
    skills?: string[];
    rating?: number;
    location?: string;
    hourlyRate?: {
      min?: number;
      max?: number;
    };
    availability?: 'available' | 'busy' | 'unavailable';
    verificationStatus?: 'verified' | 'pending' | 'unverified';
  };
  onFiltersChange: (filters: ProfessionalSearchFiltersProps['filters']) => void;
  onClearFilters: () => void;
}

const SKILLS = [
  'Plumbing',
  'Electrical',
  'Carpentry',
  'Painting',
  'Masonry',
  'Roofing',
  'HVAC',
  'Landscaping',
  'Flooring',
  'Drywall',
  'Tiling',
  'Welding',
  'Auto Repair',
  'Appliance Repair',
  'General Contractor'
];

const LOCATIONS = [
  'Port of Spain',
  'San Fernando',
  'Chaguanas',
  'Arima',
  'Point Fortin',
  'Scarborough',
  'Tobago'
];

const ProfessionalSearchFilters: React.FC<ProfessionalSearchFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters
}) => {
  const handleSkillToggle = (skill: string) => {
    const currentSkills = filters.skills || [];
    const newSkills = currentSkills.includes(skill)
      ? currentSkills.filter(s => s !== skill)
      : [...currentSkills, skill];
    
    onFiltersChange({ ...filters, skills: newSkills });
  };

  const handleRatingChange = (rating: number) => {
    onFiltersChange({ ...filters, rating });
  };

  const handleLocationChange = (location: string) => {
    const actualLocation = location === 'all_locations' ? undefined : location;
    onFiltersChange({ ...filters, location: actualLocation });
  };

  const handleHourlyRateChange = (type: 'min' | 'max', value: string) => {
    const numValue = value ? parseInt(value) : undefined;
    onFiltersChange({
      ...filters,
      hourlyRate: {
        ...filters.hourlyRate,
        [type]: numValue
      }
    });
  };

  const handleAvailabilityChange = (availability: string) => {
    const actualAvailability = availability === 'any_availability' ? undefined : availability as 'available' | 'busy' | 'unavailable';
    onFiltersChange({ ...filters, availability: actualAvailability });
  };

  const handleVerificationStatusChange = (status: string) => {
    const actualStatus = status === 'any_status' ? undefined : status as 'verified' | 'pending' | 'unverified';
    onFiltersChange({ ...filters, verificationStatus: actualStatus });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <Label className="text-lg font-semibold mb-4 block">Location</Label>
            <Select
              value={filters.location || 'all_locations'}
              onValueChange={handleLocationChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_locations">All Locations</SelectItem>
                {LOCATIONS.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-lg font-semibold mb-4 block">Skills</Label>
            <div className="flex flex-wrap gap-2">
              {SKILLS.map((skill) => (
                <Badge
                  key={skill}
                  variant={filters.skills?.includes(skill) ? 'default' : 'outline'}
                  className="cursor-pointer hover:bg-ttc-blue-50"
                  onClick={() => handleSkillToggle(skill)}
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-lg font-semibold mb-4 block">Minimum Rating</Label>
            <div className="flex items-center space-x-2">
              <StarRating
                value={filters.rating || 0}
                onChange={handleRatingChange}
                size="large"
              />
              {filters.rating ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onFiltersChange({ ...filters, rating: undefined })}
                >
                  <X className="h-4 w-4" />
                </Button>
              ) : null}
            </div>
          </div>

          <div>
            <Label className="text-lg font-semibold mb-4 block">Hourly Rate (TTD)</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.hourlyRate?.min || ''}
                  onChange={(e) => handleHourlyRateChange('min', e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.hourlyRate?.max || ''}
                  onChange={(e) => handleHourlyRateChange('max', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <Label className="text-lg font-semibold mb-4 block">Availability</Label>
            <Select
              value={filters.availability || 'any_availability'}
              onValueChange={handleAvailabilityChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any_availability">Any</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="busy">Busy</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-lg font-semibold mb-4 block">Verification Status</Label>
            <Select
              value={filters.verificationStatus || 'any_status'}
              onValueChange={handleVerificationStatusChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any_status">Any</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(filters.skills?.length || filters.rating || filters.location || 
            filters.hourlyRate?.min || filters.hourlyRate?.max || 
            filters.availability || filters.verificationStatus) && (
            <Button
              variant="outline"
              className="w-full"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfessionalSearchFilters;
