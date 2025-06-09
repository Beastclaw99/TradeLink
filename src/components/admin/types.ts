
export interface AdminReview {
  id: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected' | 'reported';
  reported_at?: string;
  reported_by?: string;
  report_reason?: string;
  created_at: string;
  client_id: string;
  professional_id: string;
  project_id: string;
  communication_rating?: number;
  quality_rating?: number;
  timeliness_rating?: number;
  professionalism_rating?: number;
}
