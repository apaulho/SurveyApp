// scripts/register-starwars-users.ts
// Script to automatically register the 5 Star Wars users via API

const users = [
  // Admins (level 1001)
  {
    username: 'darthvader',
    email: 'darthvader@surveypro.com',
    password: 'password',
    first_name: 'Darth',
    last_name: 'Vader',
    address_city: 'Death Star',
    address_state: 'Empire',
    phone: '555-0101'
  },
  {
    username: 'palpatine',
    email: 'palpatine@surveypro.com',
    password: 'password',
    first_name: 'Emperor',
    last_name: 'Palpatine',
    address_city: 'Coruscant',
    address_state: 'Empire',
    phone: '555-0102'
  },
  // Users (level 2002)
  {
    username: 'lukeskywalker',
    email: 'lukeskywalker@surveypro.com',
    password: 'password',
    first_name: 'Luke',
    last_name: 'Skywalker',
    address_city: 'Tatooine',
    address_state: 'Outer Rim',
    phone: '555-0201'
  },
  {
    username: 'hansolo',
    email: 'hansolo@surveypro.com',
    password: 'password',
    first_name: 'Han',
    last_name: 'Solo',
    address_city: 'Corellia',
    address_state: 'Core Worlds',
    phone: '555-0202'
  },
  {
    username: 'leia',
    email: 'leia@surveypro.com',
    password: 'password',
    first_name: 'Princess',
    last_name: 'Leia',
    address_city: 'Alderaan',
    address_state: 'Core Worlds',
    phone: '555-0203'
  }
];

async function registerUser(userData: typeof users[0]) {
  try {
    const response = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (response.ok) {
      console.log(`✅ User registered: ${userData.username} (${userData.first_name} ${userData.last_name})`);
      return true;
    } else {
      console.log(`❌ Failed to register ${userData.username}: ${data.error || 'Unknown error'}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Error registering ${userData.username}: ${error}`);
    return false;
  }
}

async function registerAllUsers() {
  console.log('🚀 Starting Star Wars user registration...\n');

  let successCount = 0;
  let failCount = 0;

  for (const user of users) {
    const success = await registerUser(user);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }

    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\n🎉 Registration complete!`);
  console.log(`✅ Successfully registered: ${successCount} users`);
  console.log(`❌ Failed registrations: ${failCount} users`);
  console.log(`\n🔐 Login credentials for all users:`);
  console.log(`Username: [username]`);
  console.log(`Password: password`);
  console.log(`\n📋 User list:`);
  users.forEach(user => {
    console.log(`- ${user.username} (${user.first_name} ${user.last_name})`);
  });
}

// Run the registration
registerAllUsers().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});
