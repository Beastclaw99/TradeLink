
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Star, User, X } from 'lucide-react';

interface ProfessionalSearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedSkills: string[];
  setSelectedSkills: (skills: string[]) => void;
  locationFilter: string;
  setLocationFilter: (location: string) => void;
  minRating: number;
  setMinRating: (rating: number) => void;
  maxRate: string;
  setMaxRate: (rate: string) => void;
  availabilityFilter: string;
  setAvailabilityFilter: (availability: string) => void;
  allSkills: string[];
  isLoading: boolean;
}

const ProfessionalSearchFilters: React.FC<ProfessionalSearchFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  selectedSkills,
  setSelectedSkills,
  locationFilter,
  setLocationFilter,
  minRating,
  setMinRating,
  maxRate,
  setMaxRate,
  availabilityFilter,
  setAvailabilityFilter,
  allSkills,
  isLoading
}) => {
  const addSkill = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const removeSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter(s => s !== skill));
  };

  const availableSkills = allSkills.filter(skill => 
    !selectedSkills.includes(skill) && 
    skill.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <User className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Filter Professionals</h3>
      </div>

      {/* Search */}
      <div>
        <Label htmlFor="search">Search by name or skills</Label>
        <Input
          id="search"
          type="text"
          placeholder="Enter name or skill..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mt-1"
        />
      </div>

      {/* Skills */}
      <div>
        <Label>Skills</Label>
        <div className="mt-2">
          {selectedSkills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedSkills.map((skill) => (
                <Badge key={skill} variant="default" className="flex items-center gap-1">
                  {skill}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeSkill(skill)}
                  />
                </Badge>
              ))}
            </div>
          )}
          
          <div className="max-h-32 overflow-y-auto space-y-1">
            {availableSkills.slice(0, 10).map((skill) => (
              <Button
                key={skill}
                variant="outline"
                size="sm"
                onClick={() => addSkill(skill)}
                className="mr-2 mb-2"
              >
                + {skill}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Location */}
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          type="text"
          placeholder="Enter location..."
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="mt-1"
        />
      </div>

      {/* Rating */}
      <div>
        <Label>Minimum Rating</Label>
        <div className="flex items-center gap-2 mt-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <Star
              key={rating}
              className={`h-5 w-5 cursor-pointer ${
                rating <= minRating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
              onClick={() => setMinRating(rating)}
            />
          ))}
        </div>
      </div>

      {/* Hourly Rate */}
      <div>
        <Label htmlFor="maxRate">Max Hourly Rate ($)</Label>
        <Input
          id="maxRate"
          type="number"
          placeholder="Enter max rate..."
          value={maxRate}
          onChange={(e) => setMaxRate(e.target.value)}
          className="mt-1"
        />
      </div>

      {/* Availability */}
      <div>
        <Label>Availability</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {['available', 'busy', 'unavailable'].map((status) => (
            <Button
              key={status}
              variant={availabilityFilter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setAvailabilityFilter(availabilityFilter === status ? '' : status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalSearchFilters;
