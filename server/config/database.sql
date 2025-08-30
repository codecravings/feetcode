-- FeetCode Database Schema for Supabase
-- Run this SQL in your Supabase SQL editor to set up the database

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  preferred_vibe VARCHAR(20) DEFAULT 'professional' CHECK (preferred_vibe IN ('professional', 'humorous', 'genz')),
  
  -- Stats
  problems_solved INTEGER DEFAULT 0,
  total_submissions INTEGER DEFAULT 0,
  accepted_submissions INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  max_streak INTEGER DEFAULT 0,
  last_solved TIMESTAMP WITH TIME ZONE,
  
  -- Profile
  is_verified BOOLEAN DEFAULT FALSE,
  is_premium BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Problems table
CREATE TABLE problems (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  
  -- Content for different vibes
  professional_title TEXT NOT NULL,
  professional_description TEXT NOT NULL,
  professional_hints JSONB DEFAULT '[]',
  professional_constraints JSONB DEFAULT '[]',
  
  humorous_title TEXT NOT NULL,
  humorous_description TEXT NOT NULL,
  humorous_hints JSONB DEFAULT '[]',
  humorous_constraints JSONB DEFAULT '[]',
  
  genz_title TEXT NOT NULL,
  genz_description TEXT NOT NULL,
  genz_hints JSONB DEFAULT '[]',
  genz_constraints JSONB DEFAULT '[]',
  
  -- Problem metadata
  difficulty VARCHAR(10) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  tags JSONB DEFAULT '[]',
  companies JSONB DEFAULT '[]',
  
  -- Test cases
  test_cases JSONB NOT NULL DEFAULT '[]',
  
  -- Code templates
  code_templates JSONB DEFAULT '{}',
  
  -- Statistics
  total_submissions INTEGER DEFAULT 0,
  accepted_submissions INTEGER DEFAULT 0,
  acceptance_rate FLOAT DEFAULT 0,
  average_time_taken INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  dislikes INTEGER DEFAULT 0,
  
  -- Premium and status
  is_premium BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  discussion_count INTEGER DEFAULT 0,
  
  -- Creator
  created_by UUID REFERENCES users(id),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Submissions table
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  
  -- Code and execution
  code TEXT NOT NULL,
  language VARCHAR(20) NOT NULL CHECK (language IN ('javascript', 'python', 'java', 'cpp', 'go', 'rust')),
  
  -- Results
  status VARCHAR(30) NOT NULL CHECK (status IN (
    'accepted', 'wrong-answer', 'time-limit-exceeded', 
    'memory-limit-exceeded', 'runtime-error', 'compile-error', 'internal-error'
  )),
  
  -- Test results
  test_results JSONB DEFAULT '[]',
  
  -- Performance metrics
  total_execution_time INTEGER DEFAULT 0,
  total_memory_used BIGINT DEFAULT 0,
  passed_test_cases INTEGER DEFAULT 0,
  total_test_cases INTEGER DEFAULT 0,
  
  -- Social and metadata
  is_public BOOLEAN DEFAULT FALSE,
  likes INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  notes TEXT,
  
  -- Tracking
  ip_address INET,
  user_agent TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Solved problems tracking
CREATE TABLE user_solved_problems (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  difficulty VARCHAR(10) NOT NULL,
  best_time INTEGER,
  language VARCHAR(20),
  solved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, problem_id)
);

