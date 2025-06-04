-- Add portfolio_images field to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS portfolio_images TEXT[] DEFAULT '{}';

-- Add comment to explain the field
COMMENT ON COLUMN public.profiles.portfolio_images IS 'Array of URLs to portfolio images uploaded by the professional';

-- Update RLS policies to allow professionals to update their portfolio images
CREATE POLICY "Professionals can update their own portfolio images"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id AND account_type = 'professional')
WITH CHECK (auth.uid() = id AND account_type = 'professional'); 