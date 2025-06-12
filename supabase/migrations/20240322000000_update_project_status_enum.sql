-- Drop existing enum type
DROP TYPE IF EXISTS project_status_enum CASCADE;

-- Create new enum type with all required statuses
CREATE TYPE project_status_enum AS ENUM (
  'draft',
  'open',
  'assigned',
  'in_progress',
  'work_submitted',
  'work_revision_requested',
  'work_approved',
  'completed',
  'archived',
  'cancelled',
  'disputed'
);

-- Update projects table to use new enum
ALTER TABLE public.projects 
  ALTER COLUMN status TYPE project_status_enum 
  USING status::project_status_enum;

-- Add default value for status
ALTER TABLE public.projects 
  ALTER COLUMN status SET DEFAULT 'draft';

-- Update RLS policies to handle new statuses
DROP POLICY IF EXISTS "Anyone can view active projects" ON public.projects;
CREATE POLICY "Anyone can view active projects"
    ON public.projects
    FOR SELECT
    USING (status IN ('open', 'assigned', 'in_progress'));

-- Add rollback function
CREATE OR REPLACE FUNCTION rollback_project_status_enum()
RETURNS void AS $$
BEGIN
    -- Revert to original enum
    DROP TYPE IF EXISTS project_status_enum CASCADE;
    CREATE TYPE project_status_enum AS ENUM (
        'open',
        'in_progress',
        'completed',
        'cancelled',
        'archived'
    );

    -- Update projects table
    ALTER TABLE public.projects 
        ALTER COLUMN status TYPE project_status_enum 
        USING status::project_status_enum;

    -- Restore original default
    ALTER TABLE public.projects 
        ALTER COLUMN status SET DEFAULT 'open';

    -- Restore original policy
    DROP POLICY IF EXISTS "Anyone can view active projects" ON public.projects;
    CREATE POLICY "Anyone can view active projects"
        ON public.projects
        FOR SELECT
        USING (status = 'open');
END;
$$ language 'plpgsql'; 