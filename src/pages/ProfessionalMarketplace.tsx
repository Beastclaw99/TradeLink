import React, { useState, useCallback } from 'react';
import Layout from '@/components/layout/Layout';
import ProfessionalListings from '@/components/marketplace/ProfessionalListings';
import ProfessionalSearchFilters from '@/components/marketplace/ProfessionalSearchFilters';
import { Button } from '@/components/ui/button';
import { Grid, List, ArrowUpDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

type SortField = 'rating' | 'hourly_rate' | 'completed_projects' | 'response_rate' | 'on_time_completion';
type SortOrder = 'asc' | 'desc';

interface Filters {
  skills?: string[];
  rating?: number;
  location?: string;
  hourlyRate?: {
    min?: number;
    max?: number;
  };
  availability?: 'available' | 'busy' | 'unavailable';
  verificationStatus?: 'verified' | 'pending' | 'unverified';
}

const DEFAULT_FILTERS: Filters = {
  skills: [],
  rating: undefined,
  location: '',
  hourlyRate: {
    min: undefined,
    max: undefined
  },
  availability: undefined,
  verificationStatus: undefined
};

const ProfessionalMarketplace: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState<{
    field: SortField;
    order: SortOrder;
  }>({
    field: 'rating',
    order: 'desc'
  });

  const handleSortChange = useCallback((value: string) => {
    try {
      const [field, order] = value.split('-');
      if (!field || !order) {
        throw new Error('Invalid sort value');
      }

      const validFields: SortField[] = ['rating', 'hourly_rate', 'completed_projects', 'response_rate', 'on_time_completion'];
      const validOrders: SortOrder[] = ['asc', 'desc'];

      if (!validFields.includes(field as SortField) || !validOrders.includes(order as SortOrder)) {
        throw new Error('Invalid sort field or order');
      }

      setSortBy({
        field: field as SortField,
        order: order as SortOrder
      });
    } catch (error) {
      console.error('Error setting sort:', error);
      toast({
        title: "Error",
        description: "Failed to update sort order. Please try again.",
        variant: "destructive"
      });
    }
  }, []);

  const handleFiltersChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <ProfessionalSearchFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Find Trade Professionals</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <ArrowUpDown className="h-4 w-4 text-gray-500" />
                  <Select
                    value={`${sortBy.field}-${sortBy.order}`}
                    onValueChange={handleSortChange}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating-desc">Highest Rating</SelectItem>
                      <SelectItem value="rating-asc">Lowest Rating</SelectItem>
                      <SelectItem value="hourly_rate-asc">Lowest Rate</SelectItem>
                      <SelectItem value="hourly_rate-desc">Highest Rate</SelectItem>
                      <SelectItem value="completed_projects-desc">Most Projects</SelectItem>
                      <SelectItem value="response_rate-desc">Best Response Rate</SelectItem>
                      <SelectItem value="on_time_completion-desc">Best On-Time Rate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <ProfessionalListings
              viewMode={viewMode}
              filters={filters}
              sortBy={sortBy}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfessionalMarketplace;
