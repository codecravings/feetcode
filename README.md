# FeetCode - LeetCode Clone with Personality 🎭

A modern, full-stack LeetCode clone that lets you practice coding with customizable personalities! Switch between Professional, Humorous, and Gen Z vibes for a unique coding experience.

## 🌟 Key Features

- **🎭 Customizable Personalities**: Professional, Humorous, and Gen Z modes that change all content
- **🌙 Modern Dark/Light Mode**: Complete theming system with auto/system detection
- **💻 Advanced Code Editor**: Monaco Editor with syntax highlighting for JavaScript, Python, and Java
- **⚡ Real Code Execution**: Sandboxed JavaScript execution with actual test case validation
- **🏗️ 47+ Coding Problems**: Comprehensive problem set across 15+ categories
- **🎯 Smart Category Filtering**: Filter by Array, Tree, Graph, Dynamic Programming, Hash Table, etc.
- **🔒 Security-First**: Code validation prevents malicious operations (fs, child_process, etc.)
- **📊 Detailed Test Results**: Real-time execution with pass/fail feedback and runtime metrics
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **🔐 Authentication**: Secure JWT-based user authentication with Supabase
- **🗄️ Full-Stack Architecture**: Express.js backend with Supabase PostgreSQL database

## 🚀 Tech Stack

### Frontend
- **Next.js 14** - React framework with app router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Modern utility-first styling
- **Lucide React** - Beautiful icons
- **Monaco Editor** - VSCode-powered code editor

### Backend
- **Node.js + Express** - REST API server
- **Supabase** - PostgreSQL database and authentication
- **JWT** - Secure token-based authentication
- **bcryptjs** - Password hashing
- **VM Sandbox** - Secure JavaScript code execution
- **Custom Code Executor** - Multi-language support with security validation

## 📁 Complete Project Structure & File Explanations

### Root Directory
```
feetcode/
├── README.md                    # This comprehensive documentation
├── SETUP.md                     # Quick setup instructions
├── package.json                 # Frontend dependencies and scripts
├── package-lock.json           # Locked dependency versions
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript compiler configuration
├── postcss.config.js           # PostCSS configuration for Tailwind
└── next-env.d.ts               # Next.js TypeScript declarations
```

### App Directory (Next.js 14 App Router)
```
app/
├── layout.tsx                   # Root layout with providers and metadata
├── page.tsx                     # Landing page with personality showcase
├── page-modern.tsx             # Modern version of landing page
├── page-simple.tsx             # Simple version of landing page
├── globals.css                 # Global styles and CSS custom properties
│
├── problems/                   # Problems listing
│   └── page.tsx               # Browse and filter coding problems
│
├── problem/                   # Individual problem pages
│   ├── [id]/                 # Dynamic route by problem ID
│   │   └── page.tsx          # Code editor and problem solving interface
│   └── [slug]/               # Dynamic route by problem slug (legacy)
│       └── page.tsx          # Alternative problem page format
│
└── dashboard/                 # User dashboard
    └── page.tsx              # Statistics, progress, and recent activity
```

### Components Directory
```
components/
├── modern/                    # Modern UI components
│   └── Navbar.tsx            # Navigation with theme/vibe switching
│
├── auth/                     # Authentication components
│   └── AuthModal.tsx         # Sign in/up modal with validation
│
├── AuthModal.tsx             # Legacy auth modal
├── CodeEditor.tsx            # Legacy code editor component
├── Navbar.tsx                # Legacy navigation component
├── VibeDisplay.tsx          # Vibe-specific display components
└── VibeSwitcher.tsx         # Personality switching interface
```

### Hooks Directory
```
hooks/
├── useTheme.js              # Theme management (light/dark/system)
├── useVibe.js               # Current personality system hook
├── useVibe.ts               # TypeScript version of vibe hook
├── useVibe-simple.ts        # Simplified TypeScript vibe hook
└── useVibe.ts               # Alternative TypeScript implementation
```

