const express = require('express');
const supabase = require('../config/supabase');
const router = express.Router();

// Get user profile (simplified for demo)
router.get('/:username', async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('username, problems_solved, total_submissions, accepted_submissions, current_streak, max_streak, created_at, is_verified, is_premium')
      .eq('username', req.params.username)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get leaderboard (simplified for demo)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const from = (parseInt(page) - 1) * parseInt(limit);
    const to = from + parseInt(limit) - 1;

    const { data: users, error } = await supabase
      .from('users')
      .select('username, problems_solved, current_streak, max_streak, created_at')
      .gt('problems_solved', 0)
      .order('problems_solved', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({
      users,
      totalPages: Math.ceil(users.length / parseInt(limit)),
      currentPage: parseInt(page)
    });

  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;