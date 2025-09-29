// pages/api/admin/update-user.ts
import bcrypt from 'bcryptjs';
import pool from '../../../lib/neon-db';
import type { NextApiRequest, NextApiResponse } from 'next';

interface UpdateUserRequest {
  user_id: number;
  username: string;
  email: string;
  password?: string;
  first_name: string;
  last_name: string;
  address_city?: string;
  address_state?: string;
  phone?: string;
  is_active: boolean;
  email_verified: boolean;
  level: number;
}

interface UpdateUserResponse {
  success: boolean;
  user?: any;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UpdateUserResponse>
) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const {
    user_id,
    username,
    email,
    password,
    first_name,
    last_name,
    address_city,
    address_state,
    phone,
    is_active,
    email_verified,
    level
  }: UpdateUserRequest = req.body;

  // Basic validation
  if (!user_id || !username || !email || !first_name || !last_name) {
    return res.status(400).json({ success: false, error: 'Required fields missing' });
  }

  try {
    // Check if another user already has this username (excluding current user)
    const usernameCheck = await pool.query(
      'SELECT user_id FROM userdb WHERE username = $1 AND user_id != $2',
      [username, user_id]
    );

    if (usernameCheck.rows.length > 0) {
      return res.status(409).json({ success: false, error: 'Username already in use by another user' });
    }

    // Check if another user already has this email (excluding current user)
    const emailCheck = await pool.query(
      'SELECT user_id FROM userdb WHERE email = $1 AND user_id != $2',
      [email, user_id]
    );

    if (emailCheck.rows.length > 0) {
      return res.status(409).json({ success: false, error: 'Email already in use by another user' });
    }

    // Prepare update data
    const updateData: any = {
      username,
      email,
      first_name,
      last_name,
      address_city: address_city || null,
      address_state: address_state || null,
      phone: phone || null,
      is_active,
      email_verified,
      level,
      updated_at: new Date()
    };

    // Hash password if provided
    if (password && password.trim()) {
      updateData.password_hash = await bcrypt.hash(password, 10);
    }

    // Build dynamic update query
    const fields = Object.keys(updateData);
    const values = Object.values(updateData);
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');

    // Check if level column exists, if not, add it first
    try {
      await pool.query('ALTER TABLE userdb ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 2002');
    } catch (alterError) {
      // Column might already exist or other error, continue
      console.log('Level column check/alter:', alterError);
    }

    const query = `
      UPDATE userdb
      SET ${setClause}
      WHERE user_id = $1
      RETURNING user_id, username, email, first_name, last_name, address_city, address_state, phone, is_active, email_verified, COALESCE(level, 2002) as level, created_at, updated_at
    `;

    const result = await pool.query(query, [user_id, ...values]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    console.log(`✅ User updated: ${username} (${user_id})`);

    res.status(200).json({
      success: true,
      user: result.rows[0]
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
