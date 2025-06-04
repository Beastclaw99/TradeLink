import { useState, useCallback } from 'react';
import { fileUploadService, UploadProgress, UploadResult } from '@/services/fileUploadService';

interface UseFileUploadReturn {
  uploadFile: (file: File) => Promise<UploadResult>;
  uploadProgress: UploadProgress | null;
  isUploading: boolean;
  error: string | null;
  reset: () => void;
}

export const useFileUpload = (): UseFileUploadReturn => {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(async (file: File): Promise<UploadResult> => {
    setError(null);
    try {
      const result = await fileUploadService.uploadFile(file, (progress) => {
        setUploadProgress(progress);
      });
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    setUploadProgress(null);
    setError(null);
  }, []);

  return {
    uploadFile,
    uploadProgress,
    isUploading: uploadProgress?.status === 'uploading',
    error,
    reset,
  };
}; 