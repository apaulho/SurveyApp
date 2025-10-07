// pages/api/admin/surveys.ts
import pool from '../../../lib/neon-db';
import type { NextApiRequest, NextApiResponse } from 'next';

interface Survey {
  survey_id: number;
  survey_title: string;
  survey_description?: string;
  company_id?: number;
  company_name?: string;
  created_by_user_id: number;
  created_by_name?: string;
  is_active: boolean;
  is_public: boolean;
  allow_anonymous: boolean;
  start_date?: string;
  end_date?: string;
  created_at?: string;
  updated_at?: string;
  question_count?: number;
}

interface AdminSurveysResponse {
  success: boolean;
  surveys?: Survey[];
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AdminSurveysResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Fetch all surveys with company and creator information
    const surveysResult = await pool.query(`
      SELECT
        s.survey_id,
        s.survey_title,
        s.survey_description,
        s.company_id,
        c.company_name,
        s.created_by_user_id,
        CONCAT(u.first_name, ' ', u.last_name) as created_by_name,
        s.is_active,
        s.is_public,
        s.allow_anonymous,
        s.start_date,
        s.end_date,
        s.created_at,
        s.updated_at,
        COUNT(sq.question_id) as question_count
      FROM surveydb s
      LEFT JOIN companydb c ON s.company_id = c.company_id
      LEFT JOIN userdb u ON s.created_by_user_id = u.user_id
      LEFT JOIN surveyquestiondb sq ON s.survey_id = sq.survey_id
      GROUP BY s.survey_id, c.company_name, u.first_name, u.last_name
      ORDER BY s.created_at DESC
    `);

    const surveys: Survey[] = surveysResult.rows.map(survey => ({
      survey_id: survey.survey_id,
      survey_title: survey.survey_title,
      survey_description: survey.survey_description,
      company_id: survey.company_id,
      company_name: survey.company_name,
      created_by_user_id: survey.created_by_user_id,
      created_by_name: survey.created_by_name,
      is_active: survey.is_active,
      is_public: survey.is_public,
      allow_anonymous: survey.allow_anonymous,
      start_date: survey.start_date,
      end_date: survey.end_date,
      created_at: survey.created_at,
      updated_at: survey.updated_at,
      question_count: parseInt(survey.question_count) || 0
    }));

    res.status(200).json({
      success: true,
      surveys: surveys
    });

  } catch (error) {
    console.error('Admin surveys fetch error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
