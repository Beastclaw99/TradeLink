-- Create work_versions table to track different versions of work submissions
CREATE TABLE work_versions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
    version_number integer NOT NULL,
    submitted_by uuid REFERENCES profiles(id),
    submitted_at timestamp with time zone DEFAULT now(),
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'revision_requested')),
    feedback text,
    reviewed_at timestamp with time zone,
    reviewed_by uuid REFERENCES profiles(id),
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create work_version_files table to track files associated with each version
CREATE TABLE work_version_files (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    version_id uuid REFERENCES work_versions(id) ON DELETE CASCADE,
    file_name text NOT NULL,
    file_url text NOT NULL,
    file_type text,
    file_size integer,
    uploaded_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);

-- Create work_revision_requests table to track formal revision requests
CREATE TABLE work_revision_requests (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    version_id uuid REFERENCES work_versions(id) ON DELETE CASCADE,
    requested_by uuid REFERENCES profiles(id),
    requested_at timestamp with time zone DEFAULT now(),
    due_date timestamp with time zone,
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'overdue')),
    feedback text NOT NULL,
    completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX idx_work_versions_project_id ON work_versions(project_id);
CREATE INDEX idx_work_versions_status ON work_versions(status);
CREATE INDEX idx_work_version_files_version_id ON work_version_files(version_id);
CREATE INDEX idx_work_revision_requests_version_id ON work_revision_requests(version_id);
CREATE INDEX idx_work_revision_requests_status ON work_revision_requests(status);

-- Add triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_work_versions_updated_at
    BEFORE UPDATE ON work_versions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_work_revision_requests_updated_at
    BEFORE UPDATE ON work_revision_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 