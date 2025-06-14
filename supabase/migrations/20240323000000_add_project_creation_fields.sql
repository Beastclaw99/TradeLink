-- Add new columns to projects table
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS recommended_skills TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS project_start_time TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS rich_description TEXT,
ADD COLUMN IF NOT EXISTS service_contract TEXT;

-- Create index for recommended_skills for faster searches
CREATE INDEX IF NOT EXISTS idx_projects_recommended_skills ON public.projects USING GIN (recommended_skills);

-- Add comment to table
COMMENT ON COLUMN public.projects.recommended_skills IS 'Array of skills recommended for the project';
COMMENT ON COLUMN public.projects.project_start_time IS 'Scheduled start time of the project';
COMMENT ON COLUMN public.projects.rich_description IS 'Rich text description of the project with formatting';
COMMENT ON COLUMN public.projects.service_contract IS 'Service contract details or reference';

-- Create rollback function
CREATE OR REPLACE FUNCTION rollback_project_creation_fields()
RETURNS void AS $$
BEGIN
    -- Drop index
    DROP INDEX IF EXISTS idx_projects_recommended_skills;

    -- Drop columns
    ALTER TABLE public.projects
    DROP COLUMN IF EXISTS recommended_skills,
    DROP COLUMN IF EXISTS project_start_time,
    DROP COLUMN IF EXISTS rich_description,
    DROP COLUMN IF EXISTS service_contract;
END;
$$ language 'plpgsql'; 