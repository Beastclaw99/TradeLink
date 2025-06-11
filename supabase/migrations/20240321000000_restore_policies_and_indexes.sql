-- Enable Row Level Security on all tables
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.project_deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.dispute_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.dispute_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.dispute_mediators ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.dispute_status_history ENABLE ROW LEVEL SECURITY;

-- Create necessary indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_account_type ON public.profiles(account_type);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON public.projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_professional_id ON public.projects(professional_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_project_id ON public.applications(project_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_project_id ON public.payments(project_id);
CREATE INDEX IF NOT EXISTS idx_reviews_project_id ON public.reviews(project_id);
CREATE INDEX IF NOT EXISTS idx_reviews_professional_id ON public.reviews(professional_id);
CREATE INDEX IF NOT EXISTS idx_messages_project_id ON public.messages(project_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON public.messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_project_milestones_project_id ON public.project_milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_project_milestones_status ON public.project_milestones(status);
CREATE INDEX IF NOT EXISTS idx_project_deliverables_project_id ON public.project_deliverables(project_id);
CREATE INDEX IF NOT EXISTS idx_project_deliverables_status ON public.project_deliverables(status);
CREATE INDEX IF NOT EXISTS idx_disputes_project_id ON public.disputes(project_id);
CREATE INDEX IF NOT EXISTS idx_disputes_status ON public.disputes(status);
CREATE INDEX IF NOT EXISTS idx_dispute_messages_dispute_id ON public.dispute_messages(dispute_id);
CREATE INDEX IF NOT EXISTS idx_dispute_evidence_dispute_id ON public.dispute_evidence(dispute_id);
CREATE INDEX IF NOT EXISTS idx_dispute_mediators_dispute_id ON public.dispute_mediators(dispute_id);
CREATE INDEX IF NOT EXISTS idx_dispute_status_history_dispute_id ON public.dispute_status_history(dispute_id);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to all tables
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_applications_updated_at ON public.applications;
CREATE TRIGGER update_applications_updated_at
    BEFORE UPDATE ON public.applications
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_payments_updated_at ON public.payments;
CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON public.payments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_reviews_updated_at ON public.reviews;
CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON public.reviews
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_messages_updated_at ON public.messages;
CREATE TRIGGER update_messages_updated_at
    BEFORE UPDATE ON public.messages
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_project_milestones_updated_at ON public.project_milestones;
CREATE TRIGGER update_project_milestones_updated_at
    BEFORE UPDATE ON public.project_milestones
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_project_deliverables_updated_at ON public.project_deliverables;
CREATE TRIGGER update_project_deliverables_updated_at
    BEFORE UPDATE ON public.project_deliverables
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_disputes_updated_at ON public.disputes;
CREATE TRIGGER update_disputes_updated_at
    BEFORE UPDATE ON public.disputes
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_dispute_messages_updated_at ON public.dispute_messages;
CREATE TRIGGER update_dispute_messages_updated_at
    BEFORE UPDATE ON public.dispute_messages
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create payment status history view
CREATE OR REPLACE VIEW public.payment_status_history_view AS
SELECT 
    p.id as payment_id,
    p.project_id,
    p.status as payment_status,
    p.created_at as payment_created_at,
    p.paid_at,
    p.amount,
    pr.title as project_title,
    pr.status as project_status,
    pr.payment_status as project_payment_status,
    c.first_name as client_first_name,
    c.last_name as client_last_name,
    prof.first_name as professional_first_name,
    prof.last_name as professional_last_name
FROM public.payments p
LEFT JOIN public.projects pr ON p.project_id = pr.id
LEFT JOIN public.profiles c ON p.client_id = c.id
LEFT JOIN public.profiles prof ON p.professional_id = prof.id;

-- Drop existing policies before creating new ones
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view active projects" ON public.projects;
DROP POLICY IF EXISTS "Clients can view their own projects" ON public.projects;
DROP POLICY IF EXISTS "Professionals can view assigned projects" ON public.projects;
DROP POLICY IF EXISTS "Clients can create projects" ON public.projects;
DROP POLICY IF EXISTS "Professionals can view their applications" ON public.applications;
DROP POLICY IF EXISTS "Clients can view applications for their projects" ON public.applications;
DROP POLICY IF EXISTS "Users can view their own payments" ON public.payments;
DROP POLICY IF EXISTS "Anyone can view approved reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can view their own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can view their own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
DROP POLICY IF EXISTS "Users can view their own disputes" ON public.disputes;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- Create RLS policies for projects
CREATE POLICY "Anyone can view active projects"
    ON public.projects
    FOR SELECT
    USING (status IN ('open', 'assigned', 'in_progress'));

CREATE POLICY "Clients can view their own projects"
    ON public.projects
    FOR SELECT
    USING (auth.uid() = client_id);

CREATE POLICY "Professionals can view assigned projects"
    ON public.projects
    FOR SELECT
    USING (auth.uid() = professional_id);

CREATE POLICY "Clients can create projects"
    ON public.projects
    FOR INSERT
    WITH CHECK (
        auth.uid() = client_id AND
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND account_type = 'client'
        )
    );

-- Create RLS policies for applications
CREATE POLICY "Professionals can view their applications"
    ON public.applications
    FOR SELECT
    USING (auth.uid() = professional_id);

CREATE POLICY "Clients can view applications for their projects"
    ON public.applications
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE projects.id = applications.project_id
            AND projects.client_id = auth.uid()
        )
    );

