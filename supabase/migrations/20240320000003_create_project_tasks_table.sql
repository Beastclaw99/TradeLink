-- Create project_tasks table
CREATE TABLE IF NOT EXISTS project_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    milestone_id UUID REFERENCES project_milestones(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'done')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    assignee_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    tags TEXT[] DEFAULT '{}',
    dependencies UUID[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    completed BOOLEAN DEFAULT FALSE,
    completion_date TIMESTAMP WITH TIME ZONE
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS project_tasks_project_id_idx ON project_tasks(project_id);
CREATE INDEX IF NOT EXISTS project_tasks_milestone_id_idx ON project_tasks(milestone_id);
CREATE INDEX IF NOT EXISTS project_tasks_assignee_id_idx ON project_tasks(assignee_id);
CREATE INDEX IF NOT EXISTS project_tasks_status_idx ON project_tasks(status);
CREATE INDEX IF NOT EXISTS project_tasks_priority_idx ON project_tasks(priority);
CREATE INDEX IF NOT EXISTS project_tasks_due_date_idx ON project_tasks(due_date);
CREATE INDEX IF NOT EXISTS project_tasks_created_by_idx ON project_tasks(created_by);

-- Enable Row Level Security
ALTER TABLE project_tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for access control
CREATE POLICY "Users can view tasks for their projects"
    ON project_tasks
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM projects p
            WHERE p.id = project_tasks.project_id
            AND (
                p.client_id = auth.uid() OR
                p.professional_id = auth.uid() OR
                project_tasks.assignee_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can create tasks for their projects"
    ON project_tasks
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects p
            WHERE p.id = project_tasks.project_id
            AND (
                p.client_id = auth.uid() OR
                p.professional_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can update tasks for their projects"
    ON project_tasks
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM projects p
            WHERE p.id = project_tasks.project_id
            AND (
                p.client_id = auth.uid() OR
                p.professional_id = auth.uid() OR
                project_tasks.assignee_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can delete tasks for their projects"
    ON project_tasks
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM projects p
            WHERE p.id = project_tasks.project_id
            AND (
                p.client_id = auth.uid() OR
                p.professional_id = auth.uid()
            )
        )
    );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_project_tasks_updated_at
    BEFORE UPDATE ON project_tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle task completion
CREATE OR REPLACE FUNCTION handle_task_completion()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.completed = TRUE AND OLD.completed = FALSE THEN
        NEW.completion_date = TIMEZONE('utc'::text, NOW());
        NEW.status = 'done';
    ELSIF NEW.completed = FALSE AND OLD.completed = TRUE THEN
        NEW.completion_date = NULL;
        NEW.status = 'todo';
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for task completion
CREATE TRIGGER handle_task_completion_trigger
    BEFORE UPDATE ON project_tasks
    FOR EACH ROW
    EXECUTE FUNCTION handle_task_completion(); 