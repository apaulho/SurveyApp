// pages/admin.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface User {
  user_id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  address_city?: string;
  address_state?: string;
  phone?: string;
  is_active: boolean;
  email_verified: boolean;
  level: number;
  created_at?: string;
  updated_at?: string;
}

interface Question {
  question_id: number;
  question_text: string;
  question_type: string;
  category?: string | null;
  company_id?: number | null;
  created_by_user_id?: number | null;
  created_at?: string;
  updated_at?: string;
  is_active: boolean;
  sort_order: number;
  required: boolean;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showCreateQuestionModal, setShowCreateQuestionModal] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    address_city: '',
    address_state: '',
    phone: '',
    level: 2002,
    is_active: true,
    email_verified: true
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [migrationMessage, setMigrationMessage] = useState('');
  const [editFormData, setEditFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    address_city: '',
    address_state: '',
    phone: '',
    is_active: true,
    email_verified: false,
    level: 2002
  });

  const [createQuestionData, setCreateQuestionData] = useState({
    question_text: '',
    question_type: 'text',
    category: '',
    sort_order: 0,
    required: false,
    is_active: true,
  });

  useEffect(() => {
    // Check if user is logged in and is admin
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.level !== 1001) {
      router.push('/dashboard');
      return;
    }

    setUser(parsedUser);
    fetchUsers();
    fetchQuestions();
  }, [router]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Survey Questions: modal controls and create action
  const openCreateQuestionModal = () => {
    setCreateQuestionData({
      question_text: '',
      question_type: 'text',
      category: '',
      sort_order: 0,
      required: false,
      is_active: true,
    });
    setShowCreateQuestionModal(true);
  };

  const closeCreateQuestionModal = () => {
    setShowCreateQuestionModal(false);
  };

  const createQuestion = async () => {
    try {
      const payload = {
        ...createQuestionData,
        category: createQuestionData.category?.trim() || null,
        created_by_user_id: user?.user_id || null,
      };
      const response = await fetch('/api/admin/create-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setQuestions((prev) => [...prev, data.question].sort((a, b) => (a.sort_order - b.sort_order) || (a.question_id - b.question_id)));
        closeCreateQuestionModal();
        alert('Question created successfully!');
      } else {
        alert(data.error || 'Failed to create question');
      }
    } catch (error) {
      console.error('Create question error:', error);
      alert('Failed to create question');
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/admin/questions');
      if (response.ok) {
        const data = await response.json();
        setQuestions(data.questions || []);
      }
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    }
  };

  const runMigration = async () => {
    try {
      setMigrationMessage('Running migration...');
      const response = await fetch('/api/admin/migrate-levels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMigrationMessage(data.message);
        // Refresh users list to show updated levels
        fetchUsers();
      } else {
        setMigrationMessage('Migration failed: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Migration error:', error);
      setMigrationMessage('Migration failed: Network error');
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  const openEditModal = (userToEdit: User) => {
    setEditingUser(userToEdit);
    setEditFormData({
      username: userToEdit.username,
      email: userToEdit.email,
      password: '', // Don't pre-fill password
      first_name: userToEdit.first_name,
      last_name: userToEdit.last_name,
      address_city: userToEdit.address_city || '',
      address_state: userToEdit.address_state || '',
      phone: userToEdit.phone || '',
      is_active: userToEdit.is_active,
      email_verified: userToEdit.email_verified,
      level: userToEdit.level
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingUser(null);
    setEditFormData({
      username: '',
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      address_city: '',
      address_state: '',
      phone: '',
      is_active: true,
      email_verified: false,
      level: 2002
    });
  };

  const saveUserChanges = async () => {
    if (!editingUser) return;

    try {
      const response = await fetch('/api/admin/update-user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: editingUser.user_id,
          ...editFormData
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update the users list with the new data
        setUsers(users.map(u =>
          u.user_id === editingUser.user_id ? data.user : u
        ));
        closeEditModal();
        alert('User updated successfully!');
      } else {
        alert(data.error || 'Failed to update user');
      }
    } catch (error) {
      console.error('Update user error:', error);
      alert('Failed to update user');
    }
  };

  const openCreateModal = () => {
    setCreateFormData({
      username: '',
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      address_city: '',
      address_state: '',
      phone: '',
      level: 2002,
      is_active: true,
      email_verified: true
    });
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setCreateFormData({
      username: '',
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      address_city: '',
      address_state: '',
      phone: '',
      level: 2002,
      is_active: true,
      email_verified: true
    });
  };

  const createNewUser = async () => {
    try {
      const response = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createFormData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Add the new user to the users list
        setUsers([...users, data.user]);
        closeCreateModal();
        alert('User created successfully!');
      } else {
        alert(data.error || 'Failed to create user');
      }
    } catch (error) {
      console.error('Create user error:', error);
      alert('Failed to create user');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">SurveyPro Admin</h1>
              <span className="ml-4 px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                Administrator
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Stats Cards */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                      <dd className="text-lg font-medium text-gray-900">{users.length}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Active Surveys</dt>
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
                    <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
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

          {/* User Management */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">User Management</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage all registered users in the system.</p>
                </div>
                <button
                  onClick={openCreateModal}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create User
                </button>
              </div>
            </div>

            {/* Migration Section */}
            <div className="px-4 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Database Migration</h4>
                  <p className="text-sm text-gray-500">Add level field to existing users</p>
                </div>
                <button
                  onClick={runMigration}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Run Migration
                </button>
              </div>
              {migrationMessage && (
                <div className={`mt-2 text-sm ${migrationMessage.includes('failed') ? 'text-red-600' : 'text-green-600'}`}>
                  {migrationMessage}
                </div>
              )}
            </div>
            <ul className="divide-y divide-gray-200">
              {users.length > 0 ? (
                users.map((user) => (
                  <li key={user.user_id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {user.first_name[0]}{user.last_name[0]}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.first_name} {user.last_name}
                          </div>
                          <div className="text-sm text-gray-500">@{user.username}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.level === 1001
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.level === 1001 ? 'Admin' : 'User'}
                        </span>
                        <div className="ml-4 text-sm text-gray-500">{user.email}</div>
                        <button
                          onClick={() => openEditModal(user)}
                          className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-xs font-medium"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-4 py-8 text-center text-gray-500">
                  No users found. Users will appear here after registration.
                </li>
              )}
            </ul>
          </div>

          {/* Survey Questions Management */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md mt-8">
            <div className="px-4 py-5 sm:px-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Survey Questions</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage questions stored in `questiondb`.</p>
                </div>
                <button
                  onClick={openCreateQuestionModal}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
               >
                  <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Question
                </button>
              </div>
            </div>
            <ul className="divide-y divide-gray-200">
              {questions.length > 0 ? (
                questions.map((q) => (
                  <li key={q.question_id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{q.question_text}</div>
                        <div className="mt-1 text-sm text-gray-500">
                          Type: <span className="font-medium">{q.question_type}</span>
                          {q.category ? <> · Category: <span className="font-medium">{q.category}</span></> : null}
                          <> · Sort: <span className="font-medium">{q.sort_order}</span></>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${q.required ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                          {q.required ? 'Required' : 'Optional'}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${q.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {q.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-4 py-8 text-center text-gray-500">No questions found.</li>
              )}
            </ul>
          </div>
        </div>
      </main>

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Edit User</h3>
              <button
                onClick={closeEditModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    value={editFormData.username}
                    onChange={(e) => setEditFormData({ ...editFormData, username: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password (leave blank to keep current)</label>
                <input
                  type="password"
                  value={editFormData.password}
                  onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter new password or leave blank"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={editFormData.first_name}
                    onChange={(e) => setEditFormData({ ...editFormData, first_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={editFormData.last_name}
                    onChange={(e) => setEditFormData({ ...editFormData, last_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={editFormData.address_city}
                    onChange={(e) => setEditFormData({ ...editFormData, address_city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    value={editFormData.address_state}
                    onChange={(e) => setEditFormData({ ...editFormData, address_state: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User Level</label>
                <select
                  value={editFormData.level}
                  onChange={(e) => setEditFormData({ ...editFormData, level: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value={2002}>User (2002)</option>
                  <option value={1001}>Admin (1001)</option>
                </select>
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editFormData.is_active}
                    onChange={(e) => setEditFormData({ ...editFormData, is_active: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Active User</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editFormData.email_verified}
                    onChange={(e) => setEditFormData({ ...editFormData, email_verified: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Email Verified</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={saveUserChanges}
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Create New User</h3>
              <button
                onClick={closeCreateModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
                  <input
                    type="text"
                    value={createFormData.username}
                    onChange={(e) => setCreateFormData({ ...createFormData, username: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                    placeholder="Enter username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={createFormData.email}
                    onChange={(e) => setCreateFormData({ ...createFormData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                    placeholder="Enter email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <input
                  type="password"
                  value={createFormData.password}
                  onChange={(e) => setCreateFormData({ ...createFormData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                  placeholder="Enter password (min 6 characters)"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    value={createFormData.first_name}
                    onChange={(e) => setCreateFormData({ ...createFormData, first_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    value={createFormData.last_name}
                    onChange={(e) => setCreateFormData({ ...createFormData, last_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={createFormData.address_city}
                    onChange={(e) => setCreateFormData({ ...createFormData, address_city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    value={createFormData.address_state}
                    onChange={(e) => setCreateFormData({ ...createFormData, address_state: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter state"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={createFormData.phone}
                  onChange={(e) => setCreateFormData({ ...createFormData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User Level</label>
                <select
                  value={createFormData.level}
                  onChange={(e) => setCreateFormData({ ...createFormData, level: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={2002}>User (2002)</option>
                  <option value={1001}>Admin (1001)</option>
                </select>
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={createFormData.is_active}
                    onChange={(e) => setCreateFormData({ ...createFormData, is_active: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Active User</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={createFormData.email_verified}
                    onChange={(e) => setCreateFormData({ ...createFormData, email_verified: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Email Verified</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={closeCreateModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={createNewUser}
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Create User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Question Modal */}
      {showCreateQuestionModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Create New Question</h3>
              <button onClick={closeCreateQuestionModal} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Question Text *</label>
                <textarea
                  value={createQuestionData.question_text}
                  onChange={(e) => setCreateQuestionData({ ...createQuestionData, question_text: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                  rows={3}
                  placeholder="Enter the question text"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={createQuestionData.question_type}
                    onChange={(e) => setCreateQuestionData({ ...createQuestionData, question_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="text">Text</option>
                    <option value="multiple_choice">Multiple Choice</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={createQuestionData.category}
                    onChange={(e) => setCreateQuestionData({ ...createQuestionData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. Satisfaction"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={createQuestionData.sort_order}
                    onChange={(e) => setCreateQuestionData({ ...createQuestionData, sort_order: parseInt(e.target.value || '0', 10) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center space-x-6 mt-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={createQuestionData.required}
                      onChange={(e) => setCreateQuestionData({ ...createQuestionData, required: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Required</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={createQuestionData.is_active}
                      onChange={(e) => setCreateQuestionData({ ...createQuestionData, is_active: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Active</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={closeCreateQuestionModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={createQuestion}
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create Question
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
