import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { fileService, FileVersion } from '@/services/fileService';
import { Upload, File, AlertCircle } from 'lucide-react';
import { formatFileSize } from '@/lib/utils';

interface FileUploadProps {
  projectId: string;
  versionId: string;
  onUploadComplete: (file: FileVersion) => void;
  allowedFileTypes?: string[];
  maxFileSize?: number;
}

const FileUpload: React.FC<FileUploadProps> = ({
  projectId,
  versionId,
  onUploadComplete,
  allowedFileTypes,
  maxFileSize
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [changeDescription, setChangeDescription] = useState('');
  const [accessLevel, setAccessLevel] = useState<FileVersion['access_level']>('private');
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];

    // Validate file type
    if (allowedFileTypes && !allowedFileTypes.includes(file.type)) {
      toast({
        title: 'Invalid File Type',
        description: `Only ${allowedFileTypes.join(', ')} files are allowed.`,
        variant: 'destructive'
      });
      return;
    }

    // Validate file size
    if (maxFileSize && file.size > maxFileSize) {
      toast({
        title: 'File Too Large',
        description: `Maximum file size is ${formatFileSize(maxFileSize)}.`,
        variant: 'destructive'
      });
      return;
    }

    setIsUploading(true);
    try {
      const validation = await fileService.validateFile(projectId, versionId, file);
      if (!validation.isValid) {
        toast({
          title: 'Validation Error',
          description: validation.error,
          variant: 'destructive'
        });
        return;
      }

      const uploadedFile = await fileService.uploadFileVersion(
        projectId,
        versionId,
        file,
        changeDescription,
        accessLevel
      );

      onUploadComplete(uploadedFile);
      setChangeDescription('');
      toast({
        title: 'Upload Successful',
        description: 'File has been uploaded successfully.'
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload file. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  }, [projectId, versionId, changeDescription, accessLevel, allowedFileTypes, maxFileSize, toast, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    disabled: isUploading
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <Upload className="h-8 w-8 text-gray-400" />
          {isDragActive ? (
            <p className="text-sm text-gray-600">Drop the file here...</p>
          ) : (
            <p className="text-sm text-gray-600">
              Drag and drop a file here, or click to select a file
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="changeDescription">Change Description</Label>
          <Input
            id="changeDescription"
            value={changeDescription}
            onChange={(e) => setChangeDescription(e.target.value)}
            placeholder="Describe the changes in this version..."
            disabled={isUploading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="accessLevel">Access Level</Label>
          <Select
            value={accessLevel}
            onValueChange={(value: FileVersion['access_level']) => setAccessLevel(value)}
            disabled={isUploading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select access level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="project_members">Project Members</SelectItem>
              <SelectItem value="public">Public</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {allowedFileTypes && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <AlertCircle className="h-4 w-4" />
            <span>Allowed file types: {allowedFileTypes.join(', ')}</span>
          </div>
        )}

        {maxFileSize && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <AlertCircle className="h-4 w-4" />
            <span>Maximum file size: {formatFileSize(maxFileSize)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload; 