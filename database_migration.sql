-- Add level field to userdb table
ALTER TABLE userdb ADD COLUMN level INTEGER DEFAULT 2002;

-- Update existing admin users to level 1001
UPDATE userdb SET level = 1001 WHERE username IN ('darthvader', 'palpatine');

-- Update trigger to include level in updated_at
-- (The existing trigger should work fine since it updates on any column change)
