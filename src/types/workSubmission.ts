import { ProjectStatus, FileReviewStatus } from './database';

export interface WorkVersion {
  id: string;
  project_id: string;
  version_number: number;
  submitted_by: string;
  submitted_at: string;
  status: FileReviewStatus;
  feedback: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
  metadata: {
    notes?: string;
    changes?: string;
    [key: string]: unknown;
  };
  created_at: string;
  updated_at: string;
}

export interface WorkVersionFile {
  id: string;
  version_id: string;
  file_name: string;
  file_url: string;
  file_type: string | null;
  file_size: number | null;
  uploaded_at: string;
  created_at: string;
}

export type RevisionRequestStatus = 'pending' | 'resolved';

export interface WorkRevisionRequest {
  id: string;
  version_id: string;
  requested_by: string;
  requested_at: string;
  feedback: string;
  status: RevisionRequestStatus;
  resolved_at: string | null;
  created_at: string;
}

export interface WorkSubmissionState {
  currentVersion: WorkVersion | null;
  versionHistory: WorkVersion[];
  revisionRequests: WorkRevisionRequest[];
  files: WorkVersionFile[];
  isLoading: boolean;
  error: string | null;
}

export interface WorkSubmissionProps {
  projectId: string;
  projectStatus: ProjectStatus;
  isProfessional: boolean;
  isClient: boolean;
  onWorkSubmitted: () => void;
  onReviewSubmitted: () => void;
}

export interface WorkVersionProps {
  version: WorkVersion;
  files: WorkVersionFile[];
  revisionRequests: WorkRevisionRequest[];
  onApprove: (versionId: string) => Promise<void>;
  onRequestRevision: (versionId: string, feedback: string) => Promise<void>;
}

export interface WorkRevisionRequestProps {
  request: WorkRevisionRequest;
  onComplete: (requestId: string) => Promise<void>;
  onUpdate: (requestId: string, status: RevisionRequestStatus) => Promise<void>;
} 