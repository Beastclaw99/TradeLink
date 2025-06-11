-- Create covering indexes for foreign keys to optimize query performance

-- Applications table indexes
CREATE INDEX IF NOT EXISTS idx_applications_professional_id ON applications (professional_id);
CREATE INDEX IF NOT EXISTS idx_applications_project_id ON applications (project_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications (status);
CREATE INDEX IF NOT EXISTS idx_applications_project_status ON applications (project_id, status);

-- Projects table indexes
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects (client_id);
CREATE INDEX IF NOT EXISTS idx_projects_assigned_to ON projects (assigned_to);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects (status);
CREATE INDEX IF NOT EXISTS idx_projects_client_status ON projects (client_id, status);
CREATE INDEX IF NOT EXISTS idx_projects_assigned_status ON projects (assigned_to, status);
CREATE INDEX IF NOT EXISTS idx_projects_client_created ON projects (client_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_professional_created ON projects (professional_id, created_at DESC);

-- Project milestones and deliverables indexes
CREATE INDEX IF NOT EXISTS idx_project_milestones_project_status ON project_milestones (project_id, status);
CREATE INDEX IF NOT EXISTS idx_project_deliverables_project_status ON project_deliverables (project_id, status);
CREATE INDEX IF NOT EXISTS idx_project_milestones_due_date ON project_milestones (due_date);
CREATE INDEX IF NOT EXISTS idx_project_deliverables_created ON project_deliverables (created_at DESC);

-- Payments table indexes
CREATE INDEX IF NOT EXISTS idx_payments_project_id ON payments (project_id);
CREATE INDEX IF NOT EXISTS idx_payments_professional_id ON payments (professional_id);
CREATE INDEX IF NOT EXISTS idx_payments_client_id ON payments (client_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments (status);

-- Reviews table indexes
CREATE INDEX IF NOT EXISTS idx_reviews_project_id ON reviews (project_id);
CREATE INDEX IF NOT EXISTS idx_reviews_professional_id ON reviews (professional_id);
CREATE INDEX IF NOT EXISTS idx_reviews_client_id ON reviews (client_id);

-- Work versions and disputes indexes
CREATE INDEX IF NOT EXISTS idx_work_versions_project_status ON work_versions (project_id, status);
CREATE INDEX IF NOT EXISTS idx_disputes_project_status ON disputes (project_id, status);
CREATE INDEX IF NOT EXISTS idx_disputes_initiator_status ON disputes (initiator_id, status);
CREATE INDEX IF NOT EXISTS idx_disputes_respondent_status ON disputes (respondent_id, status);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_projects_status_created_at ON projects (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_project_professional ON applications (project_id, professional_id);
CREATE INDEX IF NOT EXISTS idx_reviews_professional_rating ON reviews (professional_id, rating);
CREATE INDEX IF NOT EXISTS idx_project_milestones_project_due ON project_milestones (project_id, due_date);
CREATE INDEX IF NOT EXISTS idx_project_deliverables_milestone_status ON project_deliverables (milestone_id, status);
