import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { fileService, FileVersion } from '@/services/fileService';
import { format } from 'date-fns';
import { Download, History, Eye, Lock } from 'lucide-react';
import { formatFileSize } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';

interface FileVersionsProps {
  versionId: string;
}

const FileVersions: React.FC<FileVersionsProps> = ({ versionId }) => {
  const [versions, setVersions] = useState<FileVersion[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<FileVersion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchVersions();
  }, [versionId]);

  const fetchVersions = async () => {
    try {
      const data = await fileService.getFileVersions(versionId);
      setVersions(data);
    } catch (error) {
      console.error('Error fetching versions:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch file versions.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (version: FileVersion) => {
    try {
      const response = await fetch(version.file_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = version.file_name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: 'Error',
        description: 'Failed to download file.',
        variant: 'destructive'
      });
    }
  };

  const getAccessLevelIcon = (accessLevel: FileVersion['access_level']) => {
    switch (accessLevel) {
      case 'private':
        return <Lock className="h-4 w-4 text-gray-500" />;
      case 'project_members':
        return <Eye className="h-4 w-4 text-blue-500" />;
      case 'public':
        return <Eye className="h-4 w-4 text-green-500" />;
    }
  };

  if (isLoading) {
    return <div>Loading versions...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">File Versions</h3>
        <Button variant="outline" size="sm" onClick={() => fetchVersions()}>
          <History className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Version</TableHead>
            <TableHead>File Name</TableHead>
            <TableHead>Uploaded</TableHead>
            <TableHead>Access</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {versions.map((version) => (
            <TableRow key={version.id}>
              <TableCell>v{version.version_number}</TableCell>
              <TableCell>{version.file_name}</TableCell>
              <TableCell>
                {format(new Date(version.created_at), 'PPP')}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getAccessLevelIcon(version.access_level)}
                  <span className="capitalize">{version.access_level}</span>
                </div>
              </TableCell>
              <TableCell>
                {version.file_size ? formatFileSize(version.file_size) : 'N/A'}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(version)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedVersion(version)}
                      >
                        <History className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          Version {version.version_number} Details
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium">Change Description</h4>
                          <p className="text-sm text-gray-600">
                            {version.change_description || 'No description provided'}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium">Metadata</h4>
                          <pre className="text-sm bg-gray-50 p-2 rounded">
                            {JSON.stringify(version.metadata, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FileVersions; 