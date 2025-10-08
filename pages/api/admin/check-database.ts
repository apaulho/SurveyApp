// pages/api/admin/check-database.ts
const pool = require('../../../lib/neon-db').default;
import type { NextApiRequest, NextApiResponse } from 'next';

interface DatabaseCheckResponse {
  success: boolean;
  data?: {
    surveys: any[];
    questions: any[];
    surveyQuestions: any[];
  };
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DatabaseCheckResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    console.log('Checking database contents...');

    // Check surveys
    const surveys = await pool.query('SELECT survey_id, survey_title FROM surveydb ORDER BY survey_id');
    console.log('Surveys found:', surveys.rows.length);

    // Check questions
    const questions = await pool.query('SELECT question_id, question_text FROM questiondb ORDER BY question_id LIMIT 5');
    console.log('Questions found:', questions.rows.length);

    // Check survey-question links
    const surveyQuestions = await pool.query(`
      SELECT sq.survey_id, sq.question_id, q.question_text
      FROM surveyquestiondb sq
      JOIN questiondb q ON sq.question_id = q.question_id
      ORDER BY sq.survey_id, sq.sort_order
      LIMIT 10
    `);
    console.log('Survey-question links found:', surveyQuestions.rows.length);

    res.status(200).json({
      success: true,
      data: {
        surveys: surveys.rows,
        questions: questions.rows,
        surveyQuestions: surveyQuestions.rows
      }
    });

  } catch (error) {
    console.error('Database check error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ success: false, error: errorMessage });
  }
}
