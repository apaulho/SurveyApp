// pages/api/admin/available-questions.ts
import pool from '../../../lib/neon-db';
import type { NextApiRequest, NextApiResponse } from 'next';

interface Question {
  question_id: number;
  question_text: string;
  question_type: string;
  category?: string;
  company_id?: number;
  company_name?: string;
  created_by_user_id?: number;
  is_active: boolean;
  sort_order: number;
  required: boolean;
}

interface AdminQuestionsResponse {
  success: boolean;
  questions?: Question[];
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AdminQuestionsResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Fetch all active questions with company information
    const questionsResult = await pool.query(`
      SELECT
        q.question_id,
        q.question_text,
        q.question_type,
        q.category,
        q.company_id,
        c.company_name,
        q.created_by_user_id,
        q.is_active,
        q.sort_order,
        q.required
      FROM questiondb q
      LEFT JOIN companydb c ON q.company_id = c.company_id
      WHERE q.is_active = true
      ORDER BY q.category, q.sort_order, q.question_id
    `);

    const questions: Question[] = questionsResult.rows.map(question => ({
      question_id: question.question_id,
      question_text: question.question_text,
      question_type: question.question_type,
      category: question.category,
      company_id: question.company_id,
      company_name: question.company_name,
      created_by_user_id: question.created_by_user_id,
      is_active: question.is_active,
      sort_order: question.sort_order,
      required: question.required
    }));

    res.status(200).json({
      success: true,
      questions: questions
    });

  } catch (error) {
    console.error('Admin available questions fetch error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
