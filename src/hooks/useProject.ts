import { useState, useCallback, useEffect } from 'react';
import { ProjectFile } from '@/utils/fileUtils';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

interface Project extends Tables<'projects'> {
  files: ProjectFile[];
}

interface UseProjectReturn {
  project: Project | null;
  isLoading: boolean;
  error: Error | null;
  uploadFile: (files: File[]) => Promise<void>;
  deleteFile: (fileId: string) => Promise<void>;
  downloadFile: (fileId: string) => Promise<void>;
}

const transformProjectData = (data: any): Project => {
  // Transform project_updates into files array
  const files: ProjectFile[] = data.project_updates
    ?.filter((update: any) => update.update_type === 'file_upload')
    .map((update: any) => ({
      id: update.id,
      name: update.file_url.split('/').pop() || '',
      url: update.file_url,
      type: update.file_url.split('.').pop() || '',
      size: 0, // We don't store file size in the database
      uploadedAt: update.created_at,
      uploadedBy: update.user_id
    })) || [];

  return {
    ...data,
    files
  };
};

export const useProject = (projectId: string): UseProjectReturn => {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const uploadFile = useCallback(async (files: File[]) => {
    try {
      // Upload files to Supabase Storage
      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `projects/${projectId}/files/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('project-files')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Create file record in project_updates table
        const { error: dbError } = await supabase
          .from('project_updates')
          .insert({
            project_id: projectId,
            update_type: 'file_upload',
            file_url: filePath,
            message: `Uploaded ${file.name}`
          });

        if (dbError) throw dbError;
      });

      await Promise.all(uploadPromises);
      
      // Refresh project data
      const { data, error: fetchError } = await supabase
        .from('projects')
        .select('*, project_updates(*)')
        .eq('id', projectId)
        .single();

      if (fetchError) throw fetchError;
      setProject(transformProjectData(data));
    } catch (err) {
      throw new Error('Failed to upload files');
    }
  }, [projectId]);

  const deleteFile = useCallback(async (fileId: string) => {
    try {
      // Get file URL from project_updates
      const { data: fileData, error: fetchError } = await supabase
        .from('project_updates')
        .select('file_url')
        .eq('id', fileId)
        .single();

      if (fetchError) throw fetchError;

      // Delete file from storage
      if (fileData?.file_url) {
        const { error: storageError } = await supabase.storage
          .from('project-files')
          .remove([fileData.file_url]);

        if (storageError) throw storageError;
      }

      // Delete file record
      const { error: deleteError } = await supabase
        .from('project_updates')
        .delete()
        .eq('id', fileId);

      if (deleteError) throw deleteError;

      // Refresh project data
      const { data, error: refreshError } = await supabase
        .from('projects')
        .select('*, project_updates(*)')
        .eq('id', projectId)
        .single();

      if (refreshError) throw refreshError;
      setProject(transformProjectData(data));
    } catch (err) {
      throw new Error('Failed to delete file');
    }
  }, [projectId]);

  const downloadFile = useCallback(async (fileId: string) => {
    try {
      // Get file URL from project_updates
      const { data: fileData, error: fetchError } = await supabase
        .from('project_updates')
        .select('file_url')
        .eq('id', fileId)
        .single();

      if (fetchError) throw fetchError;

      if (fileData?.file_url) {
        const { data, error: downloadError } = await supabase.storage
          .from('project-files')
          .download(fileData.file_url);

        if (downloadError) throw downloadError;

        // Create download link
        const url = URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileData.file_url.split('/').pop() || 'file';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      throw new Error('Failed to download file');
    }
  }, []);

  // Load project data
  useEffect(() => {
    const loadProject = async () => {
      try {
        setIsLoading(true);
        const { data, error: fetchError } = await supabase
          .from('projects')
          .select('*, project_updates(*)')
          .eq('id', projectId)
          .single();

        if (fetchError) throw fetchError;
        setProject(transformProjectData(data));
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load project'));
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, [projectId]);

  return {
    project,
    isLoading,
    error,
    uploadFile,
    deleteFile,
    downloadFile
  };
}; 