// pages/api/check-user.ts
import pool from '../../lib/neon-db';
import type { NextApiRequest, NextApiResponse } from 'next';

interface CheckUserRequest {
  username: string;
  email: string;
}

interface CheckUserResponse {
  success: boolean;
  usernameExists: boolean;
  emailExists: boolean;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CheckUserResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
      usernameExists: false,
      emailExists: false
    });
  }

  const { username, email }: CheckUserRequest = req.body;

  // Basic validation
  if (!username || !email) {
    return res.status(400).json({
      success: false,
      error: 'Username and email are required',
      usernameExists: false,
      emailExists: false
    });
  }

  try {
    // Check if username exists
    const usernameResult = await pool.query(
      'SELECT user_id FROM userdb WHERE username = $1',
      [username]
    );

    // Check if email exists
    const emailResult = await pool.query(
      'SELECT user_id FROM userdb WHERE email = $1',
      [email]
    );

    const usernameExists = usernameResult.rows.length > 0;
    const emailExists = emailResult.rows.length > 0;

    res.status(200).json({
      success: true,
      usernameExists,
      emailExists
    });

  } catch (error) {
    console.error('User check error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      usernameExists: false,
      emailExists: false
    });
  }
}
