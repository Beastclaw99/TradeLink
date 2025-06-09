
import { supabase } from '@/integrations/supabase/client';

export interface FileVersion {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  version_id: string;
  created_at: string;
  uploaded_at: string;
}

export interface FileReview {
  id: string;
  file_id: string;
  reviewer_id: string;
  status: 'pending' | 'approved' | 'rejected';
  feedback?: string;
  created_at: string;
  reviewed_at?: string;
}

export interface FileComment {
  id: string;
  file_id: string;
  content: string;
  created_at: string;
}

export interface FileStatusRestriction {
  id: string;
  project_id: string;
  status: string;
  allowed_file_types: string[];
  max_file_size?: number;
  max_files_per_submission?: number;
}

export const fileService = {
  // Upload a file
  async uploadFile(file: File, projectId: string): Promise<string> {
    try {
      const fileName = `${projectId}/${Date.now()}-${file.name}`;
      
      // Note: This is a placeholder for file upload functionality
      // In a real implementation, you would use Supabase Storage
      console.log('File upload placeholder:', { fileName, size: file.size, type: file.type });
      
      // Return a placeholder URL
      return `https://placeholder.com/files/${fileName}`;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file');
    }
  },

  // Get file versions (using work_version_files table)
  async getFileVersions(versionId: string): Promise<FileVersion[]> {
    try {
      const { data, error } = await supabase
        .from('work_version_files')
        .select('*')
        .eq('version_id', versionId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(file => ({
        id: file.id,
        file_name: file.file_name,
        file_url: file.file_url,
        file_type: file.file_type || 'unknown',
        file_size: file.file_size || 0,
        version_id: file.version_id || '',
        created_at: file.created_at,
        uploaded_at: file.uploaded_at || file.created_at
      }));
    } catch (error) {
      console.error('Error fetching file versions:', error);
      return [];
    }
  },

  // Create a new file version
  async createFileVersion(fileData: {
    file_name: string;
    file_url: string;
    file_type: string;
    file_size: number;
    version_id: string;
  }): Promise<FileVersion> {
    try {
      const { data, error } = await supabase
        .from('work_version_files')
        .insert({
          file_name: fileData.file_name,
          file_url: fileData.file_url,
          file_type: fileData.file_type,
          file_size: fileData.file_size,
          version_id: fileData.version_id
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        file_name: data.file_name,
        file_url: data.file_url,
        file_type: data.file_type || 'unknown',
        file_size: data.file_size || 0,
        version_id: data.version_id || '',
        created_at: data.created_at,
        uploaded_at: data.uploaded_at || data.created_at
      };
    } catch (error) {
      console.error('Error creating file version:', error);
      throw new Error('Failed to create file version');
    }
  },

  // Delete a file
  async deleteFile(fileId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('work_version_files')
        .delete()
        .eq('id', fileId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error('Failed to delete file');
    }
  },

  // Placeholder methods for file reviews and comments
  async getFileReviews(fileId: string): Promise<FileReview[]> {
    console.log('getFileReviews placeholder for fileId:', fileId);
    return [];
  },

  async getFileComments(fileId: string): Promise<FileComment[]> {
    console.log('getFileComments placeholder for fileId:', fileId);
    return [];
  },

  async createFileReview(fileId: string, status: FileReview['status'], feedback?: string): Promise<FileReview> {
    console.log('createFileReview placeholder:', { fileId, status, feedback });
    return {
      id: 'placeholder',
      file_id: fileId,
      reviewer_id: 'placeholder',
      status,
      feedback,
      created_at: new Date().toISOString()
    };
  },

  async createFileComment(fileId: string, content: string): Promise<FileComment> {
    console.log('createFileComment placeholder:', { fileId, content });
    return {
      id: 'placeholder',
      file_id: fileId,
      content,
      created_at: new Date().toISOString()
    };
  },

  // Placeholder methods for file status restrictions
  async getFileStatusRestrictions(projectId: string): Promise<FileStatusRestriction[]> {
    console.log('getFileStatusRestrictions placeholder for projectId:', projectId);
    return [];
  },

  async createFileStatusRestriction(
    projectId: string,
    status: string,
    allowedFileTypes: string[],
    maxFileSize?: number,
    maxFiles?: number
  ): Promise<FileStatusRestriction> {
    console.log('createFileStatusRestriction placeholder:', { projectId, status, allowedFileTypes, maxFileSize, maxFiles });
    return {
      id: 'placeholder',
      project_id: projectId,
      status,
      allowed_file_types: allowedFileTypes,
      max_file_size: maxFileSize,
      max_files_per_submission: maxFiles
    };
  },

  async deleteFileStatusRestriction(id: string): Promise<void> {
    console.log('deleteFileStatusRestriction placeholder for id:', id);
  },

  // Additional placeholder methods that components expect
  async validateFile(projectId: string, versionId: string, file: File): Promise<{ isValid: boolean; error?: string }> {
    console.log('validateFile placeholder:', { projectId, versionId, fileName: file.name });
    return { isValid: true };
  },

  async uploadFileVersion(
    projectId: string,
    versionId: string,
    file: File,
    changeDescription: string,
    accessLevel: string
  ): Promise<FileVersion> {
    console.log('uploadFileVersion placeholder:', { projectId, versionId, fileName: file.name, changeDescription, accessLevel });
    
    // Simulate file upload
    const fileUrl = await this.uploadFile(file, projectId);
    
    return this.createFileVersion({
      file_name: file.name,
      file_url: fileUrl,
      file_type: file.type,
      file_size: file.size,
      version_id: versionId
    });
  }
};
