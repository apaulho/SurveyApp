-- Fix Foreign Key Constraint Issues
-- This script ensures all surveys have valid created_by_user_id references

-- First, check if there's at least one user
DO $$
DECLARE
    user_count INTEGER;
    first_user_id INTEGER;
BEGIN
    -- Count existing users
    SELECT COUNT(*) INTO user_count FROM userdb;

    -- If no users exist, create a default admin user
    IF user_count = 0 THEN
        INSERT INTO userdb (
            username,
            email,
            password_hash,
            first_name,
            last_name,
            is_active,
            email_verified,
            level
        ) VALUES (
            'admin',
            'admin@example.com',
            '$2b$10$dummy.hash.for.demo.purposes.only', -- This is just a placeholder
            'Admin',
            'User',
            true,
            true,
            1001
        );
        RAISE NOTICE 'Created default admin user';
    END IF;

    -- Get the first available user ID
    SELECT user_id INTO first_user_id FROM userdb ORDER BY user_id LIMIT 1;

    -- Update any surveys with invalid created_by_user_id
    UPDATE surveydb
    SET created_by_user_id = first_user_id
    WHERE created_by_user_id NOT IN (SELECT user_id FROM userdb);

    -- Update any questions with invalid created_by_user_id
    UPDATE questiondb
    SET created_by_user_id = first_user_id
    WHERE created_by_user_id NOT IN (SELECT user_id FROM userdb);

    RAISE NOTICE 'Fixed foreign key references for user_id: %', first_user_id;
END $$;
