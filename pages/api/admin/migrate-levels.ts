// pages/api/admin/migrate-levels.ts
import pool from '../../../lib/neon-db';
import type { NextApiRequest, NextApiResponse } from 'next';

interface MigrationResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MigrationResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    console.log('🚀 Starting database migration for level field...');

    // Add level column if it doesn't exist
    console.log('📝 Adding level column to userdb...');
    await pool.query(`
      ALTER TABLE userdb
      ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 2002;
    `);

    // Update existing admin users
    console.log('👑 Setting admin levels for existing users...');
    const adminResult = await pool.query(`
      UPDATE userdb
      SET level = 1001
      WHERE username IN ('darthvader', 'palpatine') AND (level IS NULL OR level != 1001);
    `);

    // Ensure all other users have level 2002 (if not set)
    const userResult = await pool.query(`
      UPDATE userdb
      SET level = 2002
      WHERE level IS NULL;
    `);

    console.log('✅ Migration completed successfully!');
    console.log(`📊 Updated ${adminResult.rowCount} admin users and ${userResult.rowCount} regular users`);

    res.status(200).json({
      success: true,
      message: `Migration completed! Updated ${adminResult.rowCount} admin users and ${userResult.rowCount} regular users with level field.`
    });

  } catch (error) {
    console.error('❌ Migration failed:', error);
    res.status(500).json({
      success: false,
      error: 'Migration failed: ' + (error as Error).message
    });
  }
}
