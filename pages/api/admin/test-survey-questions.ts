// pages/api/admin/test-survey-questions.ts
import pool from '../../../lib/neon-db';
import type { NextApiRequest, NextApiResponse } from 'next';

interface TestResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TestResponse>
) {
  try {
    // Simple test query
    const result = await pool.query('SELECT NOW()');
    res.status(200).json({
      success: true,
      message: 'Database connection successful'
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({
      success: false,
      error: 'Database connection failed'
    });
  }
}
