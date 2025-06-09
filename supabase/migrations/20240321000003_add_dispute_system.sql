-- Create work_versions table if it doesn't exist
CREATE TABLE IF NOT EXISTS work_versions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
    version_number integer NOT NULL,
    submitted_by uuid REFERENCES auth.users(id),
    submitted_at timestamp with time zone DEFAULT now(),
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'revision_requested')),
    feedback text,
    reviewed_at timestamp with time zone,
    reviewed_by uuid REFERENCES auth.users(id),
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create work_version_files table if it doesn't exist
CREATE TABLE IF NOT EXISTS work_version_files (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    version_id uuid REFERENCES work_versions(id) ON DELETE CASCADE,
    file_name text NOT NULL,
    file_url text NOT NULL,
    file_type text,
    file_size integer,
    uploaded_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);

-- Create indexes for work versions
CREATE INDEX IF NOT EXISTS idx_work_versions_project_id ON work_versions(project_id);
CREATE INDEX IF NOT EXISTS idx_work_versions_status ON work_versions(status);
CREATE INDEX IF NOT EXISTS idx_work_version_files_version_id ON work_version_files(version_id);

-- Create dispute table
CREATE TABLE disputes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    work_version_id UUID NOT NULL REFERENCES work_versions(id) ON DELETE CASCADE,
    initiator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    respondent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('open', 'under_review', 'resolved', 'closed')),
    type TEXT NOT NULL CHECK (type IN ('quality', 'timeline', 'payment', 'other')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    resolution TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create dispute documents table
CREATE TABLE dispute_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dispute_id UUID NOT NULL REFERENCES disputes(id) ON DELETE CASCADE,
    file_id UUID NOT NULL REFERENCES work_version_files(id) ON DELETE CASCADE,
    uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create dispute messages table
CREATE TABLE dispute_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dispute_id UUID NOT NULL REFERENCES disputes(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create dispute status history table
CREATE TABLE dispute_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dispute_id UUID NOT NULL REFERENCES disputes(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('open', 'under_review', 'resolved', 'closed')),
    changed_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies for disputes
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispute_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispute_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispute_status_history ENABLE ROW LEVEL SECURITY;

-- Disputes policies
CREATE POLICY "Users can view disputes they are involved in"
    ON disputes FOR SELECT
    USING (
        auth.uid() = initiator_id OR
        auth.uid() = respondent_id OR
        EXISTS (
            SELECT 1 FROM project_members
            WHERE project_id = disputes.project_id
            AND user_id = auth.uid()
            AND role IN ('admin', 'manager')
        )
    );

CREATE POLICY "Users can create disputes"
    ON disputes FOR INSERT
    WITH CHECK (
        auth.uid() = initiator_id AND
        EXISTS (
            SELECT 1 FROM project_members
            WHERE project_id = disputes.project_id
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Only involved users and admins can update disputes"
    ON disputes FOR UPDATE
    USING (
        auth.uid() = initiator_id OR
        auth.uid() = respondent_id OR
        EXISTS (
            SELECT 1 FROM project_members
            WHERE project_id = disputes.project_id
            AND user_id = auth.uid()
            AND role IN ('admin', 'manager')
        )
    );

-- Dispute documents policies
CREATE POLICY "Users can view dispute documents they have access to"
    ON dispute_documents FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM disputes
            WHERE disputes.id = dispute_documents.dispute_id
            AND (
                auth.uid() = disputes.initiator_id OR
                auth.uid() = disputes.respondent_id OR
                EXISTS (
                    SELECT 1 FROM project_members
                    WHERE project_id = disputes.project_id
                    AND user_id = auth.uid()
                    AND role IN ('admin', 'manager')
                )
            )
        )
    );

CREATE POLICY "Users can add documents to disputes they are involved in"
    ON dispute_documents FOR INSERT
    WITH CHECK (
        auth.uid() = uploaded_by AND
        EXISTS (
            SELECT 1 FROM disputes
            WHERE disputes.id = dispute_documents.dispute_id
            AND (
                auth.uid() = disputes.initiator_id OR
                auth.uid() = disputes.respondent_id
            )
        )
    );

-- Dispute messages policies
CREATE POLICY "Users can view messages in disputes they have access to"
    ON dispute_messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM disputes
            WHERE disputes.id = dispute_messages.dispute_id
            AND (
                auth.uid() = disputes.initiator_id OR
                auth.uid() = disputes.respondent_id OR
                EXISTS (
                    SELECT 1 FROM project_members
                    WHERE project_id = disputes.project_id
                    AND user_id = auth.uid()
                    AND role IN ('admin', 'manager')
                )
            )
        )
    );

CREATE POLICY "Users can send messages in disputes they are involved in"
    ON dispute_messages FOR INSERT
    WITH CHECK (
        auth.uid() = sender_id AND
        EXISTS (
            SELECT 1 FROM disputes
            WHERE disputes.id = dispute_messages.dispute_id
            AND (
                auth.uid() = disputes.initiator_id OR
                auth.uid() = disputes.respondent_id
            )
        )
    );

-- Dispute status history policies
CREATE POLICY "Users can view status history of disputes they have access to"
    ON dispute_status_history FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM disputes
            WHERE disputes.id = dispute_status_history.dispute_id
            AND (
                auth.uid() = disputes.initiator_id OR
                auth.uid() = disputes.respondent_id OR
                EXISTS (
                    SELECT 1 FROM project_members
                    WHERE project_id = disputes.project_id
                    AND user_id = auth.uid()
                    AND role IN ('admin', 'manager')
                )
            )
        )
    );

CREATE POLICY "Only admins and managers can add status history"
    ON dispute_status_history FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM disputes
            WHERE disputes.id = dispute_status_history.dispute_id
            AND EXISTS (
                SELECT 1 FROM project_members
                WHERE project_id = disputes.project_id
                AND user_id = auth.uid()
                AND role IN ('admin', 'manager')
            )
        )
    );

-- Create indexes for better query performance
CREATE INDEX idx_disputes_project_id ON disputes(project_id);
CREATE INDEX idx_disputes_work_version_id ON disputes(work_version_id);
CREATE INDEX idx_disputes_initiator_id ON disputes(initiator_id);
CREATE INDEX idx_disputes_respondent_id ON disputes(respondent_id);
CREATE INDEX idx_disputes_status ON disputes(status);
CREATE INDEX idx_dispute_documents_dispute_id ON dispute_documents(dispute_id);
CREATE INDEX idx_dispute_messages_dispute_id ON dispute_messages(dispute_id);
CREATE INDEX idx_dispute_status_history_dispute_id ON dispute_status_history(dispute_id);

-- Add trigger for updated_at timestamp
CREATE TRIGGER set_disputes_updated_at
    BEFORE UPDATE ON disputes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 