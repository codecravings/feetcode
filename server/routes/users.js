const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Get user profile
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('-password -email')
      .populate('solvedProblems.problemId', 'title difficulty');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get leaderboard
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, sortBy = 'problemsSolved' } = req.query;
    
    const sortOptions = {
      problemsSolved: { 'stats.problemsSolved': -1 },
      streak: { 'stats.currentStreak': -1 },
      maxStreak: { 'stats.maxStreak': -1 }
    };

    const sort = sortOptions[sortBy] || sortOptions.problemsSolved;

    const users = await User.find({ 'stats.problemsSolved': { $gt: 0 } })
      .select('username stats badges joinedAt')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments({ 'stats.problemsSolved': { $gt: 0 } });

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page)
    });

  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Follow/unfollow user
router.post('/:username/follow', auth, async (req, res) => {
  try {
    const targetUser = await User.findOne({ username: req.params.username });
    
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (targetUser._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }

    const currentUser = await User.findById(req.user._id);
    const isFollowing = currentUser.following.includes(targetUser._id);

    if (isFollowing) {
      // Unfollow
      currentUser.following.pull(targetUser._id);
      targetUser.followers.pull(currentUser._id);
    } else {
      // Follow
      currentUser.following.push(targetUser._id);
      targetUser.followers.push(currentUser._id);
    }

    await currentUser.save();
    await targetUser.save();

    res.json({
      message: isFollowing ? 'Unfollowed successfully' : 'Followed successfully',
      isFollowing: !isFollowing
    });

  } catch (error) {
    console.error('Follow/unfollow error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's followers
router.get('/:username/followers', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .populate('followers', 'username stats.problemsSolved joinedAt');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ followers: user.followers });
  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's following
router.get('/:username/following', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .populate('following', 'username stats.problemsSolved joinedAt');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ following: user.following });
  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;