-- Create project_updates table
CREATE TABLE IF NOT EXISTS public.project_updates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  update_type TEXT NOT NULL,
  message TEXT,
  status_update TEXT,
  file_url TEXT,
  file_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  metadata JSONB,
  
  -- Add indexes for common queries
  CONSTRAINT project_updates_update_type_check CHECK (update_type IN (
    'message',
    'status_change',
    'file_upload',
    'site_check',
    'start_time',
    'completion_note',
    'check_in',
    'check_out',
    'on_my_way',
    'delayed',
    'cancelled',
    'revisit_required',
    'expense_submitted',
    'expense_approved',
    'payment_processed',
    'schedule_updated',
    'task_completed',
    'custom_field_updated'
  ))
);

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS project_updates_project_id_idx ON public.project_updates(project_id);
CREATE INDEX IF NOT EXISTS project_updates_created_at_idx ON public.project_updates(created_at);
CREATE INDEX IF NOT EXISTS project_updates_user_id_idx ON public.project_updates(user_id);

-- Enable Row Level Security
ALTER TABLE public.project_updates ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Project updates are viewable by project participants" ON public.project_updates
  FOR SELECT USING (
    auth.uid() IN (
      SELECT client_id FROM projects WHERE id = project_id
      UNION
      SELECT assigned_to FROM projects WHERE id = project_id
    )
  );

CREATE POLICY "Project updates can be created by project participants" ON public.project_updates
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT client_id FROM projects WHERE id = project_id
      UNION
      SELECT assigned_to FROM projects WHERE id = project_id
    )
  );

-- Create storage bucket for project files
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-files', 'project-files', false);

-- Enable storage RLS
CREATE POLICY "Project files are viewable by project participants"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-files' AND (
    auth.uid() IN (
      SELECT client_id FROM projects WHERE id = (SELECT project_id FROM project_updates WHERE file_url = name)
      UNION
      SELECT assigned_to FROM projects WHERE id = (SELECT project_id FROM project_updates WHERE file_url = name)
    )
  ));

CREATE POLICY "Project files can be uploaded by project participants"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'project-files' AND (
    auth.uid() IN (
      SELECT client_id FROM projects WHERE id = SPLIT_PART(name, '/', 1)::uuid
      UNION
      SELECT assigned_to FROM projects WHERE id = SPLIT_PART(name, '/', 1)::uuid
    )
  )); 