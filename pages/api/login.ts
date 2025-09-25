import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import pool from '../../lib/neon-db';

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  user?: {
    user_id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false });
  }

  const { username, password }: LoginRequest = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false });
  }

  try {
    // Query user from database
    const userQuery = await pool.query(
      'SELECT user_id, username, email, password_hash, first_name, last_name, is_active FROM userdb WHERE username = $1',
      [username]
    );

    if (userQuery.rows.length === 0) {
      return res.status(401).json({ success: false });
    }

    const user = userQuery.rows[0];

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({ success: false });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ success: false });
    }

    // Update last login
    await pool.query(
      'UPDATE userdb SET last_login_at = CURRENT_TIMESTAMP WHERE user_id = $1',
      [user.user_id]
    );

    // Return success with user info (excluding password)
    const { password_hash, ...userInfo } = user;
    return res.status(200).json({
      success: true,
      user: userInfo
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false });
  }
}
