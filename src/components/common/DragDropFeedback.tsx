import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DragDropFeedbackProps {
  isDragging: boolean;
  message?: string;
  type?: 'success' | 'error' | 'info';
}

export const DragDropFeedback: React.FC<DragDropFeedbackProps> = ({
  isDragging,
  message = 'Drop files here',
  type = 'info',
}) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-500 text-green-700';
      case 'error':
        return 'bg-red-50 border-red-500 text-red-700';
      default:
        return 'bg-blue-50 border-blue-500 text-blue-700';
    }
  };

  return (
    <AnimatePresence>
      {isDragging && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={`fixed inset-0 z-50 flex items-center justify-center ${getTypeStyles()}`}
        >
          <div className="rounded-lg border-2 border-dashed p-8 text-center">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <p className="text-lg font-medium">{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 