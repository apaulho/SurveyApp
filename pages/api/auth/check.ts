// pages/api/auth/check.ts
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

interface User {
  user_id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  level: number;
}

interface AuthCheckResponse {
  authenticated: boolean;
  user?: User;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AuthCheckResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      authenticated: false,
      error: 'Method not allowed'
    });
  }

  try {
    // Get the auth token from cookies
    const token = req.cookies['auth-token'];

    if (!token) {
      return res.status(401).json({
        authenticated: false,
        error: 'No authentication token provided'
      });
    }

    // Verify the JWT token
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, JWT_SECRET) as User;

    // Return the user data
    return res.status(200).json({
      authenticated: true,
      user: {
        user_id: decoded.user_id,
        username: decoded.username,
        email: decoded.email,
        first_name: decoded.first_name,
        last_name: decoded.last_name,
        level: decoded.level
      }
    });

  } catch (error) {
    console.error('Auth check error:', error);
    return res.status(401).json({
      authenticated: false,
      error: 'Invalid authentication token'
    });
  }
}
