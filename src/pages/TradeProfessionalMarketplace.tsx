
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import ProfessionalSearchFilters from '@/components/marketplace/ProfessionalSearchFilters';
import ProfessionalListings from '@/components/marketplace/ProfessionalListings';
import MapView from '@/components/shared/MapView';
import { Button } from '@/components/ui/button';
import { Grid3X3, List, Map } from 'lucide-react';

const TradeProfessionalMarketplace: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [searchFilters, setSearchFilters] = useState({
    location: '',
    skills: [],
    rating: '',
    availability: '',
    experience: ''
  });

  return (
    <Layout>
      <div className="bg-ttc-blue-800 py-8 text-white">
        <div className="container-custom">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Find Trade Professionals</h1>
          <p className="text-lg">Connect with skilled tradespeople in Trinidad & Tobago through ProLinkTT</p>
        </div>
      </div>
      
      <div className="container-custom py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Search Filters Sidebar */}
          <div className="lg:col-span-1">
            <ProfessionalSearchFilters 
              filters={searchFilters}
              onFiltersChange={setSearchFilters}
            />
          </div>
          
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* View Mode Toggle */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Available Professionals</h2>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'map' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('map')}
                >
                  <Map className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Content Display */}
            {viewMode === 'map' ? (
              <MapView />
            ) : (
              <ProfessionalListings 
                viewMode={viewMode}
                filters={searchFilters}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TradeProfessionalMarketplace;
