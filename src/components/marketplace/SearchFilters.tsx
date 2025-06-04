
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface SearchFiltersProps {
  onFilterChange: (filters: any) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ onFilterChange }) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [location, setLocation] = useState('');
  const [budgetRange, setBudgetRange] = useState([0, 10000]);

  const handleFilterUpdate = () => {
    onFilterChange({
      search,
      category: category === 'all' ? undefined : category,
      location: location || undefined,
      budgetRange: budgetRange[0] === 0 && budgetRange[1] === 10000 ? undefined : budgetRange
    });
  };

  const handleClearFilters = () => {
    setSearch('');
    setCategory('all');
    setLocation('');
    setBudgetRange([0, 10000]);
    onFilterChange({});
  };

  React.useEffect(() => {
    handleFilterUpdate();
  }, [search, category, location, budgetRange]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="plumbing">Plumbing</SelectItem>
              <SelectItem value="electrical">Electrical</SelectItem>
              <SelectItem value="carpentry">Carpentry</SelectItem>
              <SelectItem value="painting">Painting</SelectItem>
              <SelectItem value="landscaping">Landscaping</SelectItem>
              <SelectItem value="roofing">Roofing</SelectItem>
              <SelectItem value="flooring">Flooring</SelectItem>
              <SelectItem value="masonry">Masonry</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="Enter location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div>
          <Label>Budget Range: ${budgetRange[0]} - ${budgetRange[1]}</Label>
          <Slider
            value={budgetRange}
            onValueChange={setBudgetRange}
            max={10000}
            min={0}
            step={100}
            className="mt-2"
          />
        </div>

        <Button variant="outline" onClick={handleClearFilters} className="w-full">
          Clear Filters
        </Button>
      </CardContent>
    </Card>
  );
};

export default SearchFilters;
