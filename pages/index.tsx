import React, { useState } from 'react';

interface Question {
  id: number;
  question_number: number;
  text: string;
  category: string | null;
  group_name: string | null;
}

const sampleQuestions: Question[] = [
  { id: 1, question_number: 1, text: 'How satisfied are you with our service?', category: 'General', group_name: 'All' },
  { id: 2, question_number: 2, text: 'Would you recommend us?', category: 'General', group_name: 'All' },
];

export default function Home() {
  const [userType, setUserType] = useState<'guest' | 'user' | 'admin' | 'survey-login'>('guest');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [userUsername, setUserUsername] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [userLoginError, setUserLoginError] = useState('');
  const [dbTestResult, setDbTestResult] = useState('');
  const [dbTestStatus, setDbTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  const startSurvey = () => {
    setUserType('survey-login');
  };

  const showMainPage = () => {
    setUserType('guest');
  };

  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserLoginError('');

    // Client-side validation
    if (!userUsername.trim() || !userPassword.trim()) {
      setUserLoginError('Please enter both username and password');
      return;
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userUsername.trim(),
          password: userPassword.trim()
        })
      });

      const data = await response.json();

      if (response.ok && data.success && data.user) {
        setUserType('user');
        setUserLoginError('');
        setUserUsername('');
        setUserPassword('');
      } else {
        setUserLoginError(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('User login error:', error);
      setUserLoginError('Network error. Please try again.');
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    // Client-side validation
    if (!adminUsername.trim() || !adminPassword.trim()) {
      setLoginError('Please enter both username and password');
      return;
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: adminUsername.trim(),
          password: adminPassword.trim()
        })
      });

      const data = await response.json();

      if (response.ok && data.success && data.user) {
        setUserType('admin');
        setLoginError('');
        setAdminUsername('');
        setAdminPassword('');
      } else {
        setLoginError(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      setLoginError('Network error. Please try again.');
    }
  };

  const testDatabaseConnection = async () => {
    setDbTestStatus('testing');
    setDbTestResult('Testing...');

    try {
      const response = await fetch('/api/test-db');
      const data = await response.json();

      if (data.success) {
        setDbTestResult(`✅ Connected! ${data.user_count} users in database`);
        setDbTestStatus('success');
      } else {
        setDbTestResult(`❌ ${data.message}`);
        setDbTestStatus('error');
      }
    } catch (error) {
      console.error('Database test error:', error);
      setDbTestResult('❌ API not available');
      setDbTestStatus('error');
    }
  };

  if (userType === 'survey-login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Your Survey</h2>
              <p className="text-gray-600">Enter your credentials to begin</p>
            </div>
            <form onSubmit={handleUserLogin} className="space-y-6">
              <div>
                <input
                  type="text"
                  placeholder="Username"
                  value={userUsername}
                  onChange={(e) => setUserUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-300"
              >
                Start Survey
              </button>
              {userLoginError && <p className="text-red-500 text-center mt-4">{userLoginError}</p>}
              <div className="text-center mt-4">
                <button
                  onClick={showMainPage}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  ← Back to Home
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (userType === 'guest') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Header */}
        <header className="bg-gray-100 shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">SurveyPro</h1>
              <nav className="hidden md:flex space-x-8">
                <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
                <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
                <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              SURVEYS BY DESIGN
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              We create intelligent surveys that drive organizational improvement through data-driven insights and meaningful feedback.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button
                onClick={startSurvey}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Start Survey
              </button>
              <a
                href="#learn-more"
                className="bg-white hover:bg-gray-50 text-blue-600 font-semibold py-3 px-8 rounded-lg border-2 border-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Admin Login Section */}
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8" id="admin-login">
            <h2 className="text-2xl font-semibold text-gray-900 text-center mb-6">Administrator Access</h2>
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <button
                onClick={testDatabaseConnection}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 text-sm"
              >
                Test Database Connection
              </button>
              {dbTestResult && (
                <div className={`text-xs mt-2 text-center ${
                  dbTestStatus === 'success' ? 'text-green-600' :
                  dbTestStatus === 'error' ? 'text-red-600' : 'text-blue-600'
                }`}>
                  {dbTestResult}
                </div>
              )}
            </div>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Username"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-300"
              >
                Login as Administrator
              </button>
              {loginError && <p className="text-red-500 text-center mt-4">{loginError}</p>}
            </form>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-gray-400">&copy; 2024 SurveyPro. Transforming feedback into action.</p>
          </div>
        </footer>

        <style jsx>{`
          .card-hover {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .card-hover:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-100 shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">SurveyPro</h1>
            <button
              onClick={() => setUserType('guest')}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Survey Dashboard</h1>
          {userType === 'admin' && <p className="text-green-600 font-medium">Logged in as Administrator</p>}
          {userType === 'user' && <p className="text-blue-600 font-medium">Logged in as User</p>}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Survey Questions</h2>
          {sampleQuestions.length === 0 ? (
            <p className="text-gray-600">No questions available.</p>
          ) : (
            <ul className="space-y-6">
              {sampleQuestions.map(q => (
                <li key={q.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-300">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{q.question_number}. {q.text}</h3>
                  {q.category && <p className="text-sm text-blue-600 font-medium">Category: {q.category}</p>}
                  {q.group_name && <p className="text-sm text-gray-600">Group: {q.group_name}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
