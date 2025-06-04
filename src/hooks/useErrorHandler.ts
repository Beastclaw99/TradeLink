import { useState, useCallback } from 'react';

interface ErrorState {
  hasError: boolean;
  message: string | null;
}

export const useErrorHandler = () => {
  const [error, setError] = useState<ErrorState>({
    hasError: false,
    message: null,
  });

  const handleError = useCallback((error: Error | string) => {
    setError({
      hasError: true,
      message: error instanceof Error ? error.message : error,
    });
  }, []);

  const clearError = useCallback(() => {
    setError({
      hasError: false,
      message: null,
    });
  }, []);

  return {
    error,
    handleError,
    clearError,
  };
}; 