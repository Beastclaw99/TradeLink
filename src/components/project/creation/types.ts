export interface Deliverable {
  id: string;
  title: string;
  description: string;
  deliverable_type: 'text' | 'file';
  content: string;
  milestone_id: string;
  file_url?: string;
  file_name?: string;
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  deliverables: Deliverable[];
}

export interface ProjectData {
  title: string;
  description: string;
  milestones: Milestone[];
}

// Drag and Drop Types
export interface DragResult {
  draggableId: string;
  type: string;
  source: {
    droppableId: string;
    index: number;
  };
  destination: {
    droppableId: string;
    index: number;
  } | null;
  reason: 'DROP' | 'CANCEL';
}

// File Upload Types
export interface FileUploadResult {
  success: boolean;
  url?: string;
  error?: string;
  file?: File;
}

// Validation Types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
} 