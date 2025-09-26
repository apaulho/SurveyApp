// pages/api/reset-password.ts
import bcrypt from 'bcryptjs';
import pool from '../../lib/neon-db';
import type { NextApiRequest, NextApiResponse } from 'next';

interface ResetPasswordRequest {
  token: string;
  email: string;
  newPassword: string;
}

interface ApiResponse {
  success?: boolean;
  error?: string;
  message?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, email, newPassword }: ResetPasswordRequest = req.body;

  // Basic validation
  if (!token || !email || !newPassword) {
    return res.status(400).json({ error: 'Token, email, and new password are required' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  try {
    // Check if user exists
    const userResult = await pool.query(
      'SELECT user_id, username FROM userdb WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid reset token or email' });
    }

    const user = userResult.rows[0];

    // For demo purposes, we'll accept any token
    // In production, you'd validate the token against a stored reset token with expiry

    // Hash the new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    await pool.query(
      'UPDATE userdb SET password_hash = $1 WHERE user_id = $2',
      [passwordHash, user.user_id]
    );

    console.log(`🔐 PASSWORD RESET SUCCESSFUL`);
    console.log(`👤 User: ${user.username} (${email})`);
    console.log(`✅ Password updated successfully`);
    console.log('=' .repeat(50));

    res.status(200).json({
      success: true,
      message: 'Password reset successful!'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
