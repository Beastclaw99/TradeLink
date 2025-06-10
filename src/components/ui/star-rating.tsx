import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  value: number;
  onChange?: (rating: number) => void;
  onHover?: (rating: number) => void;
  size?: 'default' | 'large';
  className?: string;
  readOnly?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  onHover = () => {},
  size = 'default',
  className,
  readOnly = false
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
            !readOnly && "cursor-pointer",
            "transition-colors",
            star <= (hoverRating || value)
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          )}
          onClick={() => !readOnly && onChange?.(star)}
          onMouseEnter={() => {
            if (!readOnly) {
              setHoverRating(star);
              onHover(star);
            }
          }}
          onMouseLeave={() => {
            if (!readOnly) {
              setHoverRating(0);
              onHover(0);
            }
          }}
        />
      ))}
    </div>
  );
}; 