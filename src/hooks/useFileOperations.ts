import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";

interface FileOperationsProps {
  onUploadFile: (file: File) => Promise<void>;
  onDeleteFile: (fileId: string) => Promise<void>;
  onDownloadFile: (fileId: string) => Promise<void>;
}

export const useFileOperations = ({
  onUploadFile,
  onDeleteFile,
  onDownloadFile
}: FileOperationsProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      await onUploadFile(selectedFile);
      setSelectedFile(null);
      toast({
        title: "Success",
        description: "File uploaded successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (fileId: string) => {
    setIsProcessing(true);
    try {
      await onDeleteFile(fileId);
      toast({
        title: "Success",
        description: "File deleted successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async (fileId: string) => {
    setIsProcessing(true);
    try {
      await onDownloadFile(fileId);
      toast({
        title: "Success",
        description: "File download started."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isUploading,
    isProcessing,
    selectedFile,
    handleFileSelect,
    handleUpload,
    handleDelete,
    handleDownload
  };
}; 