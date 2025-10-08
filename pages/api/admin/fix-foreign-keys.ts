// pages/api/admin/fix-foreign-keys.ts
import pool from '../../../lib/neon-db';
import type { NextApiRequest, NextApiResponse } from 'next';

interface FixResponse {
  success: boolean;
  message?: string;
  data?: {
    usersCreated: number;
    surveysFixed: number;
    questionsFixed: number;
  };
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FixResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    console.log('Starting foreign key fix process...');

    let usersCreated = 0;
    let surveysFixed = 0;
    let questionsFixed = 0;

    // Check if there's at least one user
    const userCount = await pool.query('SELECT COUNT(*) as count FROM userdb');
    console.log('Current user count:', userCount.rows[0].count);

    if (parseInt(userCount.rows[0].count) === 0) {
      // Create a default admin user
      await pool.query(`
        INSERT INTO userdb (
          username, email, password_hash, first_name, last_name,
          is_active, email_verified, level
        ) VALUES (
          'admin', 'admin@example.com',
          '$2b$10$dummy.hash.for.demo.purposes.only',
          'Admin', 'User', true, true, 1001
        )
      `);
      usersCreated = 1;
      console.log('Created default admin user');
    }

    // Get the first available user ID
    const firstUser = await pool.query('SELECT user_id FROM userdb ORDER BY user_id LIMIT 1');
    const firstUserId = firstUser.rows[0].user_id;
    console.log('Using user ID for fixes:', firstUserId);

    // Fix surveys with invalid created_by_user_id
    const surveyFix = await pool.query(`
      UPDATE surveydb
      SET created_by_user_id = $1
      WHERE created_by_user_id NOT IN (SELECT user_id FROM userdb)
    `, [firstUserId]);
    surveysFixed = surveyFix.rowCount || 0;
    console.log('Fixed surveys:', surveysFixed);

    // Fix questions with invalid created_by_user_id
    const questionFix = await pool.query(`
      UPDATE questiondb
      SET created_by_user_id = $1
      WHERE created_by_user_id NOT IN (SELECT user_id FROM userdb)
    `, [firstUserId]);
    questionsFixed = questionFix.rowCount || 0;
    console.log('Fixed questions:', questionsFixed);

    res.status(200).json({
      success: true,
      message: 'Foreign key constraints fixed successfully',
      data: {
        usersCreated,
        surveysFixed,
        questionsFixed
      }
    });

  } catch (error) {
    console.error('Foreign key fix error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ success: false, error: errorMessage });
  }
}
