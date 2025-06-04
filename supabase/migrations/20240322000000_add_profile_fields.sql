-- Add missing fields to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS availability TEXT CHECK (availability IN ('available', 'busy', 'unavailable')),
ADD COLUMN IF NOT EXISTS certifications TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS completed_projects INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS response_rate INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS on_time_completion INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS profile_visibility BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS show_email BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS show_phone BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS allow_messages BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS profile_image TEXT,
ADD COLUMN IF NOT EXISTS verification_status TEXT CHECK (verification_status IN ('unverified', 'pending', 'verified'));

-- Add comments to explain the fields
COMMENT ON COLUMN public.profiles.bio IS 'User''s biography or description';
COMMENT ON COLUMN public.profiles.location IS 'User''s location';
COMMENT ON COLUMN public.profiles.phone IS 'User''s phone number';
COMMENT ON COLUMN public.profiles.email IS 'User''s email address';
COMMENT ON COLUMN public.profiles.availability IS 'Professional''s current availability status';
COMMENT ON COLUMN public.profiles.certifications IS 'Array of professional certifications';
COMMENT ON COLUMN public.profiles.completed_projects IS 'Number of completed projects';
COMMENT ON COLUMN public.profiles.response_rate IS 'Response rate percentage';
COMMENT ON COLUMN public.profiles.on_time_completion IS 'On-time completion rate percentage';
COMMENT ON COLUMN public.profiles.profile_visibility IS 'Whether the profile is visible to others';
COMMENT ON COLUMN public.profiles.show_email IS 'Whether to show email on profile';
COMMENT ON COLUMN public.profiles.show_phone IS 'Whether to show phone on profile';
COMMENT ON COLUMN public.profiles.allow_messages IS 'Whether to allow direct messages';
COMMENT ON COLUMN public.profiles.profile_image IS 'URL to profile image';
COMMENT ON COLUMN public.profiles.verification_status IS 'User''s verification status';

-- Update RLS policies to allow users to update their own profile fields
CREATE POLICY "Users can update their own profile fields"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id); 