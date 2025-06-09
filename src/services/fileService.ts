
import { supabase } from "@/integrations/supabase/client";

export interface FileVersion {
  id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  file_url: string;
  created_at: string;
  updated_at: string;
  project_id: string;
  uploaded_by: string;
  access_level?: string;
  version_number?: number;
  change_description?: string;
  metadata?: any;
}

export interface FileReview {
  id: string;
  file_id: string;
  reviewer_id: string;
  review_type: string;
  status: string;
  comments: string;
  feedback?: string;
  created_at: string;
}

export interface FileComment {
  id: string;
  file_id: string;
  user_id: string;
  comment: string;
  content?: string;
  created_at: string;
}

export interface FileStatusRestriction {
  id: string;
  file_id: string;
  status: string;
  allowed_actions: string[];
  allowed_file_types?: string[];
  max_file_size?: number;
  max_files_per_submission?: number;
  created_at: string;
}

export const fileService = {
  async uploadFile(file: File, projectId: string): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${projectId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('project-files')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('project-files')
      .getPublicUrl(filePath);

    return publicUrl;
  },

  async getFileVersions(versionId: string): Promise<FileVersion[]> {
    // Since file_versions table doesn't exist, return empty array for now
    console.warn('file_versions table not found, returning empty array');
    return [];
  },

  async createFileVersion(fileData: {
    file_name: string;
    file_size: number;
    file_type: string;
    file_url: string;
    project_id: string;
    uploaded_by: string;
    access_level?: string;
    version_number?: number;
    change_description?: string;
    metadata?: any;
  }): Promise<FileVersion> {
    // Mock implementation since table doesn't exist
    const mockFileVersion: FileVersion = {
      id: crypto.randomUUID(),
      ...fileData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return mockFileVersion;
  },

  async deleteFile(fileId: string): Promise<void> {
    // Mock implementation
    console.warn('deleteFile not implemented - table not found');
  },

  async getFileReviews(fileId: string): Promise<FileReview[]> {
    // Mock implementation since table doesn't exist
    console.warn('file_reviews table not found, returning empty array');
    return [];
  },

  async getFileComments(fileId: string): Promise<FileComment[]> {
    // Mock implementation since table doesn't exist
    console.warn('file_comments table not found, returning empty array');
    return [];
  },

  async createFileReview(fileId: string, status: string, feedback?: string): Promise<FileReview> {
    // Mock implementation
    const mockReview: FileReview = {
      id: crypto.randomUUID(),
      file_id: fileId,
      reviewer_id: 'mock-user',
      review_type: 'standard',
      status,
      comments: feedback || '',
      feedback,
      created_at: new Date().toISOString(),
    };
    return mockReview;
  },

  async createFileComment(fileId: string, comment: string): Promise<FileComment> {
    // Mock implementation
    const mockComment: FileComment = {
      id: crypto.randomUUID(),
      file_id: fileId,
      user_id: 'mock-user',
      comment,
      content: comment,
      created_at: new Date().toISOString(),
    };
    return mockComment;
  },

  async getFileStatusRestrictions(fileId: string): Promise<FileStatusRestriction[]> {
    // Mock implementation since table doesn't exist
    console.warn('file_status_restrictions table not found, returning empty array');
    return [];
  },

  async createFileStatusRestriction(
    fileId: string,
    status: string,
    allowedFileTypes: string[],
    maxFileSize: number | null,
    maxFilesPerSubmission: number | null
  ): Promise<FileStatusRestriction> {
    // Mock implementation
    const mockRestriction: FileStatusRestriction = {
      id: crypto.randomUUID(),
      file_id: fileId,
      status,
      allowed_actions: ['upload', 'download'],
      allowed_file_types: allowedFileTypes,
      max_file_size: maxFileSize || undefined,
      max_files_per_submission: maxFilesPerSubmission || undefined,
      created_at: new Date().toISOString(),
    };
    return mockRestriction;
  },

  async deleteFileStatusRestriction(id: string): Promise<void> {
    // Mock implementation
    console.warn('deleteFileStatusRestriction not implemented - table not found');
  },

  async validateFile(projectId: string, versionId: string, file: File): Promise<{ isValid: boolean; error?: string }> {
    // Add file validation logic here
    const isValid = file.size <= 10 * 1024 * 1024; // 10MB limit
    return { 
      isValid, 
      error: isValid ? undefined : 'File size exceeds 10MB limit' 
    };
  },

  async uploadFileVersion(
    projectId: string,
    versionId: string,
    file: File,
    changeDescription: string,
    accessLevel: string
  ): Promise<FileVersion> {
    const fileUrl = await this.uploadFile(file, projectId);
    return this.createFileVersion({
      file_name: file.name,
      file_size: file.size,
      file_type: file.type,
      file_url: fileUrl,
      project_id: projectId,
      uploaded_by: 'current-user',
      access_level: accessLevel,
      version_number: 1,
      change_description: changeDescription,
      metadata: { versionId }
    });
  }
};
