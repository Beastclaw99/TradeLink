-- Create completion checklist table
CREATE TABLE project_completion_checklist (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    item_type VARCHAR(50) NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    is_required BOOLEAN DEFAULT true,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    completed_by UUID REFERENCES auth.users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create project archival table
CREATE TABLE project_archives (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    archived_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    archived_by UUID REFERENCES auth.users(id),
    archive_reason TEXT,
    archive_notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create project historical data table
CREATE TABLE project_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    history_type VARCHAR(50) NOT NULL,
    history_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Add RLS policies
ALTER TABLE project_completion_checklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_archives ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_history ENABLE ROW LEVEL SECURITY;

-- Completion checklist policies
CREATE POLICY "Users can view their own project completion checklists"
    ON project_completion_checklist
    FOR SELECT
    USING (
        project_id IN (
            SELECT id FROM projects 
            WHERE client_id = auth.uid() 
            OR professional_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own project completion checklists"
    ON project_completion_checklist
    FOR UPDATE
    USING (
        project_id IN (
            SELECT id FROM projects 
            WHERE client_id = auth.uid() 
            OR professional_id = auth.uid()
        )
    );

-- Archive policies
CREATE POLICY "Users can view their own project archives"
    ON project_archives
    FOR SELECT
    USING (
        project_id IN (
            SELECT id FROM projects 
            WHERE client_id = auth.uid() 
            OR professional_id = auth.uid()
        )
    );

CREATE POLICY "Users can create archives for their own projects"
    ON project_archives
    FOR INSERT
    WITH CHECK (
        project_id IN (
            SELECT id FROM projects 
            WHERE client_id = auth.uid() 
            OR professional_id = auth.uid()
        )
    );

-- History policies
CREATE POLICY "Users can view their own project history"
    ON project_history
    FOR SELECT
    USING (
        project_id IN (
            SELECT id FROM projects 
            WHERE client_id = auth.uid() 
            OR professional_id = auth.uid()
        )
    );

CREATE POLICY "Users can create history for their own projects"
    ON project_history
    FOR INSERT
    WITH CHECK (
        project_id IN (
            SELECT id FROM projects 
            WHERE client_id = auth.uid() 
            OR professional_id = auth.uid()
        )
    );

-- Add indexes
CREATE INDEX idx_project_completion_checklist_project_id ON project_completion_checklist(project_id);
CREATE INDEX idx_project_archives_project_id ON project_archives(project_id);
CREATE INDEX idx_project_history_project_id ON project_history(project_id); 