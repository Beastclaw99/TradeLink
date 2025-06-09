-- Add deadline and dependency fields to tasks array
ALTER TABLE project_milestones
ALTER COLUMN tasks TYPE JSONB USING tasks::jsonb;

-- Update existing tasks to include new fields
UPDATE project_milestones
SET tasks = (
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', task->>'id',
      'title', task->>'title',
      'completed', (task->>'completed')::boolean,
      'deadline', NULL,
      'dependencies', '[]'::jsonb,
      'status', CASE 
        WHEN (task->>'completed')::boolean THEN 'completed'
        ELSE 'todo'
      END,
      'priority', 'medium'
    )
  )
  FROM jsonb_array_elements(tasks) task
)
WHERE tasks IS NOT NULL;

-- Add index for task deadlines
CREATE INDEX IF NOT EXISTS project_milestones_tasks_deadline_idx 
ON project_milestones USING GIN ((tasks->'deadline')); 