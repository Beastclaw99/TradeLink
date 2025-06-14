
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';

interface ProfessionalSearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedSkills: string[];
  setSelectedSkills: (skills: string[]) => void;
  locationFilter: string;
  setLocationFilter: (location: string) => void;
  minRating: number;
  setMinRating: (rating: number) => void;
  maxHourlyRate: number;
  setMaxHourlyRate: (rate: number) => void;
  availableSkills: string[];
  onApplyFilters: () => void;
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
  maxHourlyRate,
  setMaxHourlyRate,
  availableSkills,
  onApplyFilters
}) => {
  const toggleSkill = (skill: string) => {
    setSelectedSkills(
      selectedSkills.includes(skill)
        ? selectedSkills.filter(s => s !== skill)
        : [...selectedSkills, skill]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSkills([]);
    setLocationFilter('');
    setMinRating(0);
    setMaxHourlyRate(1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filter Professionals
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div>
          <Label htmlFor="search">Search Professionals</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="search"
              placeholder="Search by name, skills, or experience..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Separator />

        {/* Skills Filter */}
        <div>
          <Label>Skills</Label>
          <div className="flex flex-wrap gap-2 mt-2 max-h-32 overflow-y-auto">
            {availableSkills.map((skill) => (
              <Badge
                key={skill}
                variant={selectedSkills.includes(skill) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleSkill(skill)}
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* Location Filter */}
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="Enter location..."
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          />
        </div>

        <Separator />

        {/* Rating Filter */}
        <div>
          <Label htmlFor="rating">Minimum Rating</Label>
          <Input
            id="rating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            placeholder="Minimum rating..."
            value={minRating || ''}
            onChange={(e) => setMinRating(Number(e.target.value) || 0)}
          />
        </div>

        {/* Hourly Rate Filter */}
        <div>
          <Label htmlFor="hourlyRate">Maximum Hourly Rate ($)</Label>
          <Input
            id="hourlyRate"
            type="number"
            min="0"
            placeholder="Maximum hourly rate..."
            value={maxHourlyRate || ''}
            onChange={(e) => setMaxHourlyRate(Number(e.target.value) || 1000)}
          />
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button onClick={onApplyFilters} className="flex-1">
            Apply Filters
          </Button>
          <Button variant="outline" onClick={clearFilters}>
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfessionalSearchFilters;
