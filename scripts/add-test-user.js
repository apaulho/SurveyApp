// scripts/add-test-user.js
const bcrypt = require('bcryptjs');
const pool = require('../lib/neon-db');

async function addTestUser() {
  try {
    // Hash the password
    const passwordHash = await bcrypt.hash('password', 10);

    // Insert test user
    const result = await pool.query(`
      INSERT INTO userdb (
        username, email, password_hash, first_name, last_name,
        address_city, address_state, phone, is_active, email_verified
      ) VALUES (
        'admin', 'admin@surveypro.com', $1, 'Admin', 'User',
        'New York', 'NY', '555-0123', true, true
      )
      RETURNING user_id, username, email, first_name, last_name
    `, [passwordHash]);

    console.log('✅ Test user created successfully!');
    console.log('User details:', result.rows[0]);
    console.log('\n🔐 Login credentials:');
    console.log('Username: admin');
    console.log('Password: password');

    // Add a test company
    const companyResult = await pool.query(`
      INSERT INTO companydb (
        company_name, address_city, address_state, phone, email,
        industry, main_contact_id, is_active
      ) VALUES (
        'SurveyPro Corp', 'New York', 'NY', '555-0123', 'info@surveypro.com',
        'Technology', $1, true
      )
      RETURNING company_id, company_name
    `, [result.rows[0].user_id]);

    console.log('\n🏢 Test company created!');
    console.log('Company details:', companyResult.rows[0]);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating test user:', error);
    process.exit(1);
  }
}

addTestUser();
