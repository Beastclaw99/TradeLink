import {
  FileText,
  Image,
  Video,
  Music,
  Archive,
  Code,
  FileType,
  Folder
} from 'lucide-react';
import React from 'react';

export interface ProjectFile {
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
  lastModified?: string;
  downloadUrl: string;
  thumbnailUrl?: string;
  tags: string[];
}

const iconMap = {
  image: Image,
  video: Video,
  audio: Music,
  archive: Archive,
  code: Code,
  document: FileText,
  folder: Folder,
  other: FileType
} as const;

export const getFileIcon = (type: string): React.ReactNode => {
  const Icon = iconMap[type as keyof typeof iconMap] || iconMap.other;
  return React.createElement(Icon, { className: "h-6 w-6" });
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const filterFiles = (files: ProjectFile[], searchQuery: string): ProjectFile[] => {
  if (!searchQuery) return files;
  
  const query = searchQuery.toLowerCase();
  return files.filter(file =>
    file.name.toLowerCase().includes(query) ||
    file.tags.some(tag => tag.toLowerCase().includes(query))
  );
};

export const sortFiles = (files: ProjectFile[], sortBy: string): ProjectFile[] => {
  const sortedFiles = [...files];
  
  switch (sortBy) {
    case 'name':
      sortedFiles.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'date':
      sortedFiles.sort((a, b) => 
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      );
      break;
    case 'size':
      sortedFiles.sort((a, b) => b.size - a.size);
      break;
    case 'type':
      sortedFiles.sort((a, b) => a.type.localeCompare(b.type));
      break;
    default:
      break;
  }
  
  return sortedFiles;
};

export const getFileType = (file: File): string => {
  const type = file.type.split('/')[0];
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  if (type === 'image') return 'image';
  if (type === 'video') return 'video';
  if (type === 'audio') return 'audio';
  
  if (extension) {
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) return 'archive';
    if (['js', 'ts', 'jsx', 'tsx', 'html', 'css', 'py', 'java', 'cpp'].includes(extension)) return 'code';
    if (['doc', 'docx', 'pdf', 'txt', 'rtf'].includes(extension)) return 'document';
  }
  
  return 'other';
}; 