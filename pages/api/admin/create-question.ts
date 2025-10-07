// pages/api/admin/create-question.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../../lib/neon-db';

interface CreateQuestionRequest {
  question_text: string;
  question_type?: string; // default 'text'
  category?: string | null;
  company_id?: number | null;
  created_by_user_id?: number | null;
  is_active?: boolean; // default true
  sort_order?: number; // default 0
  required?: boolean; // default false
}

interface CreateQuestionResponse {
  success: boolean;
  question?: any;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateQuestionResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const {
    question_text,
    question_type = 'text',
    category = null,
    company_id = null,
    created_by_user_id = null,
    is_active = true,
    sort_order = 0,
    required = false,
  }: CreateQuestionRequest = req.body || {};

  if (!question_text || typeof question_text !== 'string' || question_text.trim().length === 0) {
    return res.status(400).json({ success: false, error: 'question_text is required' });
  }

  const allowedTypes = ['text', 'multiple_choice', 'rating'];
  if (question_type && !allowedTypes.includes(question_type)) {
    return res.status(400).json({ success: false, error: 'Invalid question_type' });
  }

  try {
    const insert = await pool.query(
      `INSERT INTO questiondb (
        question_text, question_type, category, company_id,
        created_by_user_id, is_active, sort_order, required
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING question_id, question_text, question_type, category, company_id, created_by_user_id, created_at, updated_at, is_active, sort_order, required`,
      [
        question_text.trim(),
        question_type,
        category || null,
        company_id ?? null,
        created_by_user_id ?? null,
        is_active,
        sort_order ?? 0,
        required ?? false,
      ]
    );

    const question = insert.rows[0];

    res.status(201).json({ success: true, question });
  } catch (error) {
    console.error('Admin create question error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
