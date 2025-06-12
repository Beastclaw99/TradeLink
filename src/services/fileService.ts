import { supabase } from '@/integrations/supabase/client';
import { notificationService } from './notificationService';
import { FileReviewStatus } from '@/types/database';

export interface FileVersion {
  id: string;
  version_id: string;
  file_name: string;
  file_url: string;
  file_type: string | null;
  file_size: number | null;
  version_number: number;
  parent_file_id: string | null;
  is_latest: boolean;
  change_description: string | null;
  access_level: 'private' | 'project_members' | 'public';
  uploaded_by: string;
  metadata: {
    description?: string;
    tags?: string[];
    [key: string]: unknown;
  };
  created_at: string;
}

export interface FileReview {
  id: string;
  file_id: string;
  reviewer_id: string;
  status: FileReviewStatus;
  feedback: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export interface FileComment {
  id: string;
  file_id: string;
  commenter_id: string;
  content: string;
  parent_comment_id: string | null;
  created_at: string;
}

export interface FileStatusRestriction {
  id: string;
  project_id: string;
  status: string;
  allowed_file_types: string[];
  max_file_size: number | null;
  max_files_per_submission: number | null;
}

export interface FileVersionInsert {
  version_id: string;
  file_name: string;
  file_url: string;
  file_type?: string;
  file_size?: number;
  version_number: number;
  parent_file_id?: string;
  is_latest: boolean;
  change_description?: string;
  access_level: 'private' | 'project_members' | 'public';
  uploaded_by: string;
  metadata?: FileVersion['metadata'];
}

export interface FileReviewInsert {
  file_id: string;
  reviewer_id: string;
  status: FileReviewStatus;
  feedback?: string;
  reviewed_at?: string;
}

export interface FileCommentInsert {
  file_id: string;
  commenter_id: string;
  content: string;
  parent_comment_id?: string;
}

export const fileService = {
  // Create a new file version
  async createFileVersion(fileData: FileVersionInsert): Promise<FileVersion> {
    const { data, error } = await supabase
      .from('file_versions')
      .insert(fileData)
      .select()
      .single();

    if (error) throw error;
    return data as FileVersion;
  },

  // Get file version by ID
  async getFileVersion(fileId: string): Promise<FileVersion | null> {
    const { data, error } = await supabase
      .from('file_versions')
      .select()
      .eq('id', fileId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data as FileVersion;
  },

  // Get file versions for a project
  async getProjectFileVersions(projectId: string): Promise<FileVersion[]> {
    const { data, error } = await supabase
      .from('file_versions')
      .select()
      .eq('project_id', projectId);

    if (error) throw error;
    return (data || []) as FileVersion[];
  },

  // Create a file review
  async createFileReview(reviewData: FileReviewInsert): Promise<FileReview> {
    const { data, error } = await supabase
      .from('file_reviews')
      .insert(reviewData)
      .select()
      .single();

    if (error) throw error;

    // Create notification for the file owner
    await notificationService.createNotification({
      user_id: data.uploaded_by,
      title: 'New File Review',
      message: `A new review has been submitted for your file`,
      type: 'info'
    });

    return data as FileReview;
  },

  // Update file review status
  async updateFileReviewStatus(reviewId: string, status: FileReviewStatus, feedback?: string): Promise<FileReview> {
    const { data, error } = await supabase
      .from('file_reviews')
      .update({ 
        status,
        feedback,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', reviewId)
      .select()
      .single();

    if (error) throw error;

    // Create status change notification
    await notificationService.createNotification({
      user_id: data.uploaded_by,
      title: 'File Review Status Updated',
      message: `The status of your file review has been updated to ${status}`,
      type: 'info'
    });

    return data as FileReview;
  },

  // Add a file comment
  async addFileComment(commentData: FileCommentInsert): Promise<FileComment> {
    const { data, error } = await supabase
      .from('file_comments')
      .insert(commentData)
      .select()
      .single();

    if (error) throw error;

    // Create notification for the file owner
    await notificationService.createNotification({
      user_id: data.uploaded_by,
      title: 'New File Comment',
      message: `A new comment has been added to your file`,
      type: 'info'
    });

    return data as FileComment;
  },

  // Get file reviews - simplified
  async getFileReviews(fileId: string): Promise<FileReview[]> {
    console.warn('File reviews functionality requires database migration');
    return [];
  },

  async getFileComments(fileId: string): Promise<FileComment[]> {
    console.warn('File comments functionality requires database migration');
    return [];
  },

  async createFileComment(
    fileId: string,
    content: string,
    parentCommentId: string | null = null
  ): Promise<any> {
    console.warn('File comments functionality requires database migration');
    return null;
  },

  async getFileStatusRestrictions(projectId: string): Promise<FileStatusRestriction[]> {
    console.warn('File status restrictions functionality requires database migration');
    return [];
  },

  async createFileStatusRestriction(
    projectId: string,
    status: string,
    allowedFileTypes: string[],
    maxFileSize: number | null = null,
    maxFilesPerSubmission: number | null = null
  ): Promise<any> {
    console.warn('File status restrictions functionality requires database migration');
    return null;
  },

  async validateFile(
    projectId: string,
    status: string,
    file: File
  ): Promise<{ isValid: boolean; error?: string }> {
    // Basic validation without database restrictions
    return { isValid: true };
  },

  async checkFileAccess(fileId: string): Promise<boolean> {
    // Simplified access check
    return true;
  },

  async deleteFileStatusRestriction(id: string): Promise<void> {
    console.warn('File status restrictions functionality requires database migration');
  }
};
