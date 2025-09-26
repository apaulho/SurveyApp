// pages/api/admin/users.ts
import pool from '../../../lib/neon-db';
import type { NextApiRequest, NextApiResponse } from 'next';

interface User {
  user_id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  address_city?: string;
  address_state?: string;
  phone?: string;
  is_active: boolean;
  email_verified: boolean;
  level: number;
}

interface AdminUsersResponse {
  success: boolean;
  users?: User[];
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AdminUsersResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Fetch all users with all fields
    const usersResult = await pool.query(
      'SELECT user_id, username, email, first_name, last_name, address_city, address_state, phone, is_active, email_verified FROM userdb ORDER BY user_id'
    );

    // Add user levels (for demo purposes, using username-based logic)
    const users: User[] = usersResult.rows.map(user => {
      let level = 2002; // Default to user level

      // Admin users
      const adminUsers = ['darthvader', 'palpatine'];
      if (adminUsers.includes(user.username.toLowerCase())) {
        level = 1001;
      }

      return {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        address_city: user.address_city,
        address_state: user.address_state,
        phone: user.phone,
        is_active: user.is_active,
        email_verified: user.email_verified,
        level: level
      };
    });

    res.status(200).json({
      success: true,
      users: users
    });

  } catch (error) {
    console.error('Admin users fetch error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
