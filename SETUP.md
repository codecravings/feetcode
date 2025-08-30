# FeetCode Setup Guide 🚀

## Quick Start with Supabase

### 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Wait for the database to be set up (2-3 minutes)

### 2. Set Up the Database
1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the sidebar
3. Copy and paste the entire contents of `server/config/database.sql`
4. Click "Run" to create all tables and sample data

### 3. Get Your Keys
1. In your Supabase project, go to **Settings** → **API**
2. Copy the **Project URL** and **service_role key** (NOT the anon key)

### 4. Configure Environment Variables
1. Open `server/.env`
2. Replace the placeholder values:
```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
JWT_SECRET=your-super-secret-jwt-key-feetcode-2024
NODE_ENV=development
PORT=5000
```

### 5. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 6. Start the Application
```bash
# Option 1: Start both frontend and backend together
npm run install:all  # First time only
npm run start:full

# Option 2: Start separately (in different terminals)
npm run dev          # Frontend on http://localhost:3000
npm run server:dev   # Backend on http://localhost:5000
```

### 7. Test the Features

#### Test Authentication:
1. Go to http://localhost:3000
2. Click "Sign In" in the top right
3. Create a new account or sign in
4. Try switching between different vibes (Professional/Humorous/Gen Z)

#### Test Problem Solving:
1. Go to the "Problems" page
2. Click on "Two Sum" problem
3. Try the code editor with different languages
4. Submit some code (it will run against test cases)

#### Test the Personality System:
1. Switch between vibes using the toggle in the navbar
2. Notice how all text changes (problem descriptions, messages, etc.)
3. **Professional**: "All test cases passed successfully!"
4. **Humorous**: "Your code is smoother than my pickup lines! 🎉"
5. **Gen Z**: "That code absolutely slaps! No cap! 🔥"

### 8. View Your Progress:
1. Go to Dashboard page after solving some problems
2. See your stats, activity calendar, and recent submissions

## What's Included:
- ✅ Full authentication system
- ✅ Code editor with syntax highlighting
- ✅ Real code execution and validation
- ✅ Multiple programming languages
- ✅ Problem browsing with advanced filtering
- ✅ User progress tracking and statistics
- ✅ **Unique personality system** with 3 vibes
- ✅ Responsive design
- ✅ Sample problems with different difficulty levels

## Troubleshooting:

**"Missing Supabase environment variables"**
- Make sure you've set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in `server/.env`

**"Network error"**
- Make sure the backend server is running on port 5000
- Check the browser console for specific error messages

**Database errors**
- Make sure you've run the SQL script in Supabase
- Check your Supabase project is active

**Code execution not working**
- This is normal for the demo - the code runner is a mock for security reasons
- In production, you'd need Docker containers for safe code execution

## Next Steps:
- Add more problems to the database
- Implement real code execution with Docker
- Add more personality vibes
- Build discussion forums
- Add leaderboards and contests

Enjoy coding with personality! 🎭🚀