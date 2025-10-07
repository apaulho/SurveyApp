-- =================================================================
-- DIRECT QUESTION TO SURVEY LINKING (Not Recommended)
-- =================================================================
--
-- WARNING: This approach has significant drawbacks compared to using
-- the surveyquestiondb junction table. Use only if you understand
-- the limitations and are willing to sacrifice flexibility.
--
-- PROBLEMS WITH DIRECT LINKING:
-- 1. One question can only belong to ONE survey
-- 2. Cannot reuse questions across multiple surveys
-- 3. Cannot have different sort orders per survey
-- 4. Cannot have different required/optional settings per survey
-- 5. Violates database normalization principles
-- 6. Makes the system inflexible for future requirements
--
-- RECOMMENDED: Keep using surveyquestiondb junction table for flexibility
-- =================================================================

-- Option 1: Add survey_id as nullable foreign key to questiondb
-- This allows questions to optionally belong to a specific survey
ALTER TABLE questiondb
ADD COLUMN survey_id INTEGER REFERENCES surveydb(survey_id);

-- Option 2: Add survey_id as required field (less flexible)
-- ALTER TABLE questiondb
-- ADD COLUMN survey_id INTEGER NOT NULL REFERENCES surveydb(survey_id);

-- Option 3: Replace the junction table entirely (DANGEROUS - breaks existing data)
-- This would require dropping surveyquestiondb and moving to direct linking
/*
-- DO NOT RUN THIS UNLESS YOU WANT TO BREAK EXISTING SURVEYS
DROP TABLE surveyquestiondb;

ALTER TABLE questiondb
ADD COLUMN survey_id INTEGER REFERENCES surveydb(survey_id),
ADD COLUMN question_sort_order INTEGER DEFAULT 0,
ADD COLUMN is_required_in_survey BOOLEAN DEFAULT false;

-- Update existing questions to have a default survey or NULL
UPDATE questiondb SET survey_id = NULL WHERE survey_id IS NULL;
*/

-- Example: Update food questions to belong to a specific survey
-- First, ensure the survey exists
INSERT INTO surveydb (
    survey_title,
    survey_description,
    created_by_user_id,
    is_active,
    is_public
) VALUES (
    'Food Preferences Survey',
    'A comprehensive survey about food preferences and habits',
    1, true, true
) ON CONFLICT DO NOTHING;

-- Then update questions to link to the survey
UPDATE questiondb
SET survey_id = (SELECT survey_id FROM surveydb WHERE survey_title = 'Food Preferences Survey' LIMIT 1)
WHERE question_text IN (
    'What is your favorite type of cuisine?',
    'How often do you eat fast food?',
    'What is your favorite breakfast food?',
    'Do you prefer sweet or savory foods?',
    'Do you have any dietary restrictions?',
    'Are you vegetarian or vegan?',
    'What types of allergies do you have?',
    'How important are organic foods to you?',
    'How often do you cook at home?',
    'What is your favorite cooking method?',
    'Do you enjoy baking?',
    'What kitchen appliances do you use most?',
    'What is your favorite type of pizza?',
    'How do you like your steak cooked?',
    'What is your favorite ice cream flavor?',
    'Do you prefer coffee or tea?',
    'How often do you eat at restaurants?',
    'What matters most when choosing a restaurant?',
    'Do you enjoy trying new foods?',
    'What is your favorite comfort food?'
);

-- Verification: Check questions linked to survey
SELECT
    s.survey_title,
    q.question_text,
    q.question_type,
    q.category
FROM questiondb q
JOIN surveydb s ON q.survey_id = s.survey_id
WHERE s.survey_title = 'Food Preferences Survey'
ORDER BY q.sort_order;
