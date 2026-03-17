-- Add completed_at column to orders table
ALTER TABLE orders ADD COLUMN completed_at TIMESTAMP WITH TIME ZONE;

-- Update existing completed orders to have a completed_at timestamp
UPDATE orders 
SET completed_at = updated_at 
WHERE status = 'completed' AND completed_at IS NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_status_completed_at ON orders(status, completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status_status ON orders(payment_status, status);

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'orders' AND column_name = 'completed_at';