-- Create enum type for user roles if it doesn't exist
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('client', 'professional', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS user_role AS $$
BEGIN
    RETURN (
        SELECT 
            CASE 
                WHEN EXISTS (SELECT 1 FROM profiles WHERE id = user_id AND account_type = 'client') THEN 'client'::user_role
                WHEN EXISTS (SELECT 1 FROM profiles WHERE id = user_id AND account_type = 'professional') THEN 'professional'::user_role
                ELSE 'admin'::user_role
            END
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to validate status transitions
CREATE OR REPLACE FUNCTION validate_project_status_transition()
RETURNS TRIGGER AS $$
DECLARE
    user_role user_role;
BEGIN
    -- Get the role of the user making the update
    user_role := get_user_role(auth.uid());

    -- If status hasn't changed, allow the update
    IF OLD.status = NEW.status THEN
        RETURN NEW;
    END IF;

    -- Validate transitions based on user role
    IF user_role = 'client' THEN
        -- Client transitions
        IF NOT (
            (OLD.status = 'open' AND NEW.status IN ('assigned', 'cancelled', 'archived'))
            OR (OLD.status = 'work_submitted' AND NEW.status IN ('work_revision_requested', 'work_approved', 'cancelled', 'archived'))
            OR (OLD.status = 'work_approved' AND NEW.status IN ('completed', 'cancelled', 'archived'))
            OR (OLD.status = 'completed' AND NEW.status = 'archived')
            OR (OLD.status = 'disputed' AND NEW.status IN ('archived', 'cancelled'))
        ) THEN
            RAISE EXCEPTION 'Invalid status transition for client: % -> %', OLD.status, NEW.status;
        END IF;
    ELSIF user_role = 'professional' THEN
        -- Professional transitions
        IF NOT (
            (OLD.status = 'assigned' AND NEW.status IN ('in_progress', 'cancelled', 'archived'))
            OR (OLD.status = 'in_progress' AND NEW.status IN ('work_submitted', 'cancelled', 'archived'))
            OR (OLD.status = 'work_revision_requested' AND NEW.status IN ('work_submitted', 'cancelled', 'archived'))
        ) THEN
            RAISE EXCEPTION 'Invalid status transition for professional: % -> %', OLD.status, NEW.status;
        END IF;
    ELSIF user_role = 'admin' THEN
        -- Admins can make any transition
        RETURN NEW;
    ELSE
        RAISE EXCEPTION 'Invalid user role for status transition';
    END IF;

    -- Validate required fields based on new status
    IF NEW.status = 'open' AND (
        NEW.title IS NULL OR 
        NEW.description IS NULL OR 
        NEW.budget IS NULL OR 
        NEW.timeline IS NULL
    ) THEN
        RAISE EXCEPTION 'Missing required fields for open status';
    END IF;

    IF NEW.status IN ('assigned', 'in_progress', 'work_submitted', 'work_revision_requested', 'work_approved', 'completed') AND (
        NEW.title IS NULL OR 
        NEW.description IS NULL OR 
        NEW.budget IS NULL OR 
        NEW.timeline IS NULL OR 
        NEW.professional_id IS NULL
    ) THEN
        RAISE EXCEPTION 'Missing required fields for status: %', NEW.status;
    END IF;

    -- If we get here, the transition is valid
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS validate_project_status_transition_trigger ON public.projects;
CREATE TRIGGER validate_project_status_transition_trigger
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION validate_project_status_transition();

-- Update RLS policies to only check ownership
DROP POLICY IF EXISTS "Clients can update their own projects" ON public.projects;
DROP POLICY IF EXISTS "Professionals can update assigned projects" ON public.projects;

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

-- Add rollback function
CREATE OR REPLACE FUNCTION rollback_project_status_trigger()
RETURNS void AS $$
BEGIN
    -- Drop trigger and function
    DROP TRIGGER IF EXISTS validate_project_status_transition_trigger ON public.projects;
    DROP FUNCTION IF EXISTS validate_project_status_transition();
    DROP FUNCTION IF EXISTS get_user_role(UUID);

    -- Restore original RLS policies
    DROP POLICY IF EXISTS "Clients can update their own projects" ON public.projects;
    DROP POLICY IF EXISTS "Professionals can update assigned projects" ON public.projects;

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