// scripts/test-forgot-password.ts
// Test script for forgot password functionality

async function testForgotPassword() {
  console.log('🧪 Testing Forgot Password Functionality\n');

  const testEmail = 'lukeskywalker@surveypro.com';

  try {
    console.log(`📧 Testing with email: ${testEmail}`);

    const response = await fetch('http://localhost:3001/api/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: testEmail })
    });

    const data = await response.json();

    console.log(`📊 Response Status: ${response.status}`);
    console.log(`📄 Response Data:`, data);

    if (response.ok) {
      console.log('✅ Forgot password request successful!');
    } else {
      console.log('❌ Forgot password request failed!');
    }

  } catch (error) {
    console.error('💥 Test failed:', error);
  }
}

// Run the test
testForgotPassword();
