-- Add access control fields to work_version_files
ALTER TABLE work_version_files
ADD COLUMN access_level text DEFAULT 'private' CHECK (access_level IN ('private', 'project_members', 'public')),
ADD COLUMN version_number integer NOT NULL DEFAULT 1,
ADD COLUMN parent_file_id uuid REFERENCES work_version_files(id),
ADD COLUMN is_latest boolean DEFAULT true,
ADD COLUMN change_description text,
ADD COLUMN uploaded_by uuid REFERENCES profiles(id),
ADD COLUMN metadata jsonb DEFAULT '{}'::jsonb;

-- Create file_reviews table
CREATE TABLE file_reviews (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    file_id uuid REFERENCES work_version_files(id) ON DELETE CASCADE,
    reviewer_id uuid REFERENCES profiles(id),
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    feedback text,
    reviewed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create file_comments table
CREATE TABLE file_comments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    file_id uuid REFERENCES work_version_files(id) ON DELETE CASCADE,
    commenter_id uuid REFERENCES profiles(id),
    content text NOT NULL,
    parent_comment_id uuid REFERENCES file_comments(id),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create file_status_restrictions table
CREATE TABLE file_status_restrictions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
    status text NOT NULL,
    allowed_file_types text[] NOT NULL,
    max_file_size integer,
    max_files_per_submission integer,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Add indexes
CREATE INDEX idx_work_version_files_version ON work_version_files(version_id, version_number);
CREATE INDEX idx_work_version_files_parent ON work_version_files(parent_file_id);
CREATE INDEX idx_file_reviews_file ON file_reviews(file_id);
CREATE INDEX idx_file_comments_file ON file_comments(file_id);
CREATE INDEX idx_file_status_restrictions_project ON file_status_restrictions(project_id);

-- Add RLS policies
ALTER TABLE work_version_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_status_restrictions ENABLE ROW LEVEL SECURITY;

-- Work version files policies
CREATE POLICY "Project members can view project files"
    ON work_version_files FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM projects p
            JOIN project_members pm ON p.id = pm.project_id
            WHERE p.id = (
                SELECT project_id FROM work_versions WHERE id = work_version_files.version_id
            )
            AND pm.user_id = auth.uid()
        )
    );

CREATE POLICY "Project members can insert files"
    ON work_version_files FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects p
            JOIN project_members pm ON p.id = pm.project_id
            WHERE p.id = (
                SELECT project_id FROM work_versions WHERE id = work_version_files.version_id
            )
            AND pm.user_id = auth.uid()
        )
    );

-- File reviews policies
CREATE POLICY "Project members can view file reviews"
    ON file_reviews FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM work_version_files wvf
            JOIN work_versions wv ON wvf.version_id = wv.id
            JOIN project_members pm ON wv.project_id = pm.project_id
            WHERE wvf.id = file_reviews.file_id
            AND pm.user_id = auth.uid()
        )
    );

CREATE POLICY "Project members can create file reviews"
    ON file_reviews FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM work_version_files wvf
            JOIN work_versions wv ON wvf.version_id = wv.id
            JOIN project_members pm ON wv.project_id = pm.project_id
            WHERE wvf.id = file_reviews.file_id
            AND pm.user_id = auth.uid()
        )
    );

-- File comments policies
CREATE POLICY "Project members can view file comments"
    ON file_comments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM work_version_files wvf
            JOIN work_versions wv ON wvf.version_id = wv.id
            JOIN project_members pm ON wv.project_id = pm.project_id
            WHERE wvf.id = file_comments.file_id
            AND pm.user_id = auth.uid()
        )
    );

CREATE POLICY "Project members can create file comments"
    ON file_comments FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM work_version_files wvf
            JOIN work_versions wv ON wvf.version_id = wv.id
            JOIN project_members pm ON wv.project_id = pm.project_id
            WHERE wvf.id = file_comments.file_id
            AND pm.user_id = auth.uid()
        )
    );

-- File status restrictions policies
CREATE POLICY "Project members can view file restrictions"
    ON file_status_restrictions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM project_members pm
            WHERE pm.project_id = file_status_restrictions.project_id
            AND pm.user_id = auth.uid()
        )
    );

CREATE POLICY "Project admins can manage file restrictions"
    ON file_status_restrictions FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM project_members pm
            WHERE pm.project_id = file_status_restrictions.project_id
            AND pm.user_id = auth.uid()
            AND pm.role = 'admin'
        )
    ); 