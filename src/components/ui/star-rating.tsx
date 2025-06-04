import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
  onHover?: (rating: number) => void;
  size?: 'default' | 'large';
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  onHover = () => {},
  size = 'default',
  className
}) => {
  const [hoverRating, setHoverRating] = React.useState(0);
  const starSize = size === 'large' ? 'h-8 w-8' : 'h-5 w-5';
  
  return (
    <div className={cn("flex gap-1", className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            starSize,
            "cursor-pointer transition-colors",
            star <= (hoverRating || value)
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          )}
          onClick={() => onChange(star)}
          onMouseEnter={() => {
            setHoverRating(star);
            onHover(star);
          }}
          onMouseLeave={() => {
            setHoverRating(0);
            onHover(0);
          }}
        />
      ))}
    </div>
  );
}; 