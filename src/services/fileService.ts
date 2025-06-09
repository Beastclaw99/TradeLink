
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
  created_at: string;
}

export interface FileComment {
  id: string;
  file_id: string;
  user_id: string;
  comment: string;
  created_at: string;
}

export interface FileStatusRestriction {
  id: string;
  file_id: string;
  status: string;
  allowed_actions: string[];
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
    const { data, error } = await supabase
      .from('file_versions')
      .select('*')
      .eq('id', versionId);

    if (error) throw error;
    return data || [];
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
    const { data, error } = await supabase
      .from('file_versions')
      .insert(fileData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteFile(fileId: string): Promise<void> {
    const { error } = await supabase
      .from('file_versions')
      .delete()
      .eq('id', fileId);

    if (error) throw error;
  },

  async getFileReviews(fileId: string): Promise<FileReview[]> {
    const { data, error } = await supabase
      .from('file_reviews')
      .select('*')
      .eq('file_id', fileId);

    if (error) throw error;
    return data || [];
  },

  async getFileComments(fileId: string): Promise<FileComment[]> {
    const { data, error } = await supabase
      .from('file_comments')
      .select('*')
      .eq('file_id', fileId);

    if (error) throw error;
    return data || [];
  },

  async createFileReview(reviewData: Omit<FileReview, 'id' | 'created_at'>): Promise<FileReview> {
    const { data, error } = await supabase
      .from('file_reviews')
      .insert(reviewData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async createFileComment(commentData: Omit<FileComment, 'id' | 'created_at'>): Promise<FileComment> {
    const { data, error } = await supabase
      .from('file_comments')
      .insert(commentData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getFileStatusRestrictions(fileId: string): Promise<FileStatusRestriction[]> {
    const { data, error } = await supabase
      .from('file_status_restrictions')
      .select('*')
      .eq('file_id', fileId);

    if (error) throw error;
    return data || [];
  },

  async createFileStatusRestriction(restrictionData: Omit<FileStatusRestriction, 'id' | 'created_at'>): Promise<FileStatusRestriction> {
    const { data, error } = await supabase
      .from('file_status_restrictions')
      .insert(restrictionData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteFileStatusRestriction(id: string): Promise<void> {
    const { error } = await supabase
      .from('file_status_restrictions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async validateFile(file: File): Promise<boolean> {
    // Add file validation logic here
    return file.size <= 10 * 1024 * 1024; // 10MB limit
  },

  async uploadFileVersion(file: File, projectId: string, versionData: any): Promise<FileVersion> {
    const fileUrl = await this.uploadFile(file, projectId);
    return this.createFileVersion({
      file_name: file.name,
      file_size: file.size,
      file_type: file.type,
      file_url: fileUrl,
      project_id: projectId,
      uploaded_by: versionData.uploaded_by,
      access_level: versionData.access_level,
      version_number: versionData.version_number,
      change_description: versionData.change_description,
      metadata: versionData.metadata
    });
  }
};
