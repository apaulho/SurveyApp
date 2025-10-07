-- Insert 20 questions about types of food
-- This script populates the questiondb table with food-related survey questions

INSERT INTO questiondb (
    question_text,
    question_type,
    category,
    company_id,
    created_by_user_id,
    is_active,
    sort_order,
    required
) VALUES
-- Basic food preferences
('What is your favorite type of cuisine?', 'text', 'Food Preferences', NULL, 1, true, 1, false),
('How often do you eat fast food?', 'multiple_choice', 'Eating Habits', NULL, 1, true, 2, false),
('What is your favorite breakfast food?', 'text', 'Meals', NULL, 1, true, 3, false),
('Do you prefer sweet or savory foods?', 'multiple_choice', 'Taste Preferences', NULL, 1, true, 4, false),

-- Dietary preferences and restrictions
('Do you have any dietary restrictions?', 'multiple_choice', 'Dietary', NULL, 1, true, 5, false),
('Are you vegetarian or vegan?', 'multiple_choice', 'Dietary', NULL, 1, true, 6, false),
('What types of allergies do you have?', 'text', 'Health', NULL, 1, true, 7, false),
('How important are organic foods to you?', 'rating', 'Food Quality', NULL, 1, true, 8, false),

-- Cooking and preparation
('How often do you cook at home?', 'multiple_choice', 'Cooking', NULL, 1, true, 9, false),
('What is your favorite cooking method?', 'multiple_choice', 'Cooking', NULL, 1, true, 10, false),
('Do you enjoy baking?', 'multiple_choice', 'Cooking', NULL, 1, true, 11, false),
('What kitchen appliances do you use most?', 'text', 'Cooking', NULL, 1, true, 12, false),

-- Specific food categories
('What is your favorite type of pizza?', 'text', 'Specific Foods', NULL, 1, true, 13, false),
('How do you like your steak cooked?', 'multiple_choice', 'Specific Foods', NULL, 1, true, 14, false),
('What is your favorite ice cream flavor?', 'text', 'Desserts', NULL, 1, true, 15, false),
('Do you prefer coffee or tea?', 'multiple_choice', 'Beverages', NULL, 1, true, 16, false),

-- Eating out and social aspects
('How often do you eat at restaurants?', 'multiple_choice', 'Dining Out', NULL, 1, true, 17, false),
('What matters most when choosing a restaurant?', 'multiple_choice', 'Dining Out', NULL, 1, true, 18, false),
('Do you enjoy trying new foods?', 'multiple_choice', 'Food Exploration', NULL, 1, true, 19, false),
('What is your favorite comfort food?', 'text', 'Emotional Eating', NULL, 1, true, 20, false);
