import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import db from '../../lib/db';

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
    const admin = db.prepare('SELECT * FROM admins WHERE username = ?').get(username);

    if (!admin) {
      return res.status(401).json({ success: false });
    }

    const isValid = await bcrypt.compare(password, admin.password_hash);

    if (isValid) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(401).json({ success: false });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false });
  }
}
