-- Example: Create a Food Survey and Link Questions
-- This script demonstrates how to create a survey and link it with questions
-- using the surveyquestiondb junction table

-- Step 1: Create a new survey in surveydb
INSERT INTO surveydb (
    survey_title,
    survey_description,
    company_id,
    created_by_user_id,
    is_active,
    is_public,
    allow_anonymous,
    start_date,
    end_date
) VALUES (
    'Food Preferences Survey',
    'A comprehensive survey about food preferences, cooking habits, and dietary choices',
    NULL, -- No specific company
    1,    -- Created by admin user
    true, -- Active
    true, -- Public survey
    false,-- No anonymous responses
    '2025-01-01 00:00:00+00', -- Start date
    '2025-12-31 23:59:59+00'  -- End date
);

-- Get the survey_id that was just created (assuming it got ID 1)
-- In practice, you'd use RETURNING or a SELECT to get the actual ID

-- Step 2: Link questions to the survey using surveyquestiondb
-- This creates relationships between the survey and selected questions
INSERT INTO surveyquestiondb (
    survey_id,
    question_id,
    sort_order,
    is_required
) VALUES
-- Link survey_id 1 with various food questions
(1, 1, 1, true),   -- What is your favorite type of cuisine? (required)
(1, 2, 2, false),  -- How often do you eat fast food?
(1, 3, 3, true),   -- What is your favorite breakfast food? (required)
(1, 4, 4, false),  -- Do you prefer sweet or savory foods?
(1, 5, 5, false),  -- Do you have any dietary restrictions?
(1, 6, 6, false),  -- Are you vegetarian or vegan?
(1, 7, 7, false),  -- What types of allergies do you have?
(1, 8, 8, false),  -- How important are organic foods to you?
(1, 9, 9, false),  -- How often do you cook at home?
(1, 10, 10, false), -- What is your favorite cooking method?
(1, 11, 11, false), -- Do you enjoy baking?
(1, 12, 12, false), -- What kitchen appliances do you use most?
(1, 13, 13, false), -- What is your favorite type of pizza?
(1, 14, 14, false), -- How do you like your steak cooked?
(1, 15, 15, false), -- What is your favorite ice cream flavor?
(1, 16, 16, false), -- Do you prefer coffee or tea?
(1, 17, 17, false), -- How often do you eat at restaurants?
(1, 18, 18, false), -- What matters most when choosing a restaurant?
(1, 19, 19, false), -- Do you enjoy trying new foods?
(1, 20, 20, true);  -- What is your favorite comfort food? (required)

-- Alternative approach: If you want to link specific questions by their text
-- You can use a subquery to find question_ids by question_text

-- Example of linking by question text (more robust):
/*
INSERT INTO surveyquestiondb (survey_id, question_id, sort_order, is_required)
SELECT 1, question_id, ROW_NUMBER() OVER (ORDER BY sort_order), false
FROM questiondb
WHERE question_text IN (
    'What is your favorite type of cuisine?',
    'How often do you eat fast food?',
    'What is your favorite breakfast food?'
)
ORDER BY sort_order;
*/

-- Verification: Check the survey and its linked questions
-- SELECT * FROM surveydb WHERE survey_id = 1;
-- SELECT q.question_text, sq.sort_order, sq.is_required
-- FROM surveyquestiondb sq
-- JOIN questiondb q ON sq.question_id = q.question_id
-- WHERE sq.survey_id = 1
-- ORDER BY sq.sort_order;
