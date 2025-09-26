// pages/api/forgot-password.ts
import crypto from 'crypto';
import pool from '../../lib/neon-db';
import { EmailService } from '../../lib/email-service';
import type { NextApiRequest, NextApiResponse } from 'next';

interface ForgotPasswordRequest {
  email: string;
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

  const { email }: ForgotPasswordRequest = req.body;

  // Basic validation
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    // Check if user exists
    const userResult = await pool.query(
      'SELECT user_id, username, email FROM userdb WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      // For security, don't reveal if email exists or not
      return res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
    }

    const user = userResult.rows[0];

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // For development/demo purposes, we'll log the reset link
    // In production, you'd send this via email
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    // Send the reset email
    const emailSent = await EmailService.sendPasswordResetEmail(email, resetLink);

    if (!emailSent) {
      console.error('Failed to send password reset email');
      return res.status(500).json({ error: 'Failed to send reset email' });
    }

    console.log('🔐 PASSWORD RESET REQUEST');
    console.log('📧 Email:', email);
    console.log('🔗 Reset Link:', resetLink);
    console.log('⏰ Expires:', resetTokenExpiry.toISOString());
    console.log('✅ Email sent successfully');
    console.log('=' .repeat(50));

    // In a real application, you'd store the reset token in the database
    // For demo purposes, we'll just simulate success

    res.status(200).json({
      success: true,
      message: 'Password reset link sent! Check your email (in development mode, check the console).'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
