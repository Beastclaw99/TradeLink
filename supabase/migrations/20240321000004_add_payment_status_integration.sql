-- First, add the new columns without constraints
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS payment_id UUID REFERENCES payments(id),
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_required BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS payment_due_date TIMESTAMP WITH TIME ZONE;

-- Fix existing data to match the new payment status rules
-- Set payment_status to NULL for cancelled/disputed projects
UPDATE projects
SET payment_status = NULL
WHERE status IN ('cancelled', 'disputed');

-- Set payment_status to 'completed' for completed projects
UPDATE projects
SET payment_status = 'completed'
WHERE status = 'completed';

-- Set payment_status to 'pending' for all other active projects
UPDATE projects
SET payment_status = 'pending'
WHERE status NOT IN ('cancelled', 'disputed', 'completed')
AND payment_status IS NULL;

-- Now add the check constraint
ALTER TABLE projects
ADD CONSTRAINT check_payment_status
CHECK (
  (status = 'completed' AND payment_status = 'completed') OR
  (status != 'completed' AND payment_status IN ('pending', 'processing', 'failed', 'refunded')) OR
  (status IN ('cancelled', 'disputed') AND payment_status IS NULL)
);

-- Create secure payment status history view
CREATE OR REPLACE VIEW payment_status_history_view AS
SELECT 
  p.id as project_id,
  p.title as project_title,
  p.status as project_status,
  p.payment_status as project_payment_status,
  pay.id as payment_id,
  pay.amount,
  pay.created_at as payment_created_at,
  pay.paid_at,
  pay.status as payment_status,
  c.first_name as client_first_name,
  c.last_name as client_last_name,
  prof.first_name as professional_first_name,
  prof.last_name as professional_last_name
FROM projects p
LEFT JOIN payments pay ON p.payment_id = pay.id
LEFT JOIN profiles c ON p.client_id = c.id
LEFT JOIN profiles prof ON p.professional_id = prof.id
WHERE auth.uid() IN (
  SELECT client_id FROM projects WHERE id = p.id
  UNION
  SELECT professional_id FROM projects WHERE id = p.id
);

-- Create function to handle payment status updates
CREATE OR REPLACE FUNCTION handle_payment_status_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Update project status when payment is completed
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE projects
    SET payment_status = 'completed',
        status = 'paid'
    WHERE id = NEW.project_id;
  END IF;

  -- Update project status when payment fails
  IF NEW.status = 'failed' AND OLD.status != 'failed' THEN
    UPDATE projects
    SET payment_status = 'failed'
    WHERE id = NEW.project_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for payment status updates
CREATE TRIGGER payment_status_update_trigger
  AFTER UPDATE OF status ON payments
  FOR EACH ROW
  EXECUTE FUNCTION handle_payment_status_update();

-- Add indexes for payment-related queries
CREATE INDEX IF NOT EXISTS idx_projects_payment_id ON projects(payment_id);
CREATE INDEX IF NOT EXISTS idx_projects_payment_status ON projects(payment_status);
CREATE INDEX IF NOT EXISTS idx_projects_payment_due_date ON projects(payment_due_date);

-- Add payment status to project_updates types
ALTER TABLE project_updates
DROP CONSTRAINT IF EXISTS project_updates_update_type_check;

ALTER TABLE project_updates
ADD CONSTRAINT project_updates_update_type_check CHECK (update_type IN (
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
  'payment_failed',
  'payment_refunded',
  'schedule_updated',
  'task_completed',
  'custom_field_updated'
)); 