
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
  }
};
