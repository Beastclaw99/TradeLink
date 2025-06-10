-- Add status and feedback fields to project_deliverables table
ALTER TABLE project_deliverables
ADD COLUMN status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
ADD COLUMN feedback text,
ADD COLUMN reviewed_at timestamp with time zone;
 
-- Create index for faster status queries
CREATE INDEX idx_project_deliverables_status ON project_deliverables(status); 