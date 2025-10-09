// pages/api/auth/logout.ts
import type { NextApiRequest, NextApiResponse } from 'next';

interface LogoutResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LogoutResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Clear the authentication cookies
    res.setHeader('Set-Cookie', [
      'auth-token=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/',
      'user-session=; Secure; SameSite=Strict; Max-Age=0; Path=/'
    ]);

    console.log('✅ User logged out successfully');

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
