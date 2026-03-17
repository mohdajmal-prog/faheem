-- Add completed_at column to orders table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'completed_at'
    ) THEN
        ALTER TABLE orders ADD COLUMN completed_at TIMESTAMP WITH TIME ZONE;
        PRINT 'Added completed_at column to orders table';
    ELSE
        PRINT 'completed_at column already exists in orders table';
    END IF;
END $$;

-- Update existing completed orders to have a completed_at timestamp
UPDATE orders 
SET completed_at = updated_at 
WHERE status = 'completed' AND completed_at IS NULL;

-- Create index for better performance on completed orders queries
CREATE INDEX IF NOT EXISTS idx_orders_status_completed_at ON orders(status, completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status_status ON orders(payment_status, status);