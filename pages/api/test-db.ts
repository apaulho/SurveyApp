// pages/api/test-db.ts - Test database connection
import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../lib/neon-db';

interface TestResponse {
  success: boolean;
  message: string;
  database_url_set?: boolean;
  user_count?: number;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TestResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Check if DATABASE_URL is set
    const dbUrlSet = !!process.env.DATABASE_URL;
    console.log('DATABASE_URL is set:', dbUrlSet);

    if (!dbUrlSet) {
      return res.status(500).json({
        success: false,
        message: 'Database configuration error',
        database_url_set: false
      });
    }

    // Test database connection and get user count
    const result = await pool.query('SELECT COUNT(*) as user_count FROM userdb');
    const userCount = parseInt(result.rows[0].user_count);

    console.log('Database connection successful, user count:', userCount);

    return res.status(200).json({
      success: true,
      message: 'Database connection successful',
      database_url_set: true,
      user_count: userCount
    });

  } catch (error) {
    console.error('Database test error:', error);
    return res.status(500).json({
      success: false,
      message: 'Database connection failed',
      database_url_set: !!process.env.DATABASE_URL,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