### Server Directory (Backend API)
```
server/
├── package.json             # Backend dependencies
├── package-lock.json        # Locked backend dependencies
├── index.js                 # Main Express server entry point
│
├── config/                  # Configuration files
│   ├── database.sql         # Supabase database schema and sample data
│   └── supabase.js         # Supabase client configuration
│
├── middleware/              # Express middleware
│   └── auth.js             # JWT authentication middleware
│
├── models/                  # Database models and queries
│   ├── User.js             # User model with Supabase integration
│   ├── Problem.js          # Problem model and CRUD operations
│   ├── Submission.js       # Code submission tracking
│   └── Discussion.js       # Discussion/comment system
│
├── routes/                  # API route handlers
│   ├── auth-supabase.js    # Authentication endpoints (Supabase)
│   ├── auth.js             # Legacy authentication routes
│   ├── problems-supabase.js # Problem CRUD (Supabase)
│   ├── problems.js         # Legacy problem routes
│   ├── submissions-supabase.js # Code submission handling (Supabase)
│   ├── submissions.js      # Legacy submission routes
│   ├── users-supabase.js   # User management (Supabase)
│   └── users.js            # Legacy user routes
│
└── services/               # Business logic services
    └── codeExecutor.js     # Advanced code execution with VM sandbox, security validation
```

### Utilities Directory
```
utils/
└── vibeContent.ts          # TypeScript definitions for personality content
```

## 📋 Detailed File Explanations

### Frontend Core Files

#### `app/layout.tsx`
**Root Layout Component**
- Wraps entire application with theme and vibe providers
- Sets up global font (Inter) and metadata
- Provides context for dark/light theming and personality switching
- Handles HTML structure and body classes

#### `app/page.tsx` 
**Modern Landing Page**
- Hero section with dynamic personality-based content
- Interactive personality switching demonstration
- Feature showcase with modern card layouts
- Call-to-action buttons that navigate to problems
- System status indicators and backend connectivity
- Animated background effects and modern styling

#### `app/globals.css`
**Global Stylesheet**
```css
/* Contains: */
- CSS custom properties for light/dark theming
- Tailwind CSS imports and base styles
- Component utility classes (.btn-primary, .card, .glass, etc.)
- Dark mode CSS variables and color schemes
- Custom animations (glow, float, shimmer)
- Monaco editor styling overrides
- Custom scrollbar styling
```

#### `tailwind.config.js`
**Tailwind Configuration**
- Custom color system using CSS variables
- Extended theme with project-specific colors
- Container settings for responsive layouts
- Custom animations (glow, float, shimmer)
- Border radius and spacing overrides

### Page Components

#### `app/problems/page.tsx`
**Problems Listing Page**
- Search functionality across problem titles
- Filter by difficulty (Easy/Medium/Hard) and category
- Personality-based problem descriptions
- Solved/unsolved status indicators
- Responsive card-based layout
- Mock data with fallback to API calls
- Integration with navigation and theme system

#### `app/problem/[id]/page.tsx`
**Individual Problem Solving Interface**
- Monaco code editor with multi-language support
- Problem description with examples and constraints
- Run code functionality with test case execution
- Submit code for full validation
- Test results display with pass/fail indicators
- Language switching (JavaScript, Python, Java)
- Back navigation to problems list
- Personality-based problem descriptions

#### `app/dashboard/page.tsx`
**User Statistics Dashboard**
- Statistics cards showing problems solved, streaks, acceptance rates
- Progress visualization with charts and progress bars
- Recent submission history with status indicators
- Difficulty breakdown (Easy/Medium/Hard)
- Personality-based welcome messages and content
- Authentication-gated content with fallback

### Components

#### `components/modern/Navbar.tsx`
**Modern Navigation Component**
- Brand logo with hover effects and gradients
- Navigation links (Problems, Leaderboard, Dashboard)
- Theme switcher supporting light/dark/system modes
- Personality/vibe selector with visual indicators
- User authentication menu with profile dropdown
- Mobile-responsive hamburger menu
- Glass morphism styling effects
- Integration with AuthModal component

