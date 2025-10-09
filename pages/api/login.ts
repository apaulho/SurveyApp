// pages/api/login.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../../lib/neon-db';
import type { NextApiRequest, NextApiResponse } from 'next';

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
    level: number;
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

  // Basic validation
  if (!username || !password) {
    return res.status(400).json({ success: false, error: 'Username and password are required' });
  }

  try {
    // Find user by username
    const userResult = await pool.query(
      'SELECT user_id, username, email, password_hash, first_name, last_name, COALESCE(level, 2002) as level FROM userdb WHERE username = $1 AND is_active = true',
      [username]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid username or password' });
    }

    const user = userResult.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ success: false, error: 'Invalid username or password' });
    }

    console.log(`✅ User logged in: ${user.username} (Level: ${user.level})`);

    // Create JWT token
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    const token = jwt.sign(
      {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        level: user.level
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set JWT token in httpOnly cookie
    res.setHeader('Set-Cookie', [
      `auth-token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=86400; Path=/`,
      `user-session=${JSON.stringify({
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        level: user.level
      })}; Secure; SameSite=Strict; Max-Age=86400; Path=/`
    ]);

    // Return user data (excluding password hash)
    const userData = {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      level: user.level
    };

    res.status(200).json({
      success: true,
      user: userData
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
