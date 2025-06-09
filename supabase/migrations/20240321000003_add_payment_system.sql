-- Create payment_methods table
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default payment methods
INSERT INTO payment_methods (name, code) VALUES
  ('WIPay', 'wipay')
ON CONFLICT (code) DO NOTHING;

-- Add payment-related columns to payments table
ALTER TABLE payments
ADD COLUMN IF NOT EXISTS payment_method_id UUID REFERENCES payment_methods(id),
ADD COLUMN IF NOT EXISTS transaction_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS payment_url TEXT,
ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'TTD',
ADD COLUMN IF NOT EXISTS metadata JSONB;

-- Create payment_status_history table
CREATE TABLE IF NOT EXISTS payment_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create payment_webhooks table
CREATE TABLE IF NOT EXISTS payment_webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON payments(transaction_id);
CREATE INDEX IF NOT EXISTS idx_payments_payment_method_id ON payments(payment_method_id);
CREATE INDEX IF NOT EXISTS idx_payment_status_history_payment_id ON payment_status_history(payment_id);
CREATE INDEX IF NOT EXISTS idx_payment_webhooks_payment_id ON payment_webhooks(payment_id);
CREATE INDEX IF NOT EXISTS idx_payment_webhooks_processed ON payment_webhooks(processed);

-- Create function to update payment status
CREATE OR REPLACE FUNCTION update_payment_status()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO payment_status_history (payment_id, status, metadata)
  VALUES (NEW.id, NEW.status, jsonb_build_object(
    'previous_status', OLD.status,
    'updated_at', CURRENT_TIMESTAMP
  ));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for payment status updates
CREATE TRIGGER payment_status_update
  AFTER UPDATE OF status ON payments
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION update_payment_status();

-- Create function to handle payment webhooks
CREATE OR REPLACE FUNCTION handle_payment_webhook()
RETURNS TRIGGER AS $$
BEGIN
  -- Update payment status based on webhook event
  IF NEW.event_type = 'payment.completed' THEN
    UPDATE payments
    SET status = 'completed',
        paid_at = CURRENT_TIMESTAMP
    WHERE id = NEW.payment_id;
  ELSIF NEW.event_type = 'payment.failed' THEN
    UPDATE payments
    SET status = 'failed'
    WHERE id = NEW.payment_id;
  END IF;

  -- Mark webhook as processed
  UPDATE payment_webhooks
  SET processed = true
  WHERE id = NEW.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for payment webhooks
CREATE TRIGGER payment_webhook_processor
  AFTER INSERT ON payment_webhooks
  FOR EACH ROW
  EXECUTE FUNCTION handle_payment_webhook(); 