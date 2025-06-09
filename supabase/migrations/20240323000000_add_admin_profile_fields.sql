-- Add admin-specific fields to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'professional', 'admin')),
ADD COLUMN IF NOT EXISTS admin_permissions TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS admin_notes TEXT,
ADD COLUMN IF NOT EXISTS last_admin_action TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS admin_status TEXT DEFAULT 'active' CHECK (admin_status IN ('active', 'inactive', 'suspended'));

-- Add comments to explain the fields
COMMENT ON COLUMN public.profiles.role IS 'User role in the system';
COMMENT ON COLUMN public.profiles.admin_permissions IS 'Array of admin permissions';
COMMENT ON COLUMN public.profiles.admin_notes IS 'Notes about the admin account';
COMMENT ON COLUMN public.profiles.last_admin_action IS 'Timestamp of last admin action';
COMMENT ON COLUMN public.profiles.admin_status IS 'Status of the admin account';

-- Create admin-specific policies
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can update any profile"
ON public.profiles
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Create admin_actions table for audit logging
CREATE TABLE IF NOT EXISTS public.admin_actions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  action_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT
);

-- Add comments to explain the table
COMMENT ON TABLE public.admin_actions IS 'Log of all admin actions for audit purposes';
COMMENT ON COLUMN public.admin_actions.action_type IS 'Type of action performed';
COMMENT ON COLUMN public.admin_actions.target_type IS 'Type of entity affected';
COMMENT ON COLUMN public.admin_actions.target_id IS 'ID of entity affected';
COMMENT ON COLUMN public.admin_actions.action_details IS 'Additional details about the action';
COMMENT ON COLUMN public.admin_actions.ip_address IS 'IP address of the admin';
COMMENT ON COLUMN public.admin_actions.user_agent IS 'User agent of the admin';

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_admin_actions_admin_id ON public.admin_actions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_created_at ON public.admin_actions(created_at);
CREATE INDEX IF NOT EXISTS idx_admin_actions_target ON public.admin_actions(target_type, target_id);

-- Enable RLS on admin_actions
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_actions
CREATE POLICY "Admins can view admin actions"
ON public.admin_actions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can insert admin actions"
ON public.admin_actions
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
); 