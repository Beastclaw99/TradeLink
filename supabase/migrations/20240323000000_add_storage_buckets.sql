-- Create storage buckets for different file types
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('profile-images', 'profile-images', false),
  ('compliance-documents', 'compliance-documents', false),
  ('message-attachments', 'message-attachments', false)
ON CONFLICT (id) DO NOTHING;

-- Profile Images Policies
CREATE POLICY "Profile images are viewable by all authenticated users"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-images');

CREATE POLICY "Users can upload their own profile image"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'profile-images' AND
    auth.uid()::text = SPLIT_PART(name, '/', 1)
  );

CREATE POLICY "Users can update their own profile image"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'profile-images' AND
    auth.uid()::text = SPLIT_PART(name, '/', 1)
  );

-- Compliance Documents Policies
CREATE POLICY "Compliance documents are viewable by all authenticated users"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'compliance-documents');

CREATE POLICY "Professionals can upload their own compliance documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'compliance-documents' AND
    auth.uid()::text = SPLIT_PART(name, '/', 1) AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND account_type = 'professional'
    )
  );

CREATE POLICY "Professionals can update their own compliance documents"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'compliance-documents' AND
    auth.uid()::text = SPLIT_PART(name, '/', 1) AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND account_type = 'professional'
    )
  );

-- Message Attachments Policies
CREATE POLICY "Message attachments are viewable by conversation participants"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'message-attachments' AND
    EXISTS (
      SELECT 1 FROM messages
      WHERE id = SPLIT_PART(name, '/', 1)::uuid
      AND (
        sender_id = auth.uid() OR
        receiver_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can upload message attachments"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'message-attachments' AND
    EXISTS (
      SELECT 1 FROM messages
      WHERE id = SPLIT_PART(name, '/', 1)::uuid
      AND sender_id = auth.uid()
    )
  );

-- Add file cleanup function
CREATE OR REPLACE FUNCTION storage.handle_file_cleanup()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete the file from storage when the reference is deleted
  IF TG_OP = 'DELETE' THEN
    DELETE FROM storage.objects
    WHERE bucket_id = OLD.bucket_id
    AND name = OLD.name;
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add cleanup triggers for each bucket
CREATE TRIGGER on_profile_image_delete
  AFTER DELETE ON storage.objects
  FOR EACH ROW
  WHEN (OLD.bucket_id = 'profile-images')
  EXECUTE FUNCTION storage.handle_file_cleanup();

CREATE TRIGGER on_compliance_document_delete
  AFTER DELETE ON storage.objects
  FOR EACH ROW
  WHEN (OLD.bucket_id = 'compliance-documents')
  EXECUTE FUNCTION storage.handle_file_cleanup();

CREATE TRIGGER on_message_attachment_delete
  AFTER DELETE ON storage.objects
  FOR EACH ROW
  WHEN (OLD.bucket_id = 'message-attachments')
  EXECUTE FUNCTION storage.handle_file_cleanup(); 