-- Create RLS policies for payments
CREATE POLICY "Users can view their own payments"
    ON public.payments
    FOR SELECT
    USING (
        auth.uid() = client_id OR
        auth.uid() = professional_id
    );

-- Create RLS policies for reviews
CREATE POLICY "Anyone can view approved reviews"
    ON public.reviews
    FOR SELECT
    USING (status = 'approved');

CREATE POLICY "Users can view their own reviews"
    ON public.reviews
    FOR SELECT
    USING (
        auth.uid() = client_id OR
        auth.uid() = professional_id
    );

-- Create RLS policies for messages
CREATE POLICY "Users can view their own messages"
    ON public.messages
    FOR SELECT
    USING (
        auth.uid() = sender_id OR
        auth.uid() = recipient_id
    );

CREATE POLICY "Users can send messages"
    ON public.messages
    FOR INSERT
    WITH CHECK (auth.uid() = sender_id);

-- Create RLS policies for disputes
CREATE POLICY "Users can view their own disputes"
    ON public.disputes
    FOR SELECT
    USING (
        auth.uid() = initiator_id OR
        auth.uid() = respondent_id
    );

-- Create function to handle project status updates
CREATE OR REPLACE FUNCTION handle_project_status_update()
RETURNS TRIGGER AS $$
BEGIN
    -- Update payment status when project status changes
    IF NEW.status = 'work_approved' THEN
        UPDATE public.payments
        SET status = 'completed'
        WHERE project_id = NEW.id
        AND status = 'pending';
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger for project status updates
DROP TRIGGER IF EXISTS update_project_status ON public.projects;
CREATE TRIGGER update_project_status
    AFTER UPDATE OF status ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION handle_project_status_update();

-- Create function to handle payment status updates
CREATE OR REPLACE FUNCTION handle_payment_status_update()
RETURNS TRIGGER AS $$
BEGIN
    -- Update project payment status when payment status changes
    IF NEW.status = 'completed' THEN
        UPDATE public.projects
        SET payment_status = 'paid'
        WHERE id = NEW.project_id;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger for payment status updates
DROP TRIGGER IF EXISTS update_payment_status ON public.payments;
CREATE TRIGGER update_payment_status
    AFTER UPDATE OF status ON public.payments
    FOR EACH ROW
    EXECUTE FUNCTION handle_payment_status_update();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, account_type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'account_type', 'client')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create rollback function
