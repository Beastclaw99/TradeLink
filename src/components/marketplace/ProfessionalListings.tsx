
import React from 'react';
import ProfessionalCard from './ProfessionalCard';
import ProfessionalListItem from './ProfessionalListItem';

interface ProfessionalListingsProps {
  viewMode: 'grid' | 'list';
  filters: any;
}

// Mock data for demonstration
const MOCK_PROFESSIONALS = [
  {
    id: '1',
    name: 'John Smith',
    trade: 'Plumbing',
    rating: 4.8,
    reviewCount: 127,
    hourlyRate: 150,
    location: 'Port of Spain',
    availability: 'Available Now',
    profileImage: '/placeholder.svg',
    skills: ['Residential Plumbing', 'Emergency Repairs', 'Pipe Installation'],
    yearsExperience: 8
  },
  {
    id: '2',
    name: 'Maria Rodriguez',
    trade: 'Electrical',
    rating: 4.9,
    reviewCount: 89,
    hourlyRate: 175,
    location: 'San Fernando',
    availability: 'Available Next Week',
    profileImage: '/placeholder.svg',
    skills: ['Wiring', 'Solar Installation', 'Panel Upgrades'],
    yearsExperience: 12
  },
  {
    id: '3',
    name: 'David Williams',
    trade: 'Carpentry',
    rating: 4.7,
    reviewCount: 156,
    hourlyRate: 120,
    location: 'Chaguanas',
    availability: 'Available Now',
    profileImage: '/placeholder.svg',
    skills: ['Custom Furniture', 'Home Renovations', 'Cabinet Making'],
    yearsExperience: 15
  }
];

const ProfessionalListings: React.FC<ProfessionalListingsProps> = ({
  viewMode,
  filters
}) => {
  if (viewMode === 'grid') {
    return (
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {MOCK_PROFESSIONALS.map((professional) => (
          <ProfessionalCard key={professional.id} professional={professional} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {MOCK_PROFESSIONALS.map((professional) => (
        <ProfessionalListItem key={professional.id} professional={professional} />
      ))}
    </div>
  );
};

export default ProfessionalListings;
