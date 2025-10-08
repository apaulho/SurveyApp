# Netlify Deployment Guide for SurveyApp

## 🚀 Deployment Overview

This SurveyApp is fully configured for Netlify deployment with Neon PostgreSQL database.

## 📋 Prerequisites

1. **Neon Database**: Create a Neon PostgreSQL database
2. **Netlify Account**: Sign up at [netlify.com](https://netlify.com)
3. **GitHub Repository**: Push code to GitHub

## 🗄️ Database Setup

### 1. Create Neon Database
1. Go to [neon.tech](https://neon.tech) and create an account
2. Create a new project
3. Copy the connection string (it looks like: `postgresql://user:password@host/db`)

### 2. Run Database Schema
Execute these SQL files in order:
1. `database_schema.sql` - Creates all tables and constraints
2. `insert_food_questions.sql` - Adds sample questions
3. `create_food_survey_example.sql` - Creates sample survey
4. `fix_foreign_keys.sql` - Fixes any foreign key issues

## 🌐 Netlify Deployment

### Method 1: GitHub Integration (Recommended)

1. **Connect Repository**:
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Configure Build Settings**:
   - **Branch**: `main`
   - **Build command**: `npm run build`
   - **Publish directory**: `.next` (should auto-detect)

3. **Environment Variables**:
   Add this environment variable in Netlify:
   - **Key**: `DATABASE_URL`
   - **Value**: Your Neon connection string (e.g., `postgresql://user:password@host/db`)

### Method 2: Manual Deploy

1. **Build Locally**:
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**:
   - Drag and drop the entire project folder to Netlify
   - Or use Netlify CLI: `netlify deploy --prod`

## ⚙️ Environment Configuration

### Required Environment Variables

Set these in Netlify's environment variables section:

```env
DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require
```

### Optional Environment Variables

```env
NODE_ENV=production
```

## 🔧 Build Configuration

The `netlify.toml` is already configured:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

## 📊 Database Population (Post-Deploy)

After deployment, populate your database:

1. **Access your deployed site**
2. **Run the fix endpoint**: `https://yoursite.netlify.app/api/admin/fix-foreign-keys`
3. **Check database state**: `https://yoursite.netlify.app/api/admin/check-database`

## 🧪 Testing Production Deployment

### Test Checklist:

- [ ] **Login/Registration**: User authentication works
- [ ] **Admin Dashboard**: Accessible with proper permissions
- [ ] **Survey Management**: Create, edit, delete surveys
- [ ] **Question Management**: Add/edit survey questions
- [ ] **Survey Preview**: Preview functionality works
- [ ] **Database Operations**: All CRUD operations function

### API Endpoints to Test:

- `GET /api/admin/check-database` - Verify database connection
- `POST /api/admin/fix-foreign-keys` - Fix any data issues
- `POST /api/login` - User authentication
- `GET /api/admin/surveys` - Survey management
- `PUT /api/admin/update-survey` - Survey editing

## 🚨 Common Issues & Solutions

### Database Connection Issues
```
Error: connect ECONNREFUSED
```
**Solution**: Ensure `DATABASE_URL` environment variable is set correctly in Netlify

### Foreign Key Constraint Errors
```
violates foreign key constraint
```
**Solution**: Run the foreign key fix endpoint: `/api/admin/fix-foreign-keys`

### Build Failures
```
Module not found
```
**Solution**: Ensure all dependencies are installed and Node version is 20

## 🌟 Production Optimizations

The app is already optimized for production:

- ✅ **Static Generation**: Next.js static optimization
- ✅ **Image Optimization**: Disabled for static hosting
- ✅ **ESLint**: Ignored during build for faster deployment
- ✅ **Trailing Slashes**: Enabled for consistency

## 📞 Support

If you encounter issues:

1. Check Netlify build logs
2. Verify environment variables
3. Test database connectivity
4. Check the `/api/admin/check-database` endpoint
5. Run `/api/admin/fix-foreign-keys` if needed

## 🎉 Success!

Once deployed, your SurveyApp will be live at: `https://yoursite.netlify.app`

The application includes:
- ✅ User authentication and registration
- ✅ Admin dashboard with full survey management
- ✅ Question bank management
- ✅ Survey creation and editing
- ✅ Survey preview functionality
- ✅ Company management
- ✅ User management
- ✅ Responsive design with Tailwind CSS

**Happy deploying! 🚀**
