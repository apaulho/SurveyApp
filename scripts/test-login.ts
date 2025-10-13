// scripts/test-login.ts
// Test script for login functionality

async function testLogin(username: string, password: string) {
  console.log(`🧪 Testing login for: ${username}`);

  try {
    const response = await fetch('http://localhost:3001/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    console.log(`📊 Response Status: ${response.status}`);
    console.log(`📄 Response Data:`, JSON.stringify(data, null, 2));

    if (response.ok && data.success) {
      console.log(`✅ Login successful for ${username}!`);
      console.log(`👤 User Level: ${data.user.level}`);
      console.log(`📧 Email: ${data.user.email}`);
      const redirectPath = data.user.level === 1001 ? '/admin' : '/dashboard';
      console.log(`🔗 Would redirect to: ${redirectPath}`);
    } else {
      console.log(`❌ Login failed for ${username}: ${data.error}`);
    }

    console.log('=' .repeat(50));
    return data;

  } catch (error) {
    console.error(`💥 Error testing login for ${username}:`, error);
    return null;
  }
}

async function testAllUsers() {
  console.log('🚀 Testing Complete Login System\n');

  const testUsers = [
    { username: 'darthvader', password: 'password', expectedLevel: 1001 },
    { username: 'palpatine', password: 'password', expectedLevel: 1001 },
    { username: 'lukeskywalker', password: 'password', expectedLevel: 2002 },
    { username: 'hansolo', password: 'password', expectedLevel: 2002 },
    { username: 'leia', password: 'password', expectedLevel: 2002 },
    { username: 'invaliduser', password: 'wrongpass', expectedLevel: null }
  ];

  let passedTests = 0;
  let totalTests = testUsers.length;

  for (const user of testUsers) {
    const result = await testLogin(user.username, user.password);

    if (user.expectedLevel === null) {
      // Should fail
      if (!result || !result.success) {
        passedTests++;
        console.log(`✅ Expected failure for invalid user`);
      } else {
        console.log(`❌ Unexpected success for invalid user`);
      }
    } else {
      // Should succeed with correct level
      if (result && result.success && result.user && result.user.level === user.expectedLevel) {
        passedTests++;
        console.log(`✅ Correct level (${user.expectedLevel}) for ${user.username}`);
      } else {
        console.log(`❌ Wrong level for ${user.username}. Expected: ${user.expectedLevel}, Got: ${result?.user?.level}`);
      }
    }
  }

  console.log(`\n📊 Test Results:`);
  console.log(`✅ Passed: ${passedTests}/${totalTests}`);
  console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`);

  if (passedTests === totalTests) {
    console.log(`🎉 All login tests passed!`);
  } else {
    console.log(`⚠️ Some tests failed. Check the output above.`);
  }
}

// Run the tests
testAllUsers();
