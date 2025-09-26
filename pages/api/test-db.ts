// pages/api/test-db.ts
import pool from '../../lib/neon-db';
import type { NextApiRequest, NextApiResponse } from 'next';

interface TestDbResponse {
  success: boolean;
  message?: string;
  user_count?: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TestDbResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Test database connection by counting users
    const result = await pool.query('SELECT COUNT(*) as user_count FROM userdb');

    const userCount = parseInt(result.rows[0].user_count);

    res.status(200).json({
      success: true,
      user_count: userCount
    });

  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({
      success: false,
      message: 'Database connection failed'
    });
  }
}
