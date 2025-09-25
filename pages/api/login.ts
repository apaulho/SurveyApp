import type { NextApiRequest, NextApiResponse } from 'next';

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
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
    // Simple demo authentication - for production, use proper authentication
    if (username === 'admin' && password === 'password') {
      return res.status(200).json({ success: true });
    } else {
      return res.status(401).json({ success: false });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false });
  }
}
