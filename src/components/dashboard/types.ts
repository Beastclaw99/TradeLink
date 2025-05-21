
// Shared interfaces for dashboard components
export interface Project {
  id: string;
  title: string;
  description: string | null;
  budget: number | null;
  status: string | null;
  created_at: string | null;
  client_id: string | null;
  assigned_to: string | null;
  client?: {
    first_name: string | null;
    last_name: string | null;
  };
}

export interface Application {
  id: string;
  project_id: string | null;
  professional_id: string | null;
  status: string | null;
  cover_letter: string | null;
  bid_amount: number | null;
  proposal_message: string | null;
  created_at: string | null;
  updated_at: string | null;
  project?: {
    title: string;
    status: string | null;
    budget: number | null;
  };
  professional?: {
    first_name: string | null;
    last_name: string | null;
  };
}

export interface Payment {
  id: string;
  project_id: string | null;
  amount: number;
  status: string | null;
  created_at: string;
  paid_at?: string | null;
  professional_id?: string | null;
  client_id?: string | null;
  project?: {
    title: string;
  };
  professional?: {
    first_name: string | null;
    last_name: string | null;
  };
}

export interface Review {
  id: string;
  project_id: string | null;
  rating: number | null;
  comment: string | null;
  created_at: string;
  professional_id?: string | null;
  client_id?: string | null;
  project?: {
    title: string;
  };
  professional?: {
    first_name: string | null;
    last_name: string | null;
  };
}
