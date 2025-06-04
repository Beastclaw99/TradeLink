-- Add professional-specific fields to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS hourly_rate DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS years_experience INTEGER;

-- Add comment to explain the fields
COMMENT ON COLUMN public.profiles.hourly_rate IS 'The hourly rate charged by the professional';
COMMENT ON COLUMN public.profiles.years_experience IS 'Number of years of experience in the trade';

-- Update RLS policies to allow professionals to update their own rates and experience
CREATE POLICY "Professionals can update their own rates and experience"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id AND account_type = 'professional')
WITH CHECK (auth.uid() = id AND account_type = 'professional'); 