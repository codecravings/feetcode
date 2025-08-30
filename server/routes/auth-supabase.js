const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const supabase = require('../config/supabase');
const router = express.Router();

// Helper function to exclude password from user object
const excludePassword = (user) => {
  if (!user) return null;
  const { password_hash, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, preferredVibe } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const { data: existingUsers, error: checkError } = await supabase
      .from('users')
      .select('id, username, email')
      .or(`email.eq.${email},username.eq.${username}`);

    if (checkError) {
      console.error('Database error:', checkError);
      return res.status(500).json({ error: 'Database error' });
    }

    if (existingUsers && existingUsers.length > 0) {
      const existingUser = existingUsers[0];
      const errorMsg = existingUser.email === email ? 'Email already registered' : 'Username already taken';
      return res.status(400).json({ error: errorMsg });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create new user
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([{
        username,
        email,
        password_hash: passwordHash,
        preferred_vibe: preferredVibe || 'professional'
      }])
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return res.status(500).json({ error: 'Failed to create user' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: newUser.id, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: excludePassword(newUser)
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).json({ error: 'Email/username and password are required' });
    }

    // Find user by email or username
    const { data: users, error: findError } = await supabase
      .from('users')
      .select('*')
      .or(`email.eq.${emailOrUsername.toLowerCase()},username.eq.${emailOrUsername}`);

    if (findError) {
      console.error('Find user error:', findError);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!users || users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last active
    const { error: updateError } = await supabase
      .from('users')
      .update({ last_active: new Date().toISOString() })
      .eq('id', user.id);

    if (updateError) {
      console.error('Update last active error:', updateError);
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: excludePassword(user)
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Get current user (requires auth middleware)
router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', decoded.userId)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    res.json({ user: excludePassword(user) });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Update user preferences
router.put('/preferences', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { preferredVibe } = req.body;

    if (preferredVibe && !['professional', 'humorous', 'genz'].includes(preferredVibe)) {
      return res.status(400).json({ error: 'Invalid vibe preference' });
    }

    const updates = {};
    if (preferredVibe) updates.preferred_vibe = preferredVibe;
    updates.updated_at = new Date().toISOString();

    const { data: user, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', decoded.userId)
      .select()
      .single();

    if (error) {
      console.error('Update preferences error:', error);
      return res.status(500).json({ error: 'Failed to update preferences' });
    }

    res.json({
      message: 'Preferences updated successfully',
      user: excludePassword(user)
    });

  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Logout (client-side handles token removal)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

module.exports = router;