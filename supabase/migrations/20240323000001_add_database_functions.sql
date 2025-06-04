-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, account_type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'account_type', 'client')
  );
  
  -- Create welcome notification
  INSERT INTO public.notifications (
    user_id,
    type,
    title,
    message,
    action_url
  ) VALUES (
    NEW.id,
    'info',
    'Welcome to ProLinkTT!',
    'Thank you for joining ProLinkTT. Complete your profile to get started.',
    '/profile'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to handle project status changes
CREATE OR REPLACE FUNCTION public.handle_project_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Notify client of status change
  INSERT INTO public.notifications (
    user_id,
    type,
    title,
    message,
    action_url
  ) VALUES (
    NEW.client_id,
    CASE 
      WHEN NEW.status = 'completed' THEN 'success'
      WHEN NEW.status = 'cancelled' THEN 'error'
      ELSE 'info'
    END,
    'Project Status Updated',
    'Your project status has been updated to: ' || NEW.status,
    '/projects/' || NEW.id
  );
  
  -- Notify professional if assigned
  IF NEW.assigned_to IS NOT NULL THEN
    INSERT INTO public.notifications (
      user_id,
      type,
      title,
      message,
      action_url
    ) VALUES (
      NEW.assigned_to,
      CASE 
        WHEN NEW.status = 'completed' THEN 'success'
        WHEN NEW.status = 'cancelled' THEN 'error'
        ELSE 'info'
      END,
      'Project Status Updated',
      'Project status has been updated to: ' || NEW.status,
      '/projects/' || NEW.id
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for project status changes
CREATE TRIGGER on_project_status_change
  AFTER UPDATE OF status ON public.projects
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION public.handle_project_status_change();

-- Function to handle new messages
CREATE OR REPLACE FUNCTION public.handle_new_message()
RETURNS TRIGGER AS $$
BEGIN
  -- Notify receiver of new message
  INSERT INTO public.notifications (
    user_id,
    type,
    title,
    message,
    action_url
  ) VALUES (
    NEW.receiver_id,
    'info',
    'New Message',
    'You have received a new message',
    '/messages/' || NEW.id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new messages
CREATE TRIGGER on_new_message
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_message(); 