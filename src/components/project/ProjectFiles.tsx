import React, { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useProject } from '@/hooks/useProject';
import { useAuth } from '@/hooks/useAuth';
import FileListItem from './FileListItem';
import FileUpload from './FileUpload';
import FileFilters from './FileFilters';
import { sortFiles, filterFiles } from '@/utils/fileUtils';

interface ProjectFilesProps {
  projectId: string;
  className?: string;
}

const ProjectFiles: React.FC<ProjectFilesProps> = ({
  projectId,
  className
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { project, isLoading, error, uploadFile, deleteFile, downloadFile } = useProject(projectId);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');

  const handleFileSelect = useCallback(async (files: File[]) => {
    if (!files.length) return;

    setIsProcessing(true);
    try {
      await uploadFile(files);
      toast({
        title: "Success",
        description: "Files uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload files",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [uploadFile, toast]);

  const handleDelete = useCallback(async (fileId: string) => {
    setIsProcessing(true);
    try {
      await deleteFile(fileId);
      toast({
        title: "Success",
        description: "File deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [deleteFile, toast]);

  const handleDownload = useCallback(async (fileId: string) => {
    setIsProcessing(true);
    try {
      await downloadFile(fileId);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [downloadFile, toast]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const filteredFiles = filterFiles(project?.files || [], searchQuery);
  const sortedFiles = sortFiles(filteredFiles, sortBy);

  return (
    <div className={`space-y-6 ${className}`}>
      <FileUpload
        onFileSelect={handleFileSelect}
        isProcessing={isProcessing}
      />
      
      <FileFilters
        searchQuery={searchQuery}
        sortBy={sortBy}
        onSearchChange={setSearchQuery}
        onSortChange={setSortBy}
      />

          <div className="space-y-4">
        {sortedFiles.map((file) => (
          <FileListItem
                key={file.id}
            file={file}
            isAdmin={user?.role === 'admin'}
            isProcessing={isProcessing}
            onDownload={handleDownload}
            onDelete={handleDelete}
          />
        ))}
        {sortedFiles.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No files found
                      </div>
                    )}
                  </div>
                </div>
  );
};

export default ProjectFiles; 