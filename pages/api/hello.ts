// pages/api/hello.ts - Simple API route for testing
import type { NextApiRequest, NextApiResponse } from 'next';

interface HelloResponse {
  message: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<HelloResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  res.status(200).json({ message: 'Hello from Next.js API on Netlify!' });
}
