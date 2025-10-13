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

interface Company {
  company_id: number;
  company_name: string;
  address_street?: string;
  address_city?: string;
  address_state?: string;
  address_zip?: string;
  address_country?: string;
  phone?: string;
  email?: string;
  website?: string;
  industry?: string;
  main_contact_id?: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface Survey {
  survey_id: number;
  survey_title: string;
  survey_description?: string;
  company_id?: number;
  company_name?: string;
  created_by_user_id: number;
  created_by_name?: string;
  is_active: boolean;
  is_public: boolean;
  allow_anonymous: boolean;
  start_date?: string;
  end_date?: string;
  created_at?: string;
  updated_at?: string;
  question_count?: number;
}

interface SurveyQuestion {
  survey_question_id: number;
  survey_id: number;
  question_id: number;
  sort_order: number;
  is_required: boolean;
  question_text: string;
  question_type: string;
  category?: string;
  is_active: boolean;
  required: boolean;
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
    level: 1,
    is_active: true,
  });
  const [editFormData, setEditFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    address_city: '',
    address_state: '',
    phone: '',
    level: 1,
    is_active: true,
  });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [migrationMessage, setMigrationMessage] = useState('');

  const [createQuestionData, setCreateQuestionData] = useState({
    question_text: '',
    question_type: 'text',
    category: '',
    sort_order: 0,
    required: false,
    is_active: true,
  });

  const [companies, setCompanies] = useState<Company[]>([]);
  const [showCreateCompanyModal, setShowCreateCompanyModal] = useState(false);
  const [showEditCompanyModal, setShowEditCompanyModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [createCompanyData, setCreateCompanyData] = useState({
    company_name: '',
    address_street: '',
    address_city: '',
    address_state: '',
    address_zip: '',
    address_country: 'USA',
    phone: '',
    email: '',
    website: '',
    industry: '',
    is_active: true,
  });
  const [editCompanyData, setEditCompanyData] = useState({
    company_name: '',
    address_street: '',
    address_city: '',
    address_state: '',
    address_zip: '',
    address_country: 'USA',
    phone: '',
    email: '',
    website: '',
    industry: '',
    is_active: true,
  });

  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([]);
  const [showCreateSurveyModal, setShowCreateSurveyModal] = useState(false);
  const [showEditSurveyModal, setShowEditSurveyModal] = useState(false);
  const [editingSurvey, setEditingSurvey] = useState<Survey | null>(null);
  const [createSurveyData, setCreateSurveyData] = useState({
    survey_title: '',
    survey_description: '',
    company_id: '',
    is_active: true,
    is_public: false,
    allow_anonymous: false,
    start_date: '',
    end_date: '',
    selectedQuestionIds: [] as number[],
  });
  const [editSurveyData, setEditSurveyData] = useState({
    survey_title: '',
    survey_description: '',
    company_id: '',
    is_active: true,
    is_public: false,
    allow_anonymous: false,
    start_date: '',
    end_date: '',
    selectedQuestionIds: [] as number[],
  });
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewSurvey, setPreviewSurvey] = useState<Survey | null>(null);
  const [previewQuestions, setPreviewQuestions] = useState<SurveyQuestion[]>([]);
  const [activeSection, setActiveSection] = useState('overview');

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
    fetchCompanies();
    fetchSurveys();
    fetchAvailableQuestions();
    setLoading(false);
  }, [router]);

  const logout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
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

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/admin/companies');
      if (response.ok) {
        const data = await response.json();
        setCompanies(data.companies || []);
      }
    } catch (error) {
      console.error('Failed to fetch companies:', error);
    }
  };

  const fetchSurveys = async () => {
    try {
      const response = await fetch('/api/admin/surveys');
      if (response.ok) {
        const data = await response.json();
        setSurveys(data.surveys || []);
      }
    } catch (error) {
      console.error('Failed to fetch surveys:', error);
    }
  };

  const fetchAvailableQuestions = async () => {
    try {
      const response = await fetch('/api/admin/available-questions');
      if (response.ok) {
        const data = await response.json();
        setAvailableQuestions(data.questions || []);
      }
    } catch (error) {
      console.error('Failed to fetch available questions:', error);
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
    setCreateQuestionData({
      question_text: '',
      question_type: 'text',
      category: '',
      sort_order: 0,
      required: false,
      is_active: true,
    });
  };

  const createQuestion = async () => {
    if (!createQuestionData.question_text.trim()) {
      alert('Question text is required');
      return;
    }

    try {
      const response = await fetch('/api/admin/create-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createQuestionData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Add the new question to the questions list
        setQuestions([...questions, data.question]);
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
      level: 1,
      is_active: true,
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
      level: 1,
      is_active: true,
    });
  };

  const createUser = async () => {
    if (!createFormData.username || !createFormData.email || !createFormData.password ||
        !createFormData.first_name || !createFormData.last_name) {
      alert('All fields are required');
      return;
    }

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

  const openEditModal = (userToEdit: User) => {
    setEditingUser(userToEdit);
    setEditFormData({
      username: userToEdit.username,
      email: userToEdit.email,
      password: '',
      first_name: userToEdit.first_name,
      last_name: userToEdit.last_name,
      address_city: userToEdit.address_city || '',
      address_state: userToEdit.address_state || '',
      phone: userToEdit.phone || '',
      level: userToEdit.level,
      is_active: userToEdit.is_active,
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
      level: 1,
      is_active: true,
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

  const runMigration = async () => {
    try {
      const response = await fetch('/api/admin/migrate-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (response.ok) {
        setMigrationMessage('Migration completed successfully!');
        // Refresh users to show the new level field
        fetchUsers();
      } else {
        setMigrationMessage('Migration failed: ' + data.error);
      }
    } catch (error) {
      setMigrationMessage('Migration failed: Network error');
    }
  };

  // Company Management Functions
  const openCreateCompanyModal = () => {
    setCreateCompanyData({
      company_name: '',
      address_street: '',
      address_city: '',
      address_state: '',
      address_zip: '',
      address_country: 'USA',
      phone: '',
      email: '',
      website: '',
      industry: '',
      is_active: true,
    });
    setShowCreateCompanyModal(true);
  };

  const closeCreateCompanyModal = () => {
    setShowCreateCompanyModal(false);
    setCreateCompanyData({
      company_name: '',
      address_street: '',
      address_city: '',
      address_state: '',
      address_zip: '',
      address_country: 'USA',
      phone: '',
      email: '',
      website: '',
      industry: '',
      is_active: true,
    });
  };

  const createCompany = async () => {
    if (!createCompanyData.company_name.trim()) {
      alert('Company name is required');
      return;
    }

    try {
      const response = await fetch('/api/admin/create-company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createCompanyData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Add the new company to the companies list
        setCompanies([...companies, data.company]);
        closeCreateCompanyModal();
        alert('Company created successfully!');
      } else {
        alert(data.error || 'Failed to create company');
      }
    } catch (error) {
      console.error('Create company error:', error);
      alert('Failed to create company');
    }
  };

  const openEditCompanyModal = (companyToEdit: Company) => {
    setEditingCompany(companyToEdit);
    setEditCompanyData({
      company_name: companyToEdit.company_name,
      address_street: companyToEdit.address_street || '',
      address_city: companyToEdit.address_city || '',
      address_state: companyToEdit.address_state || '',
      address_zip: companyToEdit.address_zip || '',
      address_country: companyToEdit.address_country || 'USA',
      phone: companyToEdit.phone || '',
      email: companyToEdit.email || '',
      website: companyToEdit.website || '',
      industry: companyToEdit.industry || '',
      is_active: companyToEdit.is_active,
    });
    setShowEditCompanyModal(true);
  };

  const closeEditCompanyModal = () => {
    setShowEditCompanyModal(false);
    setEditingCompany(null);
    setEditCompanyData({
      company_name: '',
      address_street: '',
      address_city: '',
      address_state: '',
      address_zip: '',
      address_country: 'USA',
      phone: '',
      email: '',
      website: '',
      industry: '',
      is_active: true,
    });
  };

  const saveCompanyChanges = async () => {
    if (!editingCompany) return;

    try {
      const response = await fetch('/api/admin/update-company', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_id: editingCompany.company_id,
          ...editCompanyData
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update the companies list with the new data
        setCompanies(companies.map(c =>
          c.company_id === editingCompany.company_id ? data.company : c
        ));
        closeEditCompanyModal();
        alert('Company updated successfully!');
      } else {
        alert(data.error || 'Failed to update company');
      }
    } catch (error) {
      console.error('Update company error:', error);
      alert('Failed to update company');
    }
  };

  // Survey Management Functions
  const openCreateSurveyModal = () => {
    setCreateSurveyData({
      survey_title: '',
      survey_description: '',
      company_id: '',
      is_active: true,
      is_public: false,
      allow_anonymous: false,
      start_date: '',
      end_date: '',
      selectedQuestionIds: [],
    });
    setShowCreateSurveyModal(true);
  };

  const closeCreateSurveyModal = () => {
    setShowCreateSurveyModal(false);
    setCreateSurveyData({
      survey_title: '',
      survey_description: '',
      company_id: '',
      is_active: true,
      is_public: false,
      allow_anonymous: false,
      start_date: '',
      end_date: '',
      selectedQuestionIds: [],
    });
  };

  const createSurvey = async () => {
    try {
      const surveyData = {
        survey_title: createSurveyData.survey_title,
        survey_description: createSurveyData.survey_description,
        company_id: createSurveyData.company_id ? parseInt(createSurveyData.company_id) : undefined,
        is_active: createSurveyData.is_active,
        is_public: createSurveyData.is_public,
        allow_anonymous: createSurveyData.allow_anonymous,
        start_date: createSurveyData.start_date || undefined,
        end_date: createSurveyData.end_date || undefined,
        question_ids: createSurveyData.selectedQuestionIds,
      };

      const response = await fetch('/api/admin/create-survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(surveyData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Add the new survey to the surveys list
        setSurveys([...surveys, data.survey]);
        closeCreateSurveyModal();
        alert('Survey created successfully!');
      } else {
        alert(data.error || 'Failed to create survey');
      }
    } catch (error) {
      console.error('Create survey error:', error);
      alert('Failed to create survey');
    }
  };

  const openEditSurveyModal = async (surveyToEdit: Survey) => {
    setEditingSurvey(surveyToEdit);

    try {
      // Fetch existing questions for this survey
      const response = await fetch(`/api/admin/get-survey-questions?surveyId=${surveyToEdit.survey_id}`);
      let existingQuestionIds: number[] = [];

      if (response.ok) {
        const data = await response.json();
        if (data.questions && data.questions.length > 0) {
          existingQuestionIds = data.questions.map((q: any) => q.question_id);
        }
      } else {
        console.error('Failed to fetch existing survey questions');
      }

      setEditSurveyData({
        survey_title: surveyToEdit.survey_title,
        survey_description: surveyToEdit.survey_description || '',
        company_id: surveyToEdit.company_id?.toString() || '',
        is_active: surveyToEdit.is_active,
        is_public: surveyToEdit.is_public,
        allow_anonymous: surveyToEdit.allow_anonymous,
        start_date: surveyToEdit.start_date || '',
        end_date: surveyToEdit.end_date || '',
        selectedQuestionIds: existingQuestionIds,
      });
    } catch (error) {
      console.error('Error fetching existing survey questions:', error);
      // Set default values if fetching fails
      setEditSurveyData({
        survey_title: surveyToEdit.survey_title,
        survey_description: surveyToEdit.survey_description || '',
        company_id: surveyToEdit.company_id?.toString() || '',
        is_active: surveyToEdit.is_active,
        is_public: surveyToEdit.is_public,
        allow_anonymous: surveyToEdit.allow_anonymous,
        start_date: surveyToEdit.start_date || '',
        end_date: surveyToEdit.end_date || '',
        selectedQuestionIds: [],
      });
    }

    setShowEditSurveyModal(true);
  };

  const closeEditSurveyModal = () => {
    setShowEditSurveyModal(false);
    setEditingSurvey(null);
    setEditSurveyData({
      survey_title: '',
      survey_description: '',
      company_id: '',
      is_active: true,
      is_public: false,
      allow_anonymous: false,
      start_date: '',
      end_date: '',
      selectedQuestionIds: [],
    });
  };

  const saveSurveyChanges = async () => {
    if (!editingSurvey) return;

    try {
      const surveyData = {
        survey_id: editingSurvey.survey_id,
        survey_title: editSurveyData.survey_title,
        survey_description: editSurveyData.survey_description,
        company_id: editSurveyData.company_id ? parseInt(editSurveyData.company_id) : undefined,
        is_active: editSurveyData.is_active,
        is_public: editSurveyData.is_public,
        allow_anonymous: editSurveyData.allow_anonymous,
        start_date: editSurveyData.start_date || undefined,
        end_date: editSurveyData.end_date || undefined,
        question_ids: editSurveyData.selectedQuestionIds,
      };

      console.log('Sending survey update data:', surveyData);

      const response = await fetch('/api/admin/update-survey', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(surveyData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update the surveys list with the new data
        setSurveys(surveys.map(s =>
          s.survey_id === editingSurvey.survey_id ? data.survey : s
        ));
        closeEditSurveyModal();
        alert('Survey updated successfully!');
      } else {
        alert(data.error || 'Failed to update survey');
      }
    } catch (error) {
      console.error('Update survey error:', error);
      alert('Failed to update survey');
    }
  };

  const toggleQuestionSelection = (questionId: number, isCreate: boolean = true) => {
    const data = isCreate ? createSurveyData : editSurveyData;
    const setter = isCreate ? setCreateSurveyData : setEditSurveyData;

    const isSelected = data.selectedQuestionIds.includes(questionId);
    if (isSelected) {
      setter({
        ...data,
        selectedQuestionIds: data.selectedQuestionIds.filter(id => id !== questionId)
      });
    } else {
      setter({
        ...data,
        selectedQuestionIds: [...data.selectedQuestionIds, questionId]
      });
    }
  };

  const openPreviewModal = async (survey: Survey) => {
    setPreviewSurvey(survey);

    try {
      // Fetch questions for this survey from the junction table
      const response = await fetch(`/api/admin/get-survey-questions?surveyId=${survey.survey_id}`);
      if (response.ok) {
        const data = await response.json();
        setPreviewQuestions(data.questions || []);
      } else {
        console.error('Failed to fetch survey questions');
        setPreviewQuestions([]);
      }
    } catch (error) {
      console.error('Error fetching survey questions:', error);
      setPreviewQuestions([]);
    }

    setShowPreviewModal(true);
  };

  const closePreviewModal = () => {
    setShowPreviewModal(false);
    setPreviewSurvey(null);
    setPreviewQuestions([]);
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-center h-16 px-4 bg-gray-900">
            <h2 className="text-xl font-bold text-white">Admin Panel</h2>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            <button
              onClick={() => setActiveSection('overview')}
              className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                activeSection === 'overview'
                  ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
              </svg>
              Overview
            </button>

            <button
              onClick={() => setActiveSection('users')}
              className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                activeSection === 'users'
                  ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              User Management
            </button>

            <button
              onClick={() => setActiveSection('companies')}
              className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                activeSection === 'companies'
                  ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Company Management
            </button>

            <button
              onClick={() => setActiveSection('questions')}
              className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                activeSection === 'questions'
                  ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Survey Questions
            </button>

            <button
              onClick={() => setActiveSection('surveys')}
              className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                activeSection === 'surveys'
                  ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Survey Management
            </button>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-700">
                    {user?.first_name?.[0]}{user?.last_name?.[0]}
                  </span>
                </div>
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-gray-500 truncate">Administrator</p>
              </div>
              <button
                onClick={logout}
                className="ml-2 p-1 text-gray-400 hover:text-gray-600"
                title="Logout"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                {activeSection === 'overview' && 'Dashboard Overview'}
                {activeSection === 'users' && 'User Management'}
                {activeSection === 'companies' && 'Company Management'}
                {activeSection === 'questions' && 'Survey Questions'}
                {activeSection === 'surveys' && 'Survey Management'}
              </h1>
              <div className="text-sm text-gray-500">
                Welcome back, {user?.first_name}!
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6">
          {activeSection === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                          <dd className="text-lg font-medium text-gray-900">{surveys.filter(s => s.is_active).length}</dd>
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Total Companies</dt>
                          <dd className="text-lg font-medium text-gray-900">{companies.length}</dd>
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Total Questions</dt>
                          <dd className="text-lg font-medium text-gray-900">{questions.length}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      System initialized and ready for use
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      {users.length} users registered
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                      {companies.length} companies configured
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                      {questions.length} survey questions available
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'users' && (
            <div className="space-y-6">
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
            </div>
          )}

          {activeSection === 'companies' && (
            <div className="space-y-6">
              {/* Company Management */}
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 sm:px-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Company Management</h3>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage companies stored in `companydb`.</p>
                    </div>
                    <button
                      onClick={openCreateCompanyModal}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Create Company
                    </button>
                  </div>
                </div>
                <ul className="divide-y divide-gray-200">
                  {companies.length > 0 ? (
                    companies.map((company) => (
                      <li key={company.company_id} className="px-4 py-4 sm:px-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{company.company_name}</div>
                            <div className="mt-1 text-sm text-gray-500">
                              {company.industry && <span>Industry: <span className="font-medium">{company.industry}</span></span>}
                              {company.address_city && company.address_state && (
                                <> · {company.address_city}, {company.address_state}</>
                              )}
                              {company.email && <> · {company.email}</>}
                            </div>
                            {company.website && (
                              <div className="mt-1 text-sm text-blue-600">
                                <a href={company.website} target="_blank" rel="noopener noreferrer">
                                  {company.website}
                                </a>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${company.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {company.is_active ? 'Active' : 'Inactive'}
                            </span>
                            <button
                              onClick={() => openEditCompanyModal(company)}
                              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-md text-xs font-medium"
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-8 text-center text-gray-500">
                      No companies found. Companies will appear here after creation.
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}

          {activeSection === 'questions' && (
            <div className="space-y-6">
              {/* Survey Questions Management */}
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
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
          )}

          {activeSection === 'surveys' && (
            <div className="space-y-6">
              {/* Survey Management */}
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 sm:px-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Survey Management</h3>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500">Create and manage surveys by combining questions.</p>
                    </div>
                    <button
                      onClick={openCreateSurveyModal}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Create Survey
                    </button>
                  </div>
                </div>
                <ul className="divide-y divide-gray-200">
                  {surveys.length > 0 ? (
                    surveys.map((survey) => (
                      <li key={survey.survey_id} className="px-4 py-4 sm:px-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{survey.survey_title}</div>
                            <div className="mt-1 text-sm text-gray-500">
                              {survey.company_name && <span>Company: <span className="font-medium">{survey.company_name}</span></span>}
                              {survey.question_count !== undefined && (
                                <> · {survey.question_count} question{survey.question_count !== 1 ? 's' : ''}</>
                              )}
                              {survey.created_by_name && <> · Created by: {survey.created_by_name}</>}
                            </div>
                            {survey.survey_description && (
                              <div className="mt-1 text-sm text-gray-600 max-w-md truncate">
                                {survey.survey_description}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${survey.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {survey.is_active ? 'Active' : 'Inactive'}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${survey.is_public ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                              {survey.is_public ? 'Public' : 'Private'}
                            </span>
                            <button
                              onClick={() => openPreviewModal(survey)}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-xs font-medium mr-2"
                            >
                              Preview
                            </button>
                            <button
                              onClick={() => openEditSurveyModal(survey)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-xs font-medium"
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-8 text-center text-gray-500">
                      No surveys found. Create your first survey to get started.
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create New User</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    value={createFormData.first_name}
                    onChange={(e) => setCreateFormData({ ...createFormData, first_name: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    value={createFormData.last_name}
                    onChange={(e) => setCreateFormData({ ...createFormData, last_name: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <input
                    type="text"
                    value={createFormData.username}
                    onChange={(e) => setCreateFormData({ ...createFormData, username: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={createFormData.email}
                    onChange={(e) => setCreateFormData({ ...createFormData, email: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    value={createFormData.password}
                    onChange={(e) => setCreateFormData({ ...createFormData, password: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Level</label>
                  <select
                    value={createFormData.level}
                    onChange={(e) => setCreateFormData({ ...createFormData, level: parseInt(e.target.value) })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={1}>User</option>
                    <option value={1001}>Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    value={createFormData.address_city}
                    onChange={(e) => setCreateFormData({ ...createFormData, address_city: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    value={createFormData.address_state}
                    onChange={(e) => setCreateFormData({ ...createFormData, address_state: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="text"
                    value={createFormData.phone}
                    onChange={(e) => setCreateFormData({ ...createFormData, phone: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={createFormData.is_active}
                    onChange={(e) => setCreateFormData({ ...createFormData, is_active: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">Active</label>
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
                  onClick={createUser}
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Create User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit User</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    value={editFormData.first_name}
                    onChange={(e) => setEditFormData({ ...editFormData, first_name: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    value={editFormData.last_name}
                    onChange={(e) => setEditFormData({ ...editFormData, last_name: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <input
                    type="text"
                    value={editFormData.username}
                    onChange={(e) => setEditFormData({ ...editFormData, username: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password (leave blank to keep current)</label>
                  <input
                    type="password"
                    value={editFormData.password}
                    onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Level</label>
                  <select
                    value={editFormData.level}
                    onChange={(e) => setEditFormData({ ...editFormData, level: parseInt(e.target.value) })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={1}>User</option>
                    <option value={1001}>Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    value={editFormData.address_city}
                    onChange={(e) => setEditFormData({ ...editFormData, address_city: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    value={editFormData.address_state}
                    onChange={(e) => setEditFormData({ ...editFormData, address_state: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="text"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editFormData.is_active}
                    onChange={(e) => setEditFormData({ ...editFormData, is_active: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">Active</label>
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
        </div>
      )}

      {/* Create Question Modal */}
      {showCreateQuestionModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Question</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Question Text</label>
                  <textarea
                    value={createQuestionData.question_text}
                    onChange={(e) => setCreateQuestionData({ ...createQuestionData, question_text: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Question Type</label>
                  <select
                    value={createQuestionData.question_type}
                    onChange={(e) => setCreateQuestionData({ ...createQuestionData, question_type: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="text">Text</option>
                    <option value="multiple_choice">Multiple Choice</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <input
                    type="text"
                    value={createQuestionData.category}
                    onChange={(e) => setCreateQuestionData({ ...createQuestionData, category: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sort Order</label>
                  <input
                    type="number"
                    value={createQuestionData.sort_order}
                    onChange={(e) => setCreateQuestionData({ ...createQuestionData, sort_order: parseInt(e.target.value) })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={createQuestionData.required}
                      onChange={(e) => setCreateQuestionData({ ...createQuestionData, required: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">Required</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={createQuestionData.is_active}
                      onChange={(e) => setCreateQuestionData({ ...createQuestionData, is_active: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">Active</label>
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
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Create Question
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Company Modal */}
      {showCreateCompanyModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Company</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Company Name</label>
                  <input
                    type="text"
                    value={createCompanyData.company_name}
                    onChange={(e) => setCreateCompanyData({ ...createCompanyData, company_name: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Industry</label>
                  <input
                    type="text"
                    value={createCompanyData.industry}
                    onChange={(e) => setCreateCompanyData({ ...createCompanyData, industry: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Website</label>
                  <input
                    type="url"
                    value={createCompanyData.website}
                    onChange={(e) => setCreateCompanyData({ ...createCompanyData, website: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={createCompanyData.email}
                    onChange={(e) => setCreateCompanyData({ ...createCompanyData, email: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    value={createCompanyData.phone}
                    onChange={(e) => setCreateCompanyData({ ...createCompanyData, phone: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Street Address</label>
                  <input
                    type="text"
                    value={createCompanyData.address_street}
                    onChange={(e) => setCreateCompanyData({ ...createCompanyData, address_street: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    value={createCompanyData.address_city}
                    onChange={(e) => setCreateCompanyData({ ...createCompanyData, address_city: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    value={createCompanyData.address_state}
                    onChange={(e) => setCreateCompanyData({ ...createCompanyData, address_state: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
                  <input
                    type="text"
                    value={createCompanyData.address_zip}
                    onChange={(e) => setCreateCompanyData({ ...createCompanyData, address_zip: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Country</label>
                  <input
                    type="text"
                    value={createCompanyData.address_country}
                    onChange={(e) => setCreateCompanyData({ ...createCompanyData, address_country: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={createCompanyData.is_active}
                    onChange={(e) => setCreateCompanyData({ ...createCompanyData, is_active: e.target.checked })}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">Active</label>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={closeCreateCompanyModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Cancel
                </button>
                <button
                  onClick={createCompany}
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Create Company
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Company Modal */}
      {showEditCompanyModal && editingCompany && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Company</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Company Name</label>
                  <input
                    type="text"
                    value={editCompanyData.company_name}
                    onChange={(e) => setEditCompanyData({ ...editCompanyData, company_name: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Industry</label>
                  <input
                    type="text"
                    value={editCompanyData.industry}
                    onChange={(e) => setEditCompanyData({ ...editCompanyData, industry: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Website</label>
                  <input
                    type="url"
                    value={editCompanyData.website}
                    onChange={(e) => setEditCompanyData({ ...editCompanyData, website: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={editCompanyData.email}
                    onChange={(e) => setEditCompanyData({ ...editCompanyData, email: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    value={editCompanyData.phone}
                    onChange={(e) => setEditCompanyData({ ...editCompanyData, phone: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Street Address</label>
                  <input
                    type="text"
                    value={editCompanyData.address_street}
                    onChange={(e) => setEditCompanyData({ ...editCompanyData, address_street: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    value={editCompanyData.address_city}
                    onChange={(e) => setEditCompanyData({ ...editCompanyData, address_city: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    value={editCompanyData.address_state}
                    onChange={(e) => setEditCompanyData({ ...editCompanyData, address_state: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
                  <input
                    type="text"
                    value={editCompanyData.address_zip}
                    onChange={(e) => setEditCompanyData({ ...editCompanyData, address_zip: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Country</label>
                  <input
                    type="text"
                    value={editCompanyData.address_country}
                    onChange={(e) => setEditCompanyData({ ...editCompanyData, address_country: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editCompanyData.is_active}
                    onChange={(e) => setEditCompanyData({ ...editCompanyData, is_active: e.target.checked })}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">Active</label>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={closeEditCompanyModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Cancel
                </button>
                <button
                  onClick={saveCompanyChanges}
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Survey Modal */}
      {showCreateSurveyModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 shadow-lg rounded-md bg-white max-h-screen">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Survey</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Survey Title</label>
                  <input
                    type="text"
                    value={createSurveyData.survey_title}
                    onChange={(e) => setCreateSurveyData({ ...createSurveyData, survey_title: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company</label>
                  <select
                    value={createSurveyData.company_id}
                    onChange={(e) => setCreateSurveyData({ ...createSurveyData, company_id: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Select Company (Optional)</option>
                    {companies.map((company) => (
                      <option key={company.company_id} value={company.company_id}>
                        {company.company_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={createSurveyData.survey_description}
                    onChange={(e) => setCreateSurveyData({ ...createSurveyData, survey_description: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    value={createSurveyData.start_date}
                    onChange={(e) => setCreateSurveyData({ ...createSurveyData, start_date: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    value={createSurveyData.end_date}
                    onChange={(e) => setCreateSurveyData({ ...createSurveyData, end_date: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={createSurveyData.is_active}
                      onChange={(e) => setCreateSurveyData({ ...createSurveyData, is_active: e.target.checked })}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">Active</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={createSurveyData.is_public}
                      onChange={(e) => setCreateSurveyData({ ...createSurveyData, is_public: e.target.checked })}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">Public</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={createSurveyData.allow_anonymous}
                      onChange={(e) => setCreateSurveyData({ ...createSurveyData, allow_anonymous: e.target.checked })}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">Allow Anonymous</label>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-900 mb-3">Select Questions for Survey</h4>
                <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md">
                  {availableQuestions.length > 0 ? (
                    availableQuestions.map((question) => (
                      <div key={question.question_id} className="flex items-center p-3 border-b border-gray-200 last:border-b-0">
                        <input
                          type="checkbox"
                          checked={createSurveyData.selectedQuestionIds.includes(question.question_id)}
                          onChange={() => toggleQuestionSelection(question.question_id)}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <div className="ml-3 flex-1">
                          <div className="text-sm font-medium text-gray-900">{question.question_text}</div>
                          <div className="text-xs text-gray-500">
                            Type: {question.question_type}
                            {question.category && ` · Category: ${question.category}`}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">No questions available</div>
                  )}
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Selected: {createSurveyData.selectedQuestionIds.length} questions
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeCreateSurveyModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Cancel
                </button>
                <button
                  onClick={createSurvey}
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Create Survey
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Survey Modal */}
      {showEditSurveyModal && editingSurvey && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 shadow-lg rounded-md bg-white max-h-screen">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Survey</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Survey Title</label>
                  <input
                    type="text"
                    value={editSurveyData.survey_title}
                    onChange={(e) => setEditSurveyData({ ...editSurveyData, survey_title: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company</label>
                  <select
                    value={editSurveyData.company_id}
                    onChange={(e) => setEditSurveyData({ ...editSurveyData, company_id: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Select Company (Optional)</option>
                    {companies.map((company) => (
                      <option key={company.company_id} value={company.company_id}>
                        {company.company_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={editSurveyData.survey_description}
                    onChange={(e) => setEditSurveyData({ ...editSurveyData, survey_description: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    value={editSurveyData.start_date}
                    onChange={(e) => setEditSurveyData({ ...editSurveyData, start_date: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    value={editSurveyData.end_date}
                    onChange={(e) => setEditSurveyData({ ...editSurveyData, end_date: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editSurveyData.is_active}
                      onChange={(e) => setEditSurveyData({ ...editSurveyData, is_active: e.target.checked })}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">Active</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editSurveyData.is_public}
                      onChange={(e) => setEditSurveyData({ ...editSurveyData, is_public: e.target.checked })}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">Public</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editSurveyData.allow_anonymous}
                      onChange={(e) => setEditSurveyData({ ...editSurveyData, allow_anonymous: e.target.checked })}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">Allow Anonymous</label>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-900 mb-3">Select Questions for Survey</h4>
                <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md">
                  {availableQuestions.length > 0 ? (
                    availableQuestions.map((question) => (
                      <div key={question.question_id} className="flex items-center p-3 border-b border-gray-200 last:border-b-0">
                        <input
                          type="checkbox"
                          checked={editSurveyData.selectedQuestionIds.includes(question.question_id)}
                          onChange={() => toggleQuestionSelection(question.question_id, false)}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <div className="ml-3 flex-1">
                          <div className="text-sm font-medium text-gray-900">{question.question_text}</div>
                          <div className="text-xs text-gray-500">
                            Type: {question.question_type}
                            {question.category && ` · Category: ${question.category}`}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">No questions available</div>
                  )}
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Selected: {editSurveyData.selectedQuestionIds.length} questions
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeEditSurveyModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Cancel
                </button>
                <button
                  onClick={saveSurveyChanges}
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Survey Preview Modal */}
      {showPreviewModal && previewSurvey && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-2/3 shadow-lg rounded-md bg-white max-h-screen overflow-y-auto">
            <div className="mt-3">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Survey Preview</h3>
                  <h4 className="text-xl font-semibold text-gray-700">{previewSurvey.survey_title}</h4>
                  {previewSurvey.survey_description && (
                    <p className="text-gray-600 mt-1">{previewSurvey.survey_description}</p>
                  )}
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    {previewSurvey.company_name && <span>Company: {previewSurvey.company_name}</span>}
                    <span>Questions: {previewQuestions.length}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      previewSurvey.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {previewSurvey.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      previewSurvey.is_public ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {previewSurvey.is_public ? 'Public' : 'Private'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={closePreviewModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Survey Questions */}
              <div className="space-y-6">
                {previewQuestions.length > 0 ? (
                  previewQuestions.map((question, index) => (
                    <div key={question.question_id} className="bg-gray-50 p-6 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h5 className="text-lg font-medium text-gray-900 mb-1">
                            Question {index + 1}
                            {question.is_required && <span className="text-red-500 ml-1">*</span>}
                          </h5>
                          <p className="text-gray-700">{question.question_text}</p>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            question.question_type === 'text' ? 'bg-blue-100 text-blue-800' :
                            question.question_type === 'multiple_choice' ? 'bg-green-100 text-green-800' :
                            question.question_type === 'rating' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {question.question_type.replace('_', ' ')}
                          </span>
                          {question.is_required && (
                            <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                              Required
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Question Input Simulation */}
                      <div className="mt-3">
                        {question.question_type === 'text' && (
                          <textarea
                            placeholder="Enter your response here..."
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows={3}
                            disabled
                          />
                        )}

                        {question.question_type === 'multiple_choice' && (
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <input type="radio" name={`question-${question.question_id}`} disabled className="mr-2" />
                              <label className="text-gray-600">Option 1</label>
                            </div>
                            <div className="flex items-center">
                              <input type="radio" name={`question-${question.question_id}`} disabled className="mr-2" />
                              <label className="text-gray-600">Option 2</label>
                            </div>
                            <div className="flex items-center">
                              <input type="radio" name={`question-${question.question_id}`} disabled className="mr-2" />
                              <label className="text-gray-600">Option 3</label>
                            </div>
                          </div>
                        )}

                        {question.question_type === 'rating' && (
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                disabled
                                className="w-8 h-8 text-gray-300 hover:text-yellow-400"
                              >
                                ★
                              </button>
                            ))}
                            <span className="ml-2 text-sm text-gray-500">(1-5 scale)</span>
                          </div>
                        )}
                      </div>

                      {question.category && (
                        <div className="mt-2 text-xs text-gray-500">
                          Category: {question.category}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-lg">No questions found for this survey.</p>
                    <p className="text-sm mt-1">The survey may not have any questions assigned yet.</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={closePreviewModal}
                  className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
