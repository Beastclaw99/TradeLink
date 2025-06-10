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
  // Upload a new file version
  async uploadFileVersion(
    projectId: string,
    versionId: string,
    file: File,
    changeDescription: string,
    accessLevel: FileVersion['access_level'] = 'private',
    metadata: Record<string, any> = {}
  ): Promise<FileVersion> {
    // Get current version number
    const { data: currentVersion, error: versionError } = await supabase
      .from('work_version_files')
      .select('version_number')
      .eq('version_id', versionId)
      .order('version_number', { ascending: false })
      .limit(1)
      .single();

    if (versionError && versionError.code !== 'PGRST116') throw versionError;

    const versionNumber = currentVersion ? currentVersion.version_number + 1 : 1;

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

    // Create file version record
    const { data: fileVersion, error: insertError } = await supabase
      .from('work_version_files')
      .insert({
        version_id: versionId,
        file_name: file.name,
        file_url: publicUrl,
        file_type: file.type,
        file_size: file.size,
        version_number: versionNumber,
        change_description: changeDescription,
        access_level: accessLevel,
        uploaded_by: (await supabase.auth.getUser()).data.user?.id,
        metadata
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // Mark previous version as not latest
    if (versionNumber > 1) {
      const { error: updateError } = await supabase
        .from('work_version_files')
        .update({ is_latest: false })
        .eq('version_id', versionId)
        .eq('version_number', versionNumber - 1);

      if (updateError) throw updateError;
    }

    return fileVersion;
  },

  // Get file versions
  async getFileVersions(versionId: string): Promise<FileVersion[]> {
    const { data, error } = await supabase
      .from('work_version_files')
      .select('*')
      .eq('version_id', versionId)
      .order('version_number', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get file reviews
  async getFileReviews(fileId: string): Promise<FileReview[]> {
    const { data, error } = await supabase
      .from('file_reviews')
      .select('*')
      .eq('file_id', fileId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Create file review
  async createFileReview(
    fileId: string,
    status: FileReview['status'],
    feedback: string | null = null
  ): Promise<FileReview> {
    const { data, error } = await supabase
      .from('file_reviews')
      .insert({
        file_id: fileId,
        reviewer_id: (await supabase.auth.getUser()).data.user?.id,
        status,
        feedback,
        reviewed_at: status !== 'pending' ? new Date().toISOString() : null
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get file comments
  async getFileComments(fileId: string): Promise<FileComment[]> {
    const { data, error } = await supabase
      .from('file_comments')
      .select('*')
      .eq('file_id', fileId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Create file comment
  async createFileComment(
    fileId: string,
    content: string,
    parentCommentId: string | null = null
  ): Promise<FileComment> {
    const { data, error } = await supabase
      .from('file_comments')
      .insert({
        file_id: fileId,
        commenter_id: (await supabase.auth.getUser()).data.user?.id,
        content,
        parent_comment_id: parentCommentId
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get file status restrictions
  async getFileStatusRestrictions(projectId: string): Promise<FileStatusRestriction[]> {
    const { data, error } = await supabase
      .from('file_status_restrictions')
      .select('*')
      .eq('project_id', projectId);

    if (error) throw error;
    return data;
  },

  // Create file status restriction
  async createFileStatusRestriction(
    projectId: string,
    status: string,
    allowedFileTypes: string[],
    maxFileSize: number | null = null,
    maxFilesPerSubmission: number | null = null
  ): Promise<FileStatusRestriction> {
    const { data, error } = await supabase
      .from('file_status_restrictions')
      .insert({
        project_id: projectId,
        status,
        allowed_file_types: allowedFileTypes,
        max_file_size: maxFileSize,
        max_files_per_submission: maxFilesPerSubmission
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Validate file against restrictions
  async validateFile(
    projectId: string,
    status: string,
    file: File
  ): Promise<{ isValid: boolean; error?: string }> {
    const restrictions = await this.getFileStatusRestrictions(projectId);
    const restriction = restrictions.find(r => r.status === status);

    if (!restriction) return { isValid: true };

    // Check file type
    if (restriction.allowed_file_types.length > 0) {
      const fileType = file.type.split('/')[1];
      if (!restriction.allowed_file_types.includes(fileType)) {
        return {
          isValid: false,
          error: `File type ${fileType} is not allowed. Allowed types: ${restriction.allowed_file_types.join(', ')}`
        };
      }
    }

    // Check file size
    if (restriction.max_file_size && file.size > restriction.max_file_size) {
      return {
        isValid: false,
        error: `File size exceeds maximum allowed size of ${restriction.max_file_size} bytes`
      };
    }

    return { isValid: true };
  },

  // Check if user has access to file
  async checkFileAccess(fileId: string): Promise<boolean> {
    const { data: file, error } = await supabase
      .from('work_version_files')
      .select('access_level, version_id')
      .eq('id', fileId)
      .single();

    if (error) throw error;

    if (file.access_level === 'public') return true;

    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return false;

    if (file.access_level === 'project_members') {
      const { data: isMember } = await supabase
        .from('project_members')
        .select('id')
        .eq('project_id', file.version_id)
        .eq('user_id', user.user.id)
        .single();

      return !!isMember;
    }

    return false;
  },

  // Delete file status restriction
  async deleteFileStatusRestriction(id: string): Promise<void> {
    const { error } = await supabase
      .from('file_status_restrictions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}; 