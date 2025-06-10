
import { supabase } from '@/integrations/supabase/client';
import { notificationService } from './notificationService';

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
  metadata: Record<string, any>;
  created_at: string;
}

export interface FileReview {
  id: string;
  file_id: string;
  reviewer_id: string;
  status: 'pending' | 'approved' | 'rejected';
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

export const fileService = {
  // Upload a new file version - simplified implementation
  async uploadFileVersion(
    projectId: string,
    versionId: string,
    file: File,
    changeDescription: string,
    accessLevel: FileVersion['access_level'] = 'private',
    metadata: Record<string, any> = {}
  ): Promise<any> {
    // Upload file to storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `project-files/${projectId}/${versionId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('project-files')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('project-files')
      .getPublicUrl(filePath);

    // Create file version record using existing work_version_files table
    const { data: fileVersion, error: insertError } = await supabase
      .from('work_version_files')
      .insert({
        version_id: versionId,
        file_name: file.name,
        file_url: publicUrl,
        file_type: file.type,
        file_size: file.size
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return fileVersion;
  },

  // Get file versions - simplified
  async getFileVersions(versionId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('work_version_files')
      .select('*')
      .eq('version_id', versionId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Placeholder functions for file reviews and comments
  // These would need proper database tables to be implemented
  async getFileReviews(fileId: string): Promise<FileReview[]> {
    console.warn('File reviews functionality requires database migration');
    return [];
  },

  async createFileReview(
    fileId: string,
    status: FileReview['status'],
    feedback: string | null = null
  ): Promise<any> {
    console.warn('File reviews functionality requires database migration');
    return null;
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
