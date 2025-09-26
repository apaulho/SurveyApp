// scripts/add-multiple-users.ts
const bcrypt = require('bcryptjs');
const pool = require('../lib/neon-db');

async function addMultipleUsers() {
  try {
    const users = [
      // 2 Admins (level 1001)
      {
        username: 'darthvader',
        email: 'darthvader@surveypro.com',
        password: 'password',
        first_name: 'Darth',
        last_name: 'Vader',
        address_city: 'Death Star',
        address_state: 'Empire',
        phone: '555-0101',
        is_active: true,
        email_verified: true,
        level: 1001
      },
      {
        username: 'palpatine',
        email: 'palpatine@surveypro.com',
        password: 'password',
        first_name: 'Emperor',
        last_name: 'Palpatine',
        address_city: 'Coruscant',
        address_state: 'Empire',
        phone: '555-0102',
        is_active: true,
        email_verified: true,
        level: 1001
      },
      // 3 Users (level 2002)
      {
        username: 'lukeskywalker',
        email: 'lukeskywalker@surveypro.com',
        password: 'password',
        first_name: 'Luke',
        last_name: 'Skywalker',
        address_city: 'Tatooine',
        address_state: 'Outer Rim',
        phone: '555-0201',
        is_active: true,
        email_verified: true,
        level: 2002
      },
      {
        username: 'hansolo',
        email: 'hansolo@surveypro.com',
        password: 'password',
        first_name: 'Han',
        last_name: 'Solo',
        address_city: 'Corellia',
        address_state: 'Core Worlds',
        phone: '555-0202',
        is_active: true,
        email_verified: true,
        level: 2002
      },
      {
        username: 'leia',
        email: 'leia@surveypro.com',
        password: 'password',
        first_name: 'Princess',
        last_name: 'Leia',
        address_city: 'Alderaan',
        address_state: 'Core Worlds',
        phone: '555-0203',
        is_active: true,
        email_verified: true,
        level: 2002
      }
    ];

    for (const user of users) {
      // Hash the password
      const passwordHash = await bcrypt.hash(user.password, 10);

      // Insert user
      const result = await pool.query(`
        INSERT INTO userdb (
          username, email, password_hash, first_name, last_name,
          address_city, address_state, phone, is_active, email_verified
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
        )
        RETURNING user_id, username, email, first_name, last_name
      `, [
        user.username, user.email, passwordHash, user.first_name, user.last_name,
        user.address_city, user.address_state, user.phone, user.is_active, user.email_verified
      ]);

      console.log(`✅ User created: ${user.username} (${user.level})`);
      console.log('Details:', result.rows[0]);
      console.log('---');
    }

    console.log('\n🎉 All users created successfully!');
    console.log('\n🔐 Login credentials for all users:');
    console.log('Username: [username]');
    console.log('Password: password');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating users:', error);
    process.exit(1);
  }
}

addMultipleUsers();
