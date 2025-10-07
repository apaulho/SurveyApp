// pages/api/admin/questions.ts
import pool from '../../../lib/neon-db';
import type { NextApiRequest, NextApiResponse } from 'next';

interface Question {
  question_id: number;
  question_text: string;
  question_type: string;
  category: string | null;
  company_id: number | null;
  created_by_user_id: number | null;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  sort_order: number;
  required: boolean;
}

interface QuestionsResponse {
  success: boolean;
  questions?: Question[];
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<QuestionsResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const result = await pool.query(
      `SELECT 
        question_id,
        question_text,
        question_type,
        category,
        company_id,
        created_by_user_id,
        created_at,
        updated_at,
        is_active,
        sort_order,
        required
      FROM questiondb
      ORDER BY sort_order ASC, question_id ASC`
    );

    res.status(200).json({ success: true, questions: result.rows });
  } catch (error) {
    console.error('Admin questions fetch error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
