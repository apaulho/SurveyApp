// pages/api/admin/create-survey.ts
import pool from '../../../lib/neon-db';
import type { NextApiRequest, NextApiResponse } from 'next';

interface Survey {
  survey_id: number;
  survey_title: string;
  survey_description?: string;
  company_id?: number;
  created_by_user_id: number;
  is_active: boolean;
  is_public: boolean;
  allow_anonymous: boolean;
  start_date?: string;
  end_date?: string;
  created_at?: string;
  updated_at?: string;
}

interface CreateSurveyRequest {
  survey_title: string;
  survey_description?: string;
  company_id?: number;
  is_active?: boolean;
  is_public?: boolean;
  allow_anonymous?: boolean;
  start_date?: string;
  end_date?: string;
  question_ids?: number[]; // Array of question IDs to include in the survey
}

interface CreateSurveyResponse {
  success: boolean;
  survey?: Survey;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateSurveyResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const {
    survey_title,
    survey_description,
    company_id,
    is_active,
    is_public,
    allow_anonymous,
    start_date,
    end_date,
    question_ids
  }: CreateSurveyRequest = req.body;

  // Validate required fields
  if (!survey_title || survey_title.trim() === '') {
    return res.status(400).json({ success: false, error: 'Survey title is required' });
  }

  // For now, we'll assume the creator is user_id 1 (admin). In a real app, this would come from session/auth
  const created_by_user_id = 1; // TODO: Get from authenticated user session

  try {
    // Insert new survey
    const insertResult = await pool.query(
      `INSERT INTO surveydb (
        survey_title, survey_description, company_id, created_by_user_id,
        is_active, is_public, allow_anonymous, start_date, end_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        survey_title.trim(),
        survey_description?.trim() || null,
        company_id || null,
        created_by_user_id,
        is_active !== undefined ? is_active : true,
        is_public !== undefined ? is_public : false,
        allow_anonymous !== undefined ? allow_anonymous : false,
        start_date || null,
        end_date || null
      ]
    );

    const newSurvey: Survey = {
      survey_id: insertResult.rows[0].survey_id,
      survey_title: insertResult.rows[0].survey_title,
      survey_description: insertResult.rows[0].survey_description,
      company_id: insertResult.rows[0].company_id,
      created_by_user_id: insertResult.rows[0].created_by_user_id,
      is_active: insertResult.rows[0].is_active,
      is_public: insertResult.rows[0].is_public,
      allow_anonymous: insertResult.rows[0].allow_anonymous,
      start_date: insertResult.rows[0].start_date,
      end_date: insertResult.rows[0].end_date,
      created_at: insertResult.rows[0].created_at,
      updated_at: insertResult.rows[0].updated_at
    };

    // If question_ids were provided, add them to the survey
    if (question_ids && question_ids.length > 0) {
      const surveyQuestionValues = question_ids.map((questionId, index) =>
        `(${newSurvey.survey_id}, ${questionId}, ${index}, false)`
      ).join(', ');

      await pool.query(`
        INSERT INTO surveyquestiondb (survey_id, question_id, sort_order, is_required)
        VALUES ${surveyQuestionValues}
      `);
    }

    res.status(201).json({
      success: true,
      survey: newSurvey
    });

  } catch (error) {
    console.error('Create survey error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
