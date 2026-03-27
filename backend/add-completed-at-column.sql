-- Add completed_at column to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;

-- Update existing completed orders to have completed_at timestamp
UPDATE orders 
SET completed_at = updated_at 
WHERE status = 'completed' AND completed_at IS NULL;