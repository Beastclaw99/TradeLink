import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { fileService, FileStatusRestriction } from '@/services/fileService';
import { Plus, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { formatFileSize } from '@/lib/utils';

interface FileStatusRestrictionsProps {
  projectId: string;
}

const FileStatusRestrictions: React.FC<FileStatusRestrictionsProps> = ({
  projectId
}) => {
  const [restrictions, setRestrictions] = useState<FileStatusRestriction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newStatus, setNewStatus] = useState('');
  const [newFileTypes, setNewFileTypes] = useState('');
  const [newMaxSize, setNewMaxSize] = useState('');
  const [newMaxFiles, setNewMaxFiles] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchRestrictions();
  }, [projectId]);

  const fetchRestrictions = async () => {
    try {
      const data = await fileService.getFileStatusRestrictions(projectId);
      setRestrictions(data);
    } catch (error) {
      console.error('Error fetching restrictions:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch file status restrictions.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRestriction = async () => {
    if (!newStatus.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a status.',
        variant: 'destructive'
      });
      return;
    }

    const fileTypes = newFileTypes
      .split(',')
      .map(type => type.trim())
      .filter(type => type);

    try {
      await fileService.createFileStatusRestriction(
        projectId,
        newStatus,
        fileTypes,
        newMaxSize ? parseInt(newMaxSize) : null,
        newMaxFiles ? parseInt(newMaxFiles) : null
      );

      setNewStatus('');
      setNewFileTypes('');
      setNewMaxSize('');
      setNewMaxFiles('');
      fetchRestrictions();

      toast({
        title: 'Success',
        description: 'File status restriction added successfully.'
      });
    } catch (error) {
      console.error('Error adding restriction:', error);
      toast({
        title: 'Error',
        description: 'Failed to add file status restriction.',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteRestriction = async (id: string) => {
    try {
      await fileService.deleteFileStatusRestriction(id);
      fetchRestrictions();
      toast({
        title: 'Success',
        description: 'File status restriction deleted successfully.'
      });
    } catch (error) {
      console.error('Error deleting restriction:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete file status restriction.',
        variant: 'destructive'
      });
    }
  };

  if (isLoading) {
    return <div>Loading restrictions...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Add New Restriction</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Input
              id="status"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              placeholder="Enter status name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fileTypes">Allowed File Types (comma-separated)</Label>
            <Input
              id="fileTypes"
              value={newFileTypes}
              onChange={(e) => setNewFileTypes(e.target.value)}
              placeholder="e.g., pdf, doc, docx"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxSize">Maximum File Size (bytes)</Label>
            <Input
              id="maxSize"
              type="number"
              value={newMaxSize}
              onChange={(e) => setNewMaxSize(e.target.value)}
              placeholder="e.g., 10485760 for 10MB"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxFiles">Maximum Files per Submission</Label>
            <Input
              id="maxFiles"
              type="number"
              value={newMaxFiles}
              onChange={(e) => setNewMaxFiles(e.target.value)}
              placeholder="e.g., 5"
            />
          </div>
        </div>
        <Button onClick={handleAddRestriction}>
          <Plus className="h-4 w-4 mr-2" />
          Add Restriction
        </Button>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Current Restrictions</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Allowed File Types</TableHead>
              <TableHead>Max File Size</TableHead>
              <TableHead>Max Files</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {restrictions.map((restriction) => (
              <TableRow key={restriction.id}>
                <TableCell>{restriction.status}</TableCell>
                <TableCell>
                  {restriction.allowed_file_types.join(', ') || 'Any'}
                </TableCell>
                <TableCell>
                  {restriction.max_file_size
                    ? formatFileSize(restriction.max_file_size)
                    : 'No limit'}
                </TableCell>
                <TableCell>
                  {restriction.max_files_per_submission || 'No limit'}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteRestriction(restriction.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FileStatusRestrictions; 