import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, MoreVertical, Trash2, User, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { getFileIcon, formatFileSize } from '@/utils/fileUtils';

interface FileListItemProps {
  file: {
    id: string;
    name: string;
    type: string;
    size: number;
    uploadedBy: {
      id: string;
      name: string;
      avatar?: string;
    };
    uploadedAt: string;
    tags: string[];
  };
  isAdmin: boolean;
  isProcessing: boolean;
  onDownload: (fileId: string) => void;
  onDelete: (fileId: string) => void;
}

const FileListItem: React.FC<FileListItemProps> = ({
  file,
  isAdmin,
  isProcessing,
  onDownload,
  onDelete
}) => {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-gray-100 rounded-lg">
          {getFileIcon(file.type)}
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{file.name}</span>
            <Badge variant="outline" className="text-xs">
              {formatFileSize(file.size)}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{file.uploadedBy.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>
                {formatDistanceToNow(new Date(file.uploadedAt), { addSuffix: true })}
              </span>
            </div>
          </div>
          {file.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {file.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDownload(file.id)}
          disabled={isProcessing}
        >
          <Download className="h-4 w-4" />
        </Button>
        {isAdmin && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDownload(file.id)}
                disabled={isProcessing}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(file.id)}
                disabled={isProcessing}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default FileListItem; 