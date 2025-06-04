import { validateFile } from '@/components/project/creation/validation';

export interface UploadProgress {
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

export interface UploadResult {
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

class FileUploadService {
  private static instance: FileUploadService;
  private uploadProgress: Map<string, UploadProgress> = new Map();

  private constructor() {}

  static getInstance(): FileUploadService {
    if (!FileUploadService.instance) {
      FileUploadService.instance = new FileUploadService();
    }
    return FileUploadService.instance;
  }

  async uploadFile(
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResult> {
    // Validate file before upload
    const validation = validateFile(file);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    const fileId = `${Date.now()}-${file.name}`;
    this.uploadProgress.set(fileId, { progress: 0, status: 'uploading' });

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append('file', file);

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded * 100) / event.total);
          const progressData = { progress, status: 'uploading' as const };
          this.uploadProgress.set(fileId, progressData);
          onProgress?.(progressData);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const result = JSON.parse(xhr.responseText);
            const completedProgress = { progress: 100, status: 'completed' as const };
            this.uploadProgress.set(fileId, completedProgress);
            onProgress?.(completedProgress);

            resolve({
              fileUrl: result.url,
              fileName: file.name,
              fileType: file.type,
              fileSize: file.size,
            });
          } catch (error) {
            const errorProgress = {
              progress: 0,
              status: 'error' as const,
              error: 'Failed to parse server response',
            };
            this.uploadProgress.set(fileId, errorProgress);
            onProgress?.(errorProgress);
            reject(new Error('Failed to parse server response'));
          }
        } else {
          const errorProgress = {
            progress: 0,
            status: 'error' as const,
            error: `Upload failed with status ${xhr.status}`,
          };
          this.uploadProgress.set(fileId, errorProgress);
          onProgress?.(errorProgress);
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        const errorProgress = {
          progress: 0,
          status: 'error' as const,
          error: 'Network error occurred',
        };
        this.uploadProgress.set(fileId, errorProgress);
        onProgress?.(errorProgress);
        reject(new Error('Network error occurred'));
      });

      xhr.open('POST', '/api/upload');
      xhr.send(formData);
    });
  }

  getUploadProgress(fileId: string): UploadProgress | undefined {
    return this.uploadProgress.get(fileId);
  }

  clearUploadProgress(fileId: string): void {
    this.uploadProgress.delete(fileId);
  }
}

export const fileUploadService = FileUploadService.getInstance(); 