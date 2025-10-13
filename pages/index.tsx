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
  const [questions] = useState<Question[]>(sampleQuestions);
  const [userType, setUserType] = useState<'guest' | 'user' | 'admin'>('guest');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleUserLogin = () => {
    setUserType('user');
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // For demo purposes, accept any username/password combination
    if (adminUsername && adminPassword) {
      setUserType('admin');
      setLoginError('');
    } else {
      setLoginError('Please enter both username and password');
    }
  };

  if (userType === 'guest') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-100">
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
                onClick={handleUserLogin}
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

          {/* Value Proposition */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Data-Driven Insights</h3>
              <p className="text-gray-600">Transform feedback into actionable insights that drive real organizational change.</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-Time Analytics</h3>
              <p className="text-gray-600">Monitor survey responses in real-time with comprehensive analytics and reporting tools.</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Employee Engagement</h3>
              <p className="text-gray-600">Foster a culture of continuous feedback and improvement across your organization.</p>
            </div>
          </div>

          {/* Admin Login Section */}
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8" id="admin-login">
            <h2 className="text-2xl font-semibold text-gray-900 text-center mb-6">Administrator Access</h2>
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-100">
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
          {questions.length === 0 ? (
            <p className="text-gray-600">No questions available.</p>
          ) : (
            <ul className="space-y-6">
              {questions.map(q => (
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
