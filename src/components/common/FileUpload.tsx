import React, { useCallback, useState } from 'react';
import { useFileUpload } from '@/hooks/useFileUpload';
import { UploadProgress } from '@/services/fileUploadService';

interface FileUploadProps {
  onUploadComplete: (result: { fileUrl: string; fileName: string }) => void;
  onError?: (error: string) => void;
  accept?: string;
  maxSize?: number;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUploadComplete,
  onError,
  accept = 'image/*,.pdf,.doc,.docx',
  maxSize = 10 * 1024 * 1024, // 10MB
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const { uploadFile, uploadProgress, isUploading, error, reset } = useFileUpload();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (!file) return;

      if (file.size > maxSize) {
        onError?.(`File size must be less than ${maxSize / 1024 / 1024}MB`);
        return;
      }

      try {
        const result = await uploadFile(file);
        onUploadComplete({
          fileUrl: result.fileUrl,
          fileName: result.fileName,
        });
      } catch (err) {
        onError?.(err instanceof Error ? err.message : 'Upload failed');
      }
    },
    [maxSize, onError, onUploadComplete, uploadFile]
  );

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.size > maxSize) {
        onError?.(`File size must be less than ${maxSize / 1024 / 1024}MB`);
        return;
      }

      try {
        const result = await uploadFile(file);
        onUploadComplete({
          fileUrl: result.fileUrl,
          fileName: result.fileName,
        });
      } catch (err) {
        onError?.(err instanceof Error ? err.message : 'Upload failed');
      }
    },
    [maxSize, onError, onUploadComplete, uploadFile]
  );

  const renderProgress = () => {
    if (!uploadProgress) return null;

    switch (uploadProgress.status) {
      case 'uploading':
        return (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${uploadProgress.progress}%` }}
            />
          </div>
        );
      case 'completed':
        return <div className="text-green-600">Upload complete!</div>;
      case 'error':
        return <div className="text-red-600">{uploadProgress.error}</div>;
      default:
        return null;
    }
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-6 text-center ${
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      } ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        id="file-upload"
        disabled={isUploading}
      />
      <label
        htmlFor="file-upload"
        className="cursor-pointer block"
      >
        <div className="space-y-2">
          <div className="text-gray-600">
            {isUploading ? (
              'Uploading...'
            ) : (
              <>
                <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
              </>
            )}
          </div>
          <div className="text-sm text-gray-500">
            {accept.split(',').join(', ')} (max {maxSize / 1024 / 1024}MB)
          </div>
        </div>
      </label>
      {renderProgress()}
      {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
    </div>
  );
}; 