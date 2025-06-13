import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { Star, Flag, Eye } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type Review = Database['public']['Tables']['reviews']['Row'];
type Project = Database['public']['Tables']['projects']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

interface ReviewCardProps {
  review: Review;
  project?: Project;
  client?: Profile;
  professional?: Profile;
  onViewDetails?: (review: Review) => void;
  onReport?: (review: Review) => void;
  isProfessional?: boolean;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  project,
  client,
  professional,
  onViewDetails,
  onReport,
  isProfessional = false
}) => {
  const getStatusBadge = (status: string | null) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800' },
      approved: { color: 'bg-green-100 text-green-800' },
      rejected: { color: 'bg-red-100 text-red-800' },
      reported: { color: 'bg-red-100 text-red-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <Badge variant="outline" className={config.color}>
        {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
      </Badge>
    );
  };

  const renderRatingStars = (rating: number | null) => {
    if (!rating) return null;
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < (rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-gray-600">({rating.toFixed(1)})</span>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">
              {project?.title || 'Unknown Project'}
            </CardTitle>
            <CardDescription>
              Reviewed on {review.created_at ? format(new Date(review.created_at), 'MMM d, yyyy') : 'Unknown date'}
            </CardDescription>
          </div>
          {getStatusBadge(review.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">
                {isProfessional ? client?.first_name + ' ' + client?.last_name : professional?.first_name + ' ' + professional?.last_name}
              </p>
              {renderRatingStars(review.rating)}
            </div>
          </div>
          
          {review.comment && (
            <div>
              <p className="text-sm font-medium mb-1">Review:</p>
              <p className="text-sm text-gray-600 line-clamp-3">
                {review.comment}
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium mb-1">Quality Rating:</p>
              {renderRatingStars(review.quality_rating)}
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Communication Rating:</p>
              {renderRatingStars(review.communication_rating)}
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Professionalism Rating:</p>
              {renderRatingStars(review.professionalism_rating)}
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Timeliness Rating:</p>
              {renderRatingStars(review.timeliness_rating)}
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            {onViewDetails && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(review)}
              >
                <Eye className="h-4 w-4 mr-1" />
                View Details
              </Button>
            )}
            {onReport && !review.reported_at && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onReport(review)}
                className="text-red-600 hover:text-red-700"
              >
                <Flag className="h-4 w-4 mr-1" />
                Report
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewCard; 