-- Booking History Migration Script
-- Add history tracking fields to bookings table

-- Add new columns for history tracking
ALTER TABLE bookings 
ADD COLUMN created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
ADD COLUMN is_active BOOLEAN DEFAULT TRUE,
ADD COLUMN booking_status ENUM('ACTIVE', 'CANCELLED', 'COMPLETED', 'REFUNDED', 'TRANSFERRED') DEFAULT 'ACTIVE';

-- Update existing bookings with default values
UPDATE bookings 
SET 
    created_date = COALESCE(reg_date, CURRENT_TIMESTAMP),
    updated_date = CURRENT_TIMESTAMP,
    is_active = TRUE,
    booking_status = CASE 
        WHEN status = 'Cancel' THEN 'CANCELLED'
        WHEN status = 'Active' THEN 'ACTIVE'
        ELSE 'ACTIVE'
    END
WHERE created_date IS NULL;

-- Create indexes for better performance
CREATE INDEX idx_bookings_plot_created ON bookings(plot_id, created_date DESC);
CREATE INDEX idx_bookings_layout_created ON bookings(layout_id, created_date DESC);
CREATE INDEX idx_bookings_active_status ON bookings(is_active, booking_status);
CREATE INDEX idx_bookings_created_date ON bookings(created_date DESC);

-- Create a view for latest active bookings per plot
CREATE VIEW latest_active_bookings AS
SELECT b.*
FROM bookings b
INNER JOIN (
    SELECT plot_id, MAX(created_date) as max_date
    FROM bookings 
    WHERE is_active = TRUE 
    GROUP BY plot_id
) latest ON b.plot_id = latest.plot_id AND b.created_date = latest.max_date
WHERE b.is_active = TRUE;

-- Optional: Create audit trigger for automatic updated_date
DELIMITER $$
CREATE TRIGGER booking_updated_date_trigger
    BEFORE UPDATE ON bookings
    FOR EACH ROW
BEGIN
    SET NEW.updated_date = CURRENT_TIMESTAMP;
END$$
DELIMITER ;

-- Verify the migration
SELECT 
    COUNT(*) as total_bookings,
    COUNT(CASE WHEN is_active = TRUE THEN 1 END) as active_bookings,
    COUNT(CASE WHEN booking_status = 'ACTIVE' THEN 1 END) as status_active,
    COUNT(CASE WHEN created_date IS NOT NULL THEN 1 END) as with_created_date
FROM bookings;