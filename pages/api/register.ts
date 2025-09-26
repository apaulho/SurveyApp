// pages/api/register.ts
import bcrypt from 'bcryptjs';
import pool from '../../lib/neon-db';
import type { NextApiRequest, NextApiResponse } from 'next';

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  address_city: string;
  address_state: string;
  phone: string;
}

interface ApiResponse {
  success?: boolean;
  error?: string;
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
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    username,
    email,
    password,
    first_name,
    last_name,
    address_city,
    address_state,
    phone
  }: RegisterRequest = req.body;

  // Basic validation
  if (!username || !email || !password || !first_name || !last_name || !address_city || !address_state || !phone) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  try {
    // Check if username or email already exists
    const existingUser = await pool.query(
      'SELECT user_id FROM userdb WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'Username or email already exists' });
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert new user
    const result = await pool.query(`
      INSERT INTO userdb (
        username, email, password_hash, first_name, last_name,
        address_city, address_state, phone, is_active, email_verified, level
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
      )
      RETURNING user_id, username, email, first_name, last_name, level
    `, [
      username, email, passwordHash, first_name, last_name,
      address_city, address_state, phone, true, true, 2002 // Default to user level
    ]);

    const newUser = result.rows[0];

    console.log('User registered successfully:', newUser.username);

    res.status(201).json({
      success: true,
      user: newUser
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
