-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view active projects" ON public.projects;
DROP POLICY IF EXISTS "Clients can view their own projects" ON public.projects;
DROP POLICY IF EXISTS "Professionals can view assigned projects" ON public.projects;
DROP POLICY IF EXISTS "Clients can update their own projects" ON public.projects;
DROP POLICY IF EXISTS "Professionals can update assigned projects" ON public.projects;

-- Create new policies for viewing projects
CREATE POLICY "Anyone can view active projects"
    ON public.projects
    FOR SELECT
    USING (
        status IN ('open', 'assigned', 'in_progress', 'work_submitted', 'work_revision_requested', 'work_approved')
    );

CREATE POLICY "Clients can view their own projects"
    ON public.projects
    FOR SELECT
    USING (
        auth.uid() = client_id
    );

CREATE POLICY "Professionals can view assigned projects"
    ON public.projects
    FOR SELECT
    USING (
        auth.uid() = professional_id
    );

-- Create policies for updating projects
CREATE POLICY "Clients can update their own projects"
    ON public.projects
    FOR UPDATE
    USING (
        auth.uid() = client_id
    )
    WITH CHECK (
        auth.uid() = client_id
        AND (
            -- Clients can update status to these values
            (status = 'open' AND NEW.status IN ('assigned', 'cancelled', 'archived'))
            OR (status = 'work_submitted' AND NEW.status IN ('work_revision_requested', 'work_approved', 'cancelled', 'archived'))
            OR (status = 'work_approved' AND NEW.status IN ('completed', 'cancelled', 'archived'))
            OR (status = 'completed' AND NEW.status = 'archived')
            OR (status = 'disputed' AND NEW.status IN ('archived', 'cancelled'))
            -- Or keep the same status
            OR status = NEW.status
        )
    );

CREATE POLICY "Professionals can update assigned projects"
    ON public.projects
    FOR UPDATE
    USING (
        auth.uid() = professional_id
    )
    WITH CHECK (
        auth.uid() = professional_id
        AND (
            -- Professionals can update status to these values
            (status = 'assigned' AND NEW.status IN ('in_progress', 'cancelled', 'archived'))
            OR (status = 'in_progress' AND NEW.status IN ('work_submitted', 'cancelled', 'archived'))
            OR (status = 'work_revision_requested' AND NEW.status IN ('work_submitted', 'cancelled', 'archived'))
            -- Or keep the same status
            OR status = NEW.status
        )
    );

-- Add rollback function
CREATE OR REPLACE FUNCTION rollback_project_rls_policies()
RETURNS void AS $$
BEGIN
    -- Drop new policies
    DROP POLICY IF EXISTS "Anyone can view active projects" ON public.projects;
    DROP POLICY IF EXISTS "Clients can view their own projects" ON public.projects;
    DROP POLICY IF EXISTS "Professionals can view assigned projects" ON public.projects;
    DROP POLICY IF EXISTS "Clients can update their own projects" ON public.projects;
    DROP POLICY IF EXISTS "Professionals can update assigned projects" ON public.projects;

    -- Restore original policies
    CREATE POLICY "Anyone can view active projects"
        ON public.projects
        FOR SELECT
        USING (status = 'open');

    CREATE POLICY "Clients can view their own projects"
        ON public.projects
        FOR SELECT
        USING (auth.uid() = client_id);

    CREATE POLICY "Professionals can view assigned projects"
        ON public.projects
        FOR SELECT
        USING (auth.uid() = professional_id);

    CREATE POLICY "Clients can update their own projects"
        ON public.projects
        FOR UPDATE
        USING (auth.uid() = client_id)
        WITH CHECK (auth.uid() = client_id);

    CREATE POLICY "Professionals can update assigned projects"
        ON public.projects
        FOR UPDATE
        USING (auth.uid() = professional_id)
        WITH CHECK (auth.uid() = professional_id);
END;
$$ language 'plpgsql'; 