-- Discussions table
CREATE TABLE discussions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Content
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(20) DEFAULT 'general' CHECK (type IN ('question', 'solution', 'hint', 'general')),
  tags JSONB DEFAULT '[]',
  
  -- Code snippet (optional)
  code_snippet TEXT,
  code_language VARCHAR(20),
  
  -- Social metrics
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  dislikes INTEGER DEFAULT 0,
  
  -- Status
  is_locked BOOLEAN DEFAULT FALSE,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_solved BOOLEAN DEFAULT FALSE,
  is_reported BOOLEAN DEFAULT FALSE,
  report_count INTEGER DEFAULT 0,
  
  -- Activity tracking
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Discussion replies
CREATE TABLE discussion_replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  discussion_id UUID NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Content
  content TEXT NOT NULL,
  code_snippet TEXT,
  code_language VARCHAR(20),
  
  -- Social
  likes INTEGER DEFAULT 0,
  is_accepted_answer BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User achievements/badges
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Following system
CREATE TABLE user_follows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Create indexes for performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_problems_slug ON problems(slug);
CREATE INDEX idx_problems_difficulty ON problems(difficulty);
CREATE INDEX idx_problems_is_active ON problems(is_active);
CREATE INDEX idx_submissions_user_id ON submissions(user_id);
CREATE INDEX idx_submissions_problem_id ON submissions(problem_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_created_at ON submissions(created_at);
CREATE INDEX idx_discussions_problem_id ON discussions(problem_id);
CREATE INDEX idx_discussion_replies_discussion_id ON discussion_replies(discussion_id);
CREATE INDEX idx_user_solved_problems_user_id ON user_solved_problems(user_id);

-- Update updated_at timestamps automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_problems_updated_at BEFORE UPDATE ON problems FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_discussions_updated_at BEFORE UPDATE ON discussions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data
INSERT INTO problems (
  slug, 
  professional_title, professional_description, professional_hints, professional_constraints,
  humorous_title, humorous_description, humorous_hints, humorous_constraints,
  genz_title, genz_description, genz_hints, genz_constraints,
  difficulty, tags, companies, test_cases, code_templates
) VALUES (
  'two-sum',
  'Two Sum',
  'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.',
  '["A really brute force way would be to search for all possible pairs of numbers but that would be too slow.", "Think about how you can use a hash table to solve this problem efficiently.", "Try to loop through the array once and for each element, check if the complement exists in the hash table."]',
  '["2 ≤ nums.length ≤ 10⁴", "-10⁹ ≤ nums[i] ≤ 10⁹", "-10⁹ ≤ target ≤ 10⁹", "Only one valid answer exists."]',
  
  'Two Sum (The Dating App Algorithm)',
  'You''re playing matchmaker for numbers! Given an array of lonely integers and their perfect match (target), find the two numbers that complement each other perfectly.

Just like in dating apps, each number is looking for "the one" that completes them. Your job is to return the indices of this perfect mathematical couple.

Rules of engagement:
- No number can date itself (you can''t use the same element twice)
- There''s exactly one perfect match in this array
- Order doesn''t matter - love is love!',
  '["Don''t go on every possible first date - that''s exhausting and inefficient!", "Keep a little black book (hash table) of all the numbers you''ve met", "For each number, check if their perfect match is already in your contacts"]',
  '["At least 2 numbers are looking for love (2 ≤ nums.length ≤ 10⁴)", "Numbers range from heartbroken to ecstatic (-10⁹ to 10⁹)", "The target relationship goal is also realistic (-10⁹ to 10⁹)", "There''s exactly one soulmate pair (guaranteed happy ending!)"]',
  
  'Two Sum (Find Your Math Bestie)',
  'Yo! You''ve got this array of numbers that are all looking for their math bestie to hit that target sum, no cap!

Your mission (and you WILL accept it) is to find the two numbers that vibe together perfectly and return their positions in the array.

The tea: ☕
- Each number can only be used once (no toxic relationships here)
- There''s exactly one perfect pair (we love that for them)
- Order doesn''t matter - this isn''t a competition bestie

Let''s get these numbers their happily ever after! 💅',
  '["Don''t try to match every single number with everyone else - that''s giving desperate energy", "Use a hash map to keep track of the numbers you''ve already seen - it''s giving organized queen", "For each number, check if its complement is already in your notes app (hash map)"]',
  '["At least 2 numbers in this friendship group (2 ≤ nums.length ≤ 10⁴)", "Numbers are valid and within reasonable range (-10⁹ to 10⁹)", "Target sum is also reasonable (-10⁹ to 10⁹)", "There''s exactly one perfect match (as it should be 💅)"]',
  
  'easy',
  '["array", "hash-table"]',
  '["amazon", "google", "microsoft"]',
  '[
    {"input": "nums = [2,7,11,15], target = 9", "expectedOutput": "[0,1]", "isPublic": true, "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]."},
    {"input": "nums = [3,2,4], target = 6", "expectedOutput": "[1,2]", "isPublic": true, "explanation": "Because nums[1] + nums[2] == 6, we return [1, 2]."},
    {"input": "nums = [3,3], target = 6", "expectedOutput": "[0,1]", "isPublic": true, "explanation": "Because nums[0] + nums[1] == 6, we return [0, 1]."}
  ]',
  '{
    "javascript": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    // Write your solution here\n};",
    "python": "class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        # Write your solution here\n        pass"
  }'
);