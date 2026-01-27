-- Database Migration Script for Layout Entity Changes
-- Run this if you encounter foreign key constraint errors

-- 1. Drop existing foreign key constraints if they exist
ALTER TABLE bookings DROP FOREIGN KEY IF EXISTS FK_bookings_layout_name;
ALTER TABLE plots DROP FOREIGN KEY IF EXISTS FK_plots_layout_name;

-- 2. Add new foreign key constraints for ID-based relationships
ALTER TABLE bookings 
ADD CONSTRAINT FK_bookings_layout_id 
FOREIGN KEY (layout_id) REFERENCES layouts(id) ON DELETE CASCADE;

ALTER TABLE plots 
ADD CONSTRAINT FK_plots_layout_id 
FOREIGN KEY (layout_id) REFERENCES layouts(id) ON DELETE CASCADE;

-- 3. Ensure layouts table has proper structure
-- (Hibernate should handle this automatically with ddl-auto=update)

-- 4. Check if there are any orphaned records
SELECT * FROM bookings WHERE layout_id NOT IN (SELECT id FROM layouts);
SELECT * FROM plots WHERE layout_id NOT IN (SELECT id FROM layouts);

-- Note: If you find orphaned records, you may need to clean them up manually
-- or update them to reference valid layout IDs