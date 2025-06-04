import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import ProfessionalCard from './ProfessionalCard';
import ProfessionalListItem from './ProfessionalListItem';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

type Profile = Database['public']['Tables']['profiles']['Row'];

type SortField = 'rating' | 'hourly_rate' | 'completed_projects' | 'response_rate' | 'on_time_completion';
type SortOrder = 'asc' | 'desc';

interface ProfessionalListingsProps {
  viewMode: 'grid' | 'list';
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
  sortBy: {
    field: SortField;
    order: SortOrder;
  };
}

const ProfessionalListings: React.FC<ProfessionalListingsProps> = ({ viewMode, filters, sortBy }) => {
  const [professionals, setProfessionals] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const validateFilters = useCallback(() => {
    if (filters.hourlyRate?.min && filters.hourlyRate?.max && 
        filters.hourlyRate.min > filters.hourlyRate.max) {
      return false;
    }
    if (filters.rating && (filters.rating < 0 || filters.rating > 5)) {
      return false;
    }
    return true;
  }, [filters]);

  const fetchProfessionals = useCallback(async (abortSignal?: AbortSignal) => {
    try {
      if (!validateFilters()) {
        setError('Invalid filter values. Please check your filters.');
        return;
      }

      setLoading(true);
      setError(null);

      let query = supabase
        .from('profiles')
        .select('*')
        .eq('account_type', 'professional');

      // Apply filters
      if (filters.skills?.length) {
        query = query.overlaps('skills', filters.skills);
      }
      if (filters.rating) {
        query = query.gte('rating', filters.rating);
      }
      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }
      if (filters.hourlyRate?.min) {
        query = query.gte('hourly_rate', filters.hourlyRate.min);
      }
      if (filters.hourlyRate?.max) {
        query = query.lte('hourly_rate', filters.hourlyRate.max);
      }
      if (filters.availability) {
        query = query.eq('availability', filters.availability);
      }
      if (filters.verificationStatus) {
        query = query.eq('verification_status', filters.verificationStatus);
      }

      // Apply sorting
      query = query.order(sortBy.field, { ascending: sortBy.order === 'asc' });

      const { data, error } = await query;

      if (error) throw error;
      if (!abortSignal?.aborted) {
        setProfessionals(data || []);
      }
    } catch (err) {
      console.error('Error fetching professionals:', err);
      if (!abortSignal?.aborted) {
        setError('Failed to load professionals. Please try again.');
        toast({
          title: "Error",
          description: "Failed to load professionals. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      if (!abortSignal?.aborted) {
        setLoading(false);
      }
    }
  }, [filters, sortBy, validateFilters]);

  useEffect(() => {
    const abortController = new AbortController();
    fetchProfessionals(abortController.signal);
    return () => abortController.abort();
  }, [fetchProfessionals, retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-ttc-blue-700" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={handleRetry} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  if (professionals.length === 0) {
    return (
      <div className="text-center text-gray-600 py-8">
        <p>No professionals found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
      {professionals.map((professional) => (
        viewMode === 'grid' ? (
          <ProfessionalCard key={professional.id} professional={professional} />
        ) : (
          <ProfessionalListItem key={professional.id} professional={professional} />
        )
      ))}
    </div>
  );
};

export default ProfessionalListings;
