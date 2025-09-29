// pages/api/admin/create-user.ts
import bcrypt from 'bcryptjs';
import pool from '../../../lib/neon-db';
import type { NextApiRequest, NextApiResponse } from 'next';

interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  address_city?: string;
  address_state?: string;
  phone?: string;
  level: number;
  is_active: boolean;
  email_verified: boolean;
}

interface CreateUserResponse {
  success: boolean;
  user?: any;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateUserResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const {
    username,
    email,
    password,
    first_name,
    last_name,
    address_city,
    address_state,
    phone,
    level,
    is_active,
    email_verified
  }: CreateUserRequest = req.body;

  // Basic validation
  if (!username || !email || !password || !first_name || !last_name) {
    return res.status(400).json({ success: false, error: 'Required fields missing' });
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long' });
  }

  if (![1001, 2002].includes(level)) {
    return res.status(400).json({ success: false, error: 'Invalid user level' });
  }

  try {
    // Check if username already exists
    const existingUsername = await pool.query(
      'SELECT user_id FROM userdb WHERE username = $1',
      [username]
    );

    if (existingUsername.rows.length > 0) {
      return res.status(409).json({ success: false, error: 'Username already exists' });
    }

    // Check if email already exists
    const existingEmail = await pool.query(
      'SELECT user_id FROM userdb WHERE email = $1',
      [email]
    );

    if (existingEmail.rows.length > 0) {
      return res.status(409).json({ success: false, error: 'Email already exists' });
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert new user
    const result = await pool.query(`
      INSERT INTO userdb (
        username, email, password_hash, first_name, last_name,
        address_city, address_state, phone, level, is_active, email_verified
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
      )
      RETURNING user_id, username, email, first_name, last_name, level, is_active, email_verified, created_at
    `, [
      username, email, passwordHash, first_name, last_name,
      address_city || null, address_state || null, phone || null,
      level, is_active, email_verified
    ]);

    const newUser = result.rows[0];

    console.log(`✅ Admin created user: ${newUser.username} (Level: ${newUser.level})`);

    res.status(201).json({
      success: true,
      user: newUser
    });

  } catch (error) {
    console.error('Admin create user error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
