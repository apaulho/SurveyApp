-- SurveyPro Database Schema for Neon PostgreSQL

-- 1. UserDB Table
-- Stores user information including authentication details
CREATE TABLE userdb (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    address_street VARCHAR(255),
    address_city VARCHAR(100),
    address_state VARCHAR(50),
    address_zip VARCHAR(20),
    address_country VARCHAR(50) DEFAULT 'USA',
    phone VARCHAR(20),
    date_of_birth DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    last_login_at TIMESTAMP WITH TIME ZONE
);

-- 2. CompanyDB Table
-- Stores company information with reference to main contact user
CREATE TABLE companydb (
    company_id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) UNIQUE NOT NULL,
    address_street VARCHAR(255),
    address_city VARCHAR(100),
    address_state VARCHAR(50),
    address_zip VARCHAR(20),
    address_country VARCHAR(50) DEFAULT 'USA',
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    industry VARCHAR(100),
    main_contact_id INTEGER REFERENCES userdb(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- 3. QuestionDB Table
-- Stores survey questions with reference to company
CREATE TABLE questiondb (
    question_id SERIAL PRIMARY KEY,
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) DEFAULT 'text', -- text, multiple_choice, rating, etc.
    category VARCHAR(100),
    company_id INTEGER REFERENCES companydb(company_id),
    created_by_user_id INTEGER REFERENCES userdb(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    required BOOLEAN DEFAULT false
);

-- 4. AnswerDB Table
-- Stores survey responses with reference to questions
CREATE TABLE answerdb (
    answer_id SERIAL PRIMARY KEY,
    question_id INTEGER REFERENCES questiondb(question_id) ON DELETE CASCADE,
    respondent_user_id INTEGER REFERENCES userdb(user_id),
    response_text TEXT,
    response_numeric INTEGER, -- for rating scales
    response_options JSONB, -- for multiple choice selections
    answered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    survey_session_id VARCHAR(255), -- to group answers from same survey session
    ip_address INET,
    user_agent TEXT
);

-- Create indexes for better performance
CREATE INDEX idx_userdb_email ON userdb(email);
CREATE INDEX idx_userdb_username ON userdb(username);
CREATE INDEX idx_companydb_name ON companydb(company_name);
CREATE INDEX idx_companydb_main_contact ON companydb(main_contact_id);
CREATE INDEX idx_questiondb_company ON questiondb(company_id);
CREATE INDEX idx_questiondb_category ON questiondb(category);
CREATE INDEX idx_answerdb_question ON answerdb(question_id);
CREATE INDEX idx_answerdb_respondent ON answerdb(respondent_user_id);
CREATE INDEX idx_answerdb_session ON answerdb(survey_session_id);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_userdb_updated_at BEFORE UPDATE ON userdb FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_companydb_updated_at BEFORE UPDATE ON companydb FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_questiondb_updated_at BEFORE UPDATE ON questiondb FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
