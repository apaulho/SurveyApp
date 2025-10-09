import React from 'react';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-gray-100 shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <a href="/" className="text-2xl font-bold text-gray-900">SurveyPro</a>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="/about" className="text-blue-600 font-medium transition-colors">About</a>
              <a href="/login" className="text-gray-600 hover:text-blue-600 transition-colors">Login</a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* About Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            About SurveyPro
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Revolutionizing organizational feedback through intelligent survey design and data-driven insights.
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Story</h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Starting in Naboo</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                SurveyPro began its journey on the peaceful planet of Naboo, inspired by the planet's emphasis on
                harmony, diplomacy, and careful decision-making. Just as Naboo's leaders sought to understand
                their people's needs through thoughtful governance, we recognized the importance of truly
                listening to employee voices in modern organizations.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Our founders, drawing inspiration from Naboo's commitment to peaceful resolution and
                collaborative problem-solving, created SurveyPro to bridge the gap between organizational
                leadership and frontline employees. We believe that every voice matters, and that data-driven
                insights should serve humanity's collective progress.
              </p>
            </div>

            <div className="text-center">
              <div className="w-64 h-64 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <div className="text-center text-white">
                  <div className="text-6xl mb-2">🌟</div>
                  <div className="text-xl font-semibold">Naboo</div>
                  <div className="text-sm opacity-90">Our Origin</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Mission</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Data-Driven Insights</h3>
              <p className="text-gray-600">Transform raw feedback into actionable intelligence that drives meaningful organizational change.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Employee Engagement</h3>
              <p className="text-gray-600">Foster a culture of continuous feedback and improvement across all levels of your organization.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-Time Analytics</h3>
              <p className="text-gray-600">Monitor survey responses in real-time with comprehensive analytics and reporting tools.</p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Values</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-3xl mb-4">🤝</div>
              <h4 className="font-semibold text-gray-900 mb-2">Collaboration</h4>
              <p className="text-sm text-gray-600">Working together to achieve shared goals</p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-3xl mb-4">🎯</div>
              <h4 className="font-semibold text-gray-900 mb-2">Excellence</h4>
              <p className="text-sm text-gray-600">Striving for the highest quality in everything we do</p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-3xl mb-4">🌱</div>
              <h4 className="font-semibold text-gray-900 mb-2">Growth</h4>
              <p className="text-sm text-gray-600">Continuous learning and improvement</p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-3xl mb-4">⚖️</div>
              <h4 className="font-semibold text-gray-900 mb-2">Integrity</h4>
              <p className="text-sm text-gray-600">Honest, transparent, and ethical practices</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Organization?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of organizations using SurveyPro to drive meaningful change.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/"
              className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Get Started Today
            </a>
            <a
              href="#contact"
              className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Contact Us
            </a>
          </div>
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