#### `components/auth/AuthModal.tsx`
**Authentication Modal**
- Sign in and sign up forms in single modal
- Form validation with error handling
- Password visibility toggle
- Loading states during authentication
- Integration with backend auth API
- JWT token storage and management
- User feedback for success/error states
- Modern UI with backdrop blur effects

### Custom Hooks

#### `hooks/useTheme.js`
**Theme Management Hook**
```javascript
// Provides:
- Light/dark/system theme switching
- localStorage persistence of theme preference
- System theme preference detection
- Automatic CSS class updates on document
- Context provider for global theme access
- Real-time theme updates across components
```

#### `hooks/useVibe.js`
**Personality System Hook**
```javascript
// Manages:
- Personality switching (professional/humorous/genz)
- Content transformation based on selected vibe
- localStorage persistence of vibe preference
- Context provider for app-wide vibe access
- Dynamic content serving based on personality
```

### Backend Files

#### `server/index.js`
**Main Express Server**
- CORS configuration for frontend integration
- JSON body parsing middleware
- Static file serving configuration
- Route mounting for all API endpoints
- Health check endpoint for system monitoring
- Environment variable configuration
- Error handling middleware

#### `server/config/database.sql`
**Database Schema**
```sql
-- Contains:
- Users table with authentication fields
- Problems table with personality-specific content
- Submissions table for tracking code attempts
- User achievements and progress tracking
- Sample data for testing (Two Sum problem)
- Proper UUID primary keys and relationships
```

#### `server/middleware/auth.js`
**JWT Authentication Middleware**
- Token extraction from Authorization headers
- JWT token verification and validation
- User information extraction from tokens
- Protected route access control
- Error responses for invalid/missing tokens
- Integration with Supabase user management

#### `server/models/User.js`
**User Model (Supabase Integration)**
- User registration with email/username/password
- Password hashing using bcryptjs
- User login with credential validation
- JWT token generation for sessions
- User profile management and updates
- Statistics and progress queries

#### `server/models/Problem.js`
**Problem Model**
- Problem CRUD operations with Supabase
- Personality-based content management
- Difficulty and category filtering
- Search functionality implementation
- Test case management
- Problem statistics and analytics

#### `server/routes/auth-supabase.js`
**Authentication Routes**
```javascript
// Endpoints:
- POST /api/server/auth/register - User registration
- POST /api/server/auth/login - User login
- GET /api/server/auth/me - Get current authenticated user
- Token generation and validation logic
- Password hashing and verification
```

#### `server/routes/problems-supabase.js`
**Problem Management Routes**
```javascript
// Endpoints:
- GET /api/server/problems - List all problems with filtering
- GET /api/server/problems/:id - Get specific problem details
- Search and filter functionality
- Personality-based content serving
- Pagination and sorting support
```

#### `server/routes/submissions-supabase.js`
**Code Submission Routes**
```javascript
// Endpoints:
- POST /api/server/run-code - Execute code with test cases
- POST /api/server/submit - Submit solution for full validation
- GET /api/server/submissions - Get user submission history
- Code execution results and statistics
- Progress tracking and achievement updates
```

## 🎭 Personality System Deep Dive

### How It Works
The personality system transforms content throughout the entire application:

#### Professional Mode 💼
- **Language**: Formal, technical terminology
- **Tone**: Business-like, interview-focused
- **Example**: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target."

#### Humorous Mode 😄
- **Language**: Funny, relatable descriptions
- **Tone**: Light-hearted, comedy-themed
- **Example**: "Alright, math wizards! We've got an array of numbers feeling lonely, and they want to find their perfect mathematical match!"

#### Gen Z Mode 💅
- **Language**: Modern slang ("fr fr", "no cap", "bestie")
- **Tone**: Trendy, social media-inspired
- **Example**: "Bestie, we're about to play matchmaker for some numbers! Find the TWO numbers that are literally perfect for each other fr fr"

