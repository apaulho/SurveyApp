// pages/api/admin/survey-questions/[surveyId].ts
import pool from '../../../lib/neon-db';
import type { NextApiRequest, NextApiResponse } from 'next';

interface SurveyQuestion {
  survey_question_id: number;
  survey_id: number;
  question_id: number;
  sort_order: number;
  is_required: boolean;
  question_text: string;
  question_type: string;
  category?: string;
  is_active: boolean;
  required: boolean;
}

interface SurveyQuestionsResponse {
  success: boolean;
  questions?: SurveyQuestion[];
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SurveyQuestionsResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { surveyId } = req.query;

  if (!surveyId || Array.isArray(surveyId)) {
    return res.status(400).json({ success: false, error: 'Invalid survey ID' });
  }

  const surveyIdNum = parseInt(surveyId);
  if (isNaN(surveyIdNum)) {
    return res.status(400).json({ success: false, error: 'Invalid survey ID format' });
  }

  try {
    // Fetch questions for this survey with their metadata
    const query = `
      SELECT
        sq.survey_question_id,
        sq.survey_id,
        sq.question_id,
        sq.sort_order,
        sq.is_required,
        q.question_text,
        q.question_type,
        q.category,
        q.is_active,
        q.required
      FROM surveyquestiondb sq
      JOIN questiondb q ON sq.question_id = q.question_id
      WHERE sq.survey_id = $1
      ORDER BY sq.sort_order
    `;

    const result = await pool.query(query, [surveyIdNum]);

    const questions: SurveyQuestion[] = result.rows.map(row => ({
      survey_question_id: row.survey_question_id,
      survey_id: row.survey_id,
      question_id: row.question_id,
      sort_order: row.sort_order,
      is_required: row.is_required,
      question_text: row.question_text,
      question_type: row.question_type,
      category: row.category,
      is_active: row.is_active,
      required: row.required
    }));

    res.status(200).json({
      success: true,
      questions
    });

  } catch (error) {
    console.error('Survey questions fetch error:', error);
    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      success: false,
      error: `Internal server error: ${errorMessage}`
    });
  }
}
