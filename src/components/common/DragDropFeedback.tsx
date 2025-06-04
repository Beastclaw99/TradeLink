
import React from 'react';
import { AlertCircle, Info } from 'lucide-react';

interface DragDropFeedbackProps {
  isDragging: boolean;
  message: string;
  type: 'info' | 'warning' | 'error';
}

export const DragDropFeedback: React.FC<DragDropFeedbackProps> = ({
  isDragging,
  message,
  type
}) => {
  if (!isDragging) return null;

  const getIcon = () => {
    switch (type) {
      case 'error':
      case 'warning':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 p-3 rounded-lg border flex items-center gap-2 ${getColor()}`}>
      {getIcon()}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};