CREATE OR REPLACE FUNCTION rollback_policies_and_indexes()
RETURNS void AS $$
BEGIN
    -- Drop triggers
    DROP TRIGGER IF EXISTS update_project_status ON public.projects;
    DROP TRIGGER IF EXISTS update_payment_status ON public.payments;
    DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
    DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;
    DROP TRIGGER IF EXISTS update_applications_updated_at ON public.applications;
    DROP TRIGGER IF EXISTS update_payments_updated_at ON public.payments;
    DROP TRIGGER IF EXISTS update_reviews_updated_at ON public.reviews;
    DROP TRIGGER IF EXISTS update_messages_updated_at ON public.messages;
    DROP TRIGGER IF EXISTS update_project_milestones_updated_at ON public.project_milestones;
    DROP TRIGGER IF EXISTS update_project_deliverables_updated_at ON public.project_deliverables;
    DROP TRIGGER IF EXISTS update_disputes_updated_at ON public.disputes;
    DROP TRIGGER IF EXISTS update_dispute_messages_updated_at ON public.dispute_messages;

    -- Drop functions
    DROP FUNCTION IF EXISTS handle_project_status_update();
    DROP FUNCTION IF EXISTS handle_payment_status_update();
    DROP FUNCTION IF EXISTS update_updated_at_column();

    -- Drop views
    DROP VIEW IF EXISTS public.payment_status_history_view;

    -- Drop policies
    DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
    DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
    DROP POLICY IF EXISTS "Anyone can view active projects" ON public.projects;
    DROP POLICY IF EXISTS "Clients can view their own projects" ON public.projects;
    DROP POLICY IF EXISTS "Professionals can view assigned projects" ON public.projects;
    DROP POLICY IF EXISTS "Clients can create projects" ON public.projects;
    DROP POLICY IF EXISTS "Professionals can view their applications" ON public.applications;
    DROP POLICY IF EXISTS "Clients can view applications for their projects" ON public.applications;
    DROP POLICY IF EXISTS "Users can view their own payments" ON public.payments;
    DROP POLICY IF EXISTS "Anyone can view approved reviews" ON public.reviews;
    DROP POLICY IF EXISTS "Users can view their own reviews" ON public.reviews;
    DROP POLICY IF EXISTS "Users can view their own messages" ON public.messages;
    DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
    DROP POLICY IF EXISTS "Users can view their own disputes" ON public.disputes;

    -- Drop indexes
    DROP INDEX IF EXISTS idx_profiles_email;
    DROP INDEX IF EXISTS idx_profiles_account_type;
    DROP INDEX IF EXISTS idx_projects_status;
    DROP INDEX IF EXISTS idx_projects_client_id;
    DROP INDEX IF EXISTS idx_projects_professional_id;
    DROP INDEX IF EXISTS idx_applications_status;
    DROP INDEX IF EXISTS idx_applications_project_id;
    DROP INDEX IF EXISTS idx_payments_status;
    DROP INDEX IF EXISTS idx_payments_project_id;
    DROP INDEX IF EXISTS idx_reviews_project_id;
    DROP INDEX IF EXISTS idx_reviews_professional_id;
    DROP INDEX IF EXISTS idx_messages_project_id;
    DROP INDEX IF EXISTS idx_messages_recipient_id;
    DROP INDEX IF EXISTS idx_messages_sender_id;
    DROP INDEX IF EXISTS idx_project_milestones_project_id;
    DROP INDEX IF EXISTS idx_project_milestones_status;
    DROP INDEX IF EXISTS idx_project_deliverables_project_id;
    DROP INDEX IF EXISTS idx_project_deliverables_status;
    DROP INDEX IF EXISTS idx_disputes_project_id;
    DROP INDEX IF EXISTS idx_disputes_status;
    DROP INDEX IF EXISTS idx_dispute_messages_dispute_id;
    DROP INDEX IF EXISTS idx_dispute_evidence_dispute_id;
    DROP INDEX IF EXISTS idx_dispute_mediators_dispute_id;
    DROP INDEX IF EXISTS idx_dispute_status_history_dispute_id;
END;
$$ language 'plpgsql'; 