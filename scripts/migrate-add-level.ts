// scripts/migrate-add-level.ts
// Run this script to add the level field to the userdb table

import pool from '../lib/neon-db';

async function migrateDatabase() {
  try {
    console.log('🚀 Starting database migration...');

    // Add level column if it doesn't exist
    console.log('📝 Adding level column to userdb...');
    await pool.query(`
      ALTER TABLE userdb
      ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 2002;
    `);

    // Update existing admin users
    console.log('👑 Setting admin levels for existing users...');
    await pool.query(`
      UPDATE userdb
      SET level = 1001
      WHERE username IN ('darthvader', 'palpatine') AND (level IS NULL OR level != 1001);
    `);

    // Ensure all other users have level 2002 (if not set)
    await pool.query(`
      UPDATE userdb
      SET level = 2002
      WHERE level IS NULL;
    `);

    console.log('✅ Migration completed successfully!');
    console.log('📊 User levels updated:');
    console.log('   - darthvader, palpatine: Level 1001 (Admin)');
    console.log('   - All others: Level 2002 (User)');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

migrateDatabase();
