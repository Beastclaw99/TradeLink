-- Add tasks array to project_milestones table
ALTER TABLE project_milestones
ADD COLUMN IF NOT EXISTS tasks JSONB DEFAULT '[]'::jsonb;
 
-- Add index for tasks array
CREATE INDEX IF NOT EXISTS project_milestones_tasks_idx ON project_milestones USING GIN (tasks); 