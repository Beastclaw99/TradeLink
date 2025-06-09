-- Create project_tasks table
CREATE TABLE IF NOT EXISTS project_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  milestone_id UUID NOT NULL REFERENCES project_milestones(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add RLS policies
ALTER TABLE project_tasks ENABLE ROW LEVEL SECURITY;

-- Allow users to view tasks for projects they are involved in
CREATE POLICY "Users can view tasks for their projects"
  ON project_tasks
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM project_milestones pm
      JOIN projects p ON p.id = pm.project_id
      WHERE pm.id = project_tasks.milestone_id
      AND (
        p.client_id = auth.uid() OR
        p.professional_id = auth.uid()
      )
    )
  );

-- Allow users to insert tasks for their projects
CREATE POLICY "Users can insert tasks for their projects"
  ON project_tasks
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM project_milestones pm
      JOIN projects p ON p.id = pm.project_id
      WHERE pm.id = project_tasks.milestone_id
      AND (
        p.client_id = auth.uid() OR
        p.professional_id = auth.uid()
      )
    )
  );

-- Allow users to update tasks for their projects
CREATE POLICY "Users can update tasks for their projects"
  ON project_tasks
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM project_milestones pm
      JOIN projects p ON p.id = pm.project_id
      WHERE pm.id = project_tasks.milestone_id
      AND (
        p.client_id = auth.uid() OR
        p.professional_id = auth.uid()
      )
    )
  );

-- Allow users to delete tasks for their projects
CREATE POLICY "Users can delete tasks for their projects"
  ON project_tasks
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM project_milestones pm
      JOIN projects p ON p.id = pm.project_id
      WHERE pm.id = project_tasks.milestone_id
      AND (
        p.client_id = auth.uid() OR
        p.professional_id = auth.uid()
      )
    )
  );

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS project_tasks_milestone_id_idx ON project_tasks(milestone_id); 