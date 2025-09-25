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
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { username, password }: LoginRequest = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, error: 'Username and password are required' });
  }

  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL environment variable is not set');
    return res.status(500).json({ success: false, error: 'Database configuration error' });
  }

  try {
    console.log('Attempting login for username:', username);

    // Query user from database
    const userQuery = await pool.query(
      'SELECT user_id, username, email, password_hash, first_name, last_name, is_active FROM userdb WHERE username = $1',
      [username]
    );

    console.log('User query result:', userQuery.rows.length, 'rows found');

    if (userQuery.rows.length === 0) {
      console.log('User not found:', username);
      return res.status(401).json({ success: false, error: 'Invalid username or password' });
    }

    const user = userQuery.rows[0];
    console.log('Found user:', user.username, 'Active:', user.is_active);

    // Check if user is active
    if (!user.is_active) {
      console.log('User account is not active:', username);
      return res.status(401).json({ success: false, error: 'Account is disabled' });
    }

    // Verify password
    console.log('Verifying password for user:', username);
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      console.log('Invalid password for user:', username);
      return res.status(401).json({ success: false, error: 'Invalid username or password' });
    }

    console.log('Login successful for user:', username);

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
    console.error('Login database error:', error);
    return res.status(500).json({ success: false, error: 'Database connection error' });
  }
}
