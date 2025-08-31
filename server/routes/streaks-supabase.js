const express = require('express');
const supabase = require('../config/supabase');
const router = express.Router();

// Get user streak data
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const { data: user, error: userError } = await supabase
      .from('users')
      .select(`
        current_streak,
        max_streak,
        problems_solved,
        total_submissions,
        accepted_submissions,
        last_solved_at,
        streak_freeze_count,
        created_at
      `)
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get recent submissions for weekly calendar
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const { data: recentSubmissions, error: submissionsError } = await supabase
      .from('submissions')
      .select('created_at, status')
      .eq('user_id', userId)
      .gte('created_at', oneWeekAgo.toISOString())
      .eq('status', 'Accepted')
      .order('created_at', { ascending: false });

    // Calculate weekly streak array (last 7 days)
    const weeklyStreak = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      
      const hasSolvedToday = recentSubmissions?.some(submission => {
        const submissionDate = new Date(submission.created_at);
        return submissionDate >= dayStart && submissionDate <= dayEnd;
      });
      
      weeklyStreak.push(hasSolvedToday ? 1 : 0);
    }

    // Calculate difficulty breakdown
    const { data: solvedProblems, error: problemsError } = await supabase
      .from('submissions')
      .select(`
        problems!inner(difficulty)
      `)
      .eq('user_id', userId)
      .eq('status', 'Accepted');

    const difficultyBreakdown = {
      easy: 0,
      medium: 0,
      hard: 0
    };

    if (solvedProblems) {
      solvedProblems.forEach(submission => {
        const difficulty = submission.problems.difficulty.toLowerCase();
        if (difficultyBreakdown.hasOwnProperty(difficulty)) {
          difficultyBreakdown[difficulty]++;
        }
      });
    }

    const streakData = {
      currentStreak: user.current_streak || 0,
      longestStreak: user.max_streak || 0,
      lastProblemDate: user.last_solved_at,
      streakFreeze: false, // Would be calculated based on last activity
      freezeCount: user.streak_freeze_count || 2,
      totalProblems: user.problems_solved || 0,
      weeklyStreak,
      difficultyBreakdown,
      totalSubmissions: user.total_submissions || 0,
      acceptedSubmissions: user.accepted_submissions || 0
    };

    res.json(streakData);
  } catch (error) {
    console.error('Get streak data error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update streak (called when user solves a problem)
router.post('/:userId/update', async (req, res) => {
  try {
    const { userId } = req.params;
    const { problemSolved } = req.body;

    if (!problemSolved) {
      return res.status(400).json({ error: 'Problem solved status required' });
    }

    // Get current user data
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('current_streak, max_streak, last_solved_at')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const now = new Date();
    const lastSolved = user.last_solved_at ? new Date(user.last_solved_at) : null;
    
    let newCurrentStreak = 1;
    let newMaxStreak = user.max_streak || 1;

    if (lastSolved) {
      const daysDiff = Math.floor((now.getTime() - lastSolved.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        // Consecutive day - increment streak
        newCurrentStreak = (user.current_streak || 0) + 1;
      } else if (daysDiff === 0) {
        // Same day - keep current streak
        newCurrentStreak = user.current_streak || 1;
      } else {
        // Gap in streak - reset to 1
        newCurrentStreak = 1;
      }
    }

    // Update max streak if current exceeds it
    if (newCurrentStreak > newMaxStreak) {
      newMaxStreak = newCurrentStreak;
    }

    // Update user record
    const { error: updateError } = await supabase
      .from('users')
      .update({
        current_streak: newCurrentStreak,
        max_streak: newMaxStreak,
        last_solved_at: now.toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Streak update error:', updateError);
      return res.status(500).json({ error: 'Failed to update streak' });
    }

    res.json({
      currentStreak: newCurrentStreak,
      maxStreak: newMaxStreak,
      milestone: newCurrentStreak > (user.current_streak || 0) && [7, 14, 30, 50, 100].includes(newCurrentStreak)
    });

  } catch (error) {
    console.error('Update streak error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Use streak freeze
router.post('/:userId/freeze', async (req, res) => {
  try {
    const { userId } = req.params;

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('streak_freeze_count')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if ((user.streak_freeze_count || 0) <= 0) {
      return res.status(400).json({ error: 'No streak freezes available' });
    }

    const { error: updateError } = await supabase
      .from('users')
      .update({
        streak_freeze_count: (user.streak_freeze_count || 0) - 1,
        last_solved_at: new Date().toISOString() // Extend the streak
      })
      .eq('id', userId);

    if (updateError) {
      return res.status(500).json({ error: 'Failed to use streak freeze' });
    }

    res.json({ 
      success: true, 
      remainingFreezes: (user.streak_freeze_count || 0) - 1 
    });
  } catch (error) {
    console.error('Use streak freeze error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get streak leaderboard
router.get('/leaderboard/:type', async (req, res) => {
  try {
    const { type } = req.params; // 'current', 'longest', or 'global'
    const { limit = 50 } = req.query;

    let orderBy;
    switch (type) {
      case 'longest':
        orderBy = 'max_streak';
        break;
      case 'global':
        orderBy = 'problems_solved';
        break;
      default:
        orderBy = 'current_streak';
    }

    const { data: users, error } = await supabase
      .from('users')
      .select(`
        id,
        username,
        email,
        current_streak,
        max_streak,
        problems_solved,
        created_at
      `)
      .gt(orderBy, 0)
      .order(orderBy, { ascending: false })
      .limit(parseInt(limit));

    if (error) {
      console.error('Leaderboard error:', error);
      return res.status(500).json({ error: 'Database error' });
    }

    // Add rank and level to each user
    const leaderboard = users.map((user, index) => {
      const streak = type === 'longest' ? user.max_streak : 
                    type === 'global' ? user.problems_solved : 
                    user.current_streak;
      
      let level = 'Starter';
      if (streak >= 100) level = 'Legend';
      else if (streak >= 50) level = 'Master';
      else if (streak >= 30) level = 'Expert';
      else if (streak >= 14) level = 'Pro';
      else if (streak >= 7) level = 'Rising';

      return {
        ...user,
        rank: index + 1,
        level
      };
    });

    res.json({ leaderboard });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;