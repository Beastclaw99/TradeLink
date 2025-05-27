
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Navigation } from 'lucide-react';

const MapView: React.FC = () => {
  // This is a placeholder map component
  // In a real implementation, you would integrate with Mapbox, Google Maps, or similar
  
  const mockLocations = [
    { id: '1', name: 'John Smith - Plumbing', lat: 10.6549, lng: -61.5017, trade: 'Plumbing' },
    { id: '2', name: 'Maria Rodriguez - Electrical', lat: 10.2796, lng: -61.4578, trade: 'Electrical' },
    { id: '3', name: 'David Williams - Carpentry', lat: 10.5158, lng: -61.4086, trade: 'Carpentry' }
  ];

  return (
    <Card className="h-96">
      <CardContent className="p-0 h-full relative">
        {/* Placeholder map area */}
        <div className="h-full bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center relative overflow-hidden">
          {/* Map overlay with location markers */}
          <div className="absolute inset-0 p-4">
            {mockLocations.map((location, index) => (
              <div
                key={location.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{
                  left: `${30 + index * 25}%`,
                  top: `${40 + index * 10}%`
                }}
              >
                <div className="flex flex-col items-center">
                  <div className="bg-ttc-blue-700 text-white p-2 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="bg-white px-2 py-1 rounded shadow-md text-xs font-medium mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {location.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Map placeholder content */}
          <div className="text-center">
            <Navigation className="h-16 w-16 text-ttc-blue-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-ttc-blue-700 mb-2">Map View</h3>
            <p className="text-gray-600">Interactive map showing professional locations</p>
            <p className="text-sm text-gray-500 mt-2">
              Hover over markers to see professional details
            </p>
          </div>
        </div>
        
        {/* Map controls */}
        <div className="absolute top-4 right-4 space-y-2">
          <button className="bg-white shadow-md p-2 rounded border hover:bg-gray-50">
            <span className="text-lg">+</span>
          </button>
          <button className="bg-white shadow-md p-2 rounded border hover:bg-gray-50">
            <span className="text-lg">−</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapView;
