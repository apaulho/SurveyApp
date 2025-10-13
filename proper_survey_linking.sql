-- =================================================================
-- PROPER WAY: Using SurveyQuestionDB Junction Table (Recommended)
-- =================================================================
--
-- ADVANTAGES of Junction Table Approach:
-- ✓ One question can be used in multiple surveys
-- ✓ Different sort orders per survey
-- ✓ Different required/optional settings per survey
-- ✓ Proper database normalization
-- ✓ Flexible survey creation
-- ✓ Easy to maintain and extend
--
-- This is the approach currently implemented in your system
-- =================================================================

-- Step 1: Create a survey (if not exists)
INSERT INTO surveydb (
    survey_title,
    survey_description,
    created_by_user_id,
    is_active,
    is_public,
    allow_anonymous
) VALUES (
    'Food Preferences Survey',
    'Learn about food preferences, cooking habits, and dietary choices',
    1, -- Admin user
    true, -- Active
    true, -- Public
    false -- No anonymous responses
) ON CONFLICT DO NOTHING;

-- Step 2: Get the survey ID
-- In practice, you'd use RETURNING clause or application logic

-- Step 3: Link questions to survey using junction table
-- This allows maximum flexibility and reusability

-- Method 1: Link by question IDs (most efficient)
INSERT INTO surveyquestiondb (survey_id, question_id, sort_order, is_required)
SELECT 1, q.question_id,
       ROW_NUMBER() OVER (ORDER BY q.question_id) as sort_order,
       CASE
           WHEN q.question_text IN (
               'What is your favorite type of cuisine?',
               'What is your favorite breakfast food?',
               'What is your favorite comfort food?'
           ) THEN true
           ELSE false
       END as is_required
FROM questiondb q
WHERE q.question_text IN (
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
)
ORDER BY q.question_id;

-- Method 2: Link all questions from a category
-- INSERT INTO surveyquestiondb (survey_id, question_id, sort_order, is_required)
-- SELECT 1, question_id,
--        ROW_NUMBER() OVER (ORDER BY sort_order) as sort_order,
--        false
-- FROM questiondb
-- WHERE category = 'Food Preferences'
-- ORDER BY sort_order;

-- Method 3: Custom ordering and requirements
-- INSERT INTO surveyquestiondb (survey_id, question_id, sort_order, is_required) VALUES
-- (1, 1, 1, true),   -- Favorite cuisine (required, first)
-- (1, 5, 2, false),  -- Dietary restrictions (optional, second)
-- (1, 9, 3, false),  -- Cooking frequency (optional, third)
-- (1, 20, 4, true);  -- Comfort food (required, last)

-- Verification: Check survey with linked questions
SELECT
    'Survey: ' || s.survey_title as survey_info,
    'Question ' || sq.sort_order || ': ' || q.question_text as question_info,
    CASE WHEN sq.is_required THEN 'Required' ELSE 'Optional' END as requirement,
    q.question_type,
    q.category
FROM surveyquestiondb sq
JOIN surveydb s ON sq.survey_id = s.survey_id
JOIN questiondb q ON sq.question_id = q.question_id
WHERE s.survey_id = 1
ORDER BY sq.sort_order;

-- Count questions in survey
SELECT
    s.survey_title,
    COUNT(sq.question_id) as total_questions,
    COUNT(CASE WHEN sq.is_required THEN 1 END) as required_questions,
    COUNT(CASE WHEN NOT sq.is_required THEN 1 END) as optional_questions
FROM surveydb s
LEFT JOIN surveyquestiondb sq ON s.survey_id = sq.survey_id
WHERE s.survey_id = 1
GROUP BY s.survey_id, s.survey_title;