### Implementation
- Content stored with personality variants in database
- Dynamic content serving based on user's selected vibe
- Consistent personality across all UI elements
- Real-time switching without page reloads

## 🎨 Design System

### Color Scheme
```css
/* CSS Custom Properties */
:root {
  --primary: 221.2 83.2% 53.3%;      /* Blue primary */
  --secondary: 210 40% 96%;          /* Light secondary */
  --success: 142.1 76.2% 36.3%;      /* Green success */
  --warning: 38.4 92.1% 50.2%;       /* Yellow warning */
  --destructive: 0 84.2% 60.2%;      /* Red destructive */
}

.dark {
  --primary: 217.2 91.2% 59.8%;      /* Lighter blue for dark */
  --background: 222.2 84% 4.9%;      /* Dark background */
  --foreground: 210 40% 98%;         /* Light text */
}
```

### Component Classes
- `.btn-primary` - Primary action buttons
- `.btn-secondary` - Secondary action buttons  
- `.card` - Container cards with shadows
- `.glass` - Glass morphism effects
- `.gradient-bg` - Animated gradient backgrounds

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Quick Start

1. **Clone and install**
```bash
git clone <repository-url>
cd feetcode
npm install
cd server && npm install && cd ..
```

2. **Configure Supabase**
- Create Supabase project
- Run `server/config/database.sql` in SQL Editor
- Copy project URL and service role key

3. **Environment Setup**
Create `server/.env`:
```env
SUPABASE_URL=your_project_url
SUPABASE_SERVICE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret
PORT=5000
```

4. **Start Development**
```bash
# Terminal 1 - Backend
cd server && npm start

# Terminal 2 - Frontend  
npm run dev
```

5. **Access Application**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Health Check: http://localhost:5000/api/health

## 🧪 Testing the Application

### Test User Journey
1. Visit landing page and switch personalities
2. Click "Get Started" to open auth modal
3. Register new account or sign in
4. Browse problems with search/filters
5. Click problem to open code editor
6. Write solution and test with "Run" button
7. Submit solution for full validation
8. Check dashboard for progress statistics

### API Testing
```bash
# Health check
curl http://localhost:5000/api/health

# Get problems
curl http://localhost:5000/api/server/problems

# Register user
curl -X POST http://localhost:5000/api/server/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"password123"}'
```

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm run build
# Deploy build folder to Vercel
```

### Backend (Railway/Heroku)
```bash
cd server
# Set environment variables in deployment platform
# Deploy server directory
```

## 🔮 Future Enhancements

### Planned Features
- [ ] **Leaderboards**: Global and friend rankings
- [ ] **Discussions**: Problem-specific forums
- [ ] **Contests**: Timed competitive coding
- [ ] **AI Hints**: Smart code suggestions
- [ ] **Video Solutions**: Tutorial explanations
- [ ] **Mobile App**: React Native implementation
- [ ] **More Languages**: C++, Go, Rust support
- [ ] **Advanced Analytics**: Performance insights

### Technical Improvements
- [ ] Real code execution environment (Docker)
- [ ] Advanced test case management
- [ ] Code plagiarism detection
- [ ] Performance monitoring and analytics
- [ ] Automated testing and CI/CD
- [ ] Advanced caching strategies

## 🤝 Contributing

### Development Workflow
1. Fork repository
2. Create feature branch: `git checkout -b feature-name`
3. Make changes and test thoroughly
4. Update documentation if needed
5. Commit: `git commit -m 'Add feature: description'`
6. Push: `git push origin feature-name`
7. Create Pull Request

### Code Style
- Use TypeScript for type safety
- Follow React best practices
- Maintain consistent naming conventions
- Write meaningful commit messages
- Add comments for complex logic

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **LeetCode** - Inspiration for problem-solving platform
- **Monaco Editor** - VSCode editor experience
- **Supabase** - Backend infrastructure
- **Tailwind CSS** - Utility-first styling
- **Next.js Team** - React framework

---

**FeetCode** - Where coding meets personality! 🚀✨

Made with ❤️ for developers who want to practice coding with style.