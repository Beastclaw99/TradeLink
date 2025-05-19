
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

-- Payments table indexes
CREATE INDEX IF NOT EXISTS idx_payments_project_id ON payments (project_id);
CREATE INDEX IF NOT EXISTS idx_payments_professional_id ON payments (professional_id);
CREATE INDEX IF NOT EXISTS idx_payments_client_id ON payments (client_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments (status);

-- Reviews table indexes
CREATE INDEX IF NOT EXISTS idx_reviews_project_id ON reviews (project_id);
CREATE INDEX IF NOT EXISTS idx_reviews_professional_id ON reviews (professional_id);
CREATE INDEX IF NOT EXISTS idx_reviews_client_id ON reviews (client_id);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_projects_status_created_at ON projects (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_project_professional ON applications (project_id, professional_id);
CREATE INDEX IF NOT EXISTS idx_reviews_professional_rating ON reviews (professional_id, rating);
