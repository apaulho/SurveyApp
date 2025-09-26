// pages/dashboard.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface User {
  user_id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  level: number;
}

interface Survey {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'active' | 'draft' | 'completed';
  questions: number;
  responses: number;
}

export default function SurveyDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    // For now, show sample surveys
    loadSampleSurveys();
    setLoading(false);
  }, [router]);

  const loadSampleSurveys = () => {
    // Sample surveys for demonstration
    const sampleSurveys: Survey[] = [
      {
        id: '1',
        title: 'Employee Satisfaction Survey',
        description: 'Help us improve your work experience by sharing your feedback.',
        category: 'Employee Engagement',
        status: 'active',
        questions: 15,
        responses: 0
      },
      {
        id: '2',
        title: 'Product Feedback Survey',
        description: 'Tell us what you think about our latest product features.',
        category: 'Product',
        status: 'active',
        questions: 8,
        responses: 0
      },
      {
        id: '3',
        title: 'Customer Service Experience',
        description: 'Rate your recent customer service interaction.',
        category: 'Customer Service',
        status: 'active',
        questions: 10,
        responses: 0
      }
    ];

    setSurveys(sampleSurveys);
  };

  const logout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  const takeSurvey = (surveyId: string) => {
    // For now, just show an alert
    alert(`Taking survey: ${surveyId}\n\nThis feature will be implemented soon!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">SurveyPro Dashboard</h1>
              <span className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                User Dashboard
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.first_name}!</span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                Welcome back, {user?.first_name}!
              </h2>
              <p className="text-sm text-gray-600">
                Here are the surveys available for you to complete. Your feedback helps us improve our services.
              </p>
            </div>
          </div>

          {/* Survey Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Completed Surveys</dt>
                      <dd className="text-lg font-medium text-gray-900">0</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Pending Surveys</dt>
                      <dd className="text-lg font-medium text-gray-900">{surveys.length}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Response Rate</dt>
                      <dd className="text-lg font-medium text-gray-900">0%</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Available Surveys */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Available Surveys</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Complete these surveys to share your valuable feedback.</p>
            </div>
            <ul className="divide-y divide-gray-200">
              {surveys.map((survey) => (
                <li key={survey.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">{survey.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{survey.description}</p>
                          <div className="flex items-center mt-2 space-x-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {survey.category}
                            </span>
                            <span className="text-sm text-gray-500">
                              {survey.questions} questions
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              survey.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : survey.status === 'draft'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {survey.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <button
                        onClick={() => takeSurvey(survey.id)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Take Survey
                      </button>
                    </div>
                  </div>
                </li>
              ))}
              {surveys.length === 0 && (
                <li className="px-4 py-8 text-center text-gray-500">
                  No surveys available at this time. Check back later!
                </li>
              )}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
