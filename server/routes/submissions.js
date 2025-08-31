const express = require('express');
const Submission = require('../models/Submission');
const Problem = require('../models/Problem');
const User = require('../models/User');
const { auth, optionalAuth } = require('../middleware/auth');
const EnhancedCodeExecutor = require('../services/enhancedCodeExecutor');
const router = express.Router();

const codeExecutor = new EnhancedCodeExecutor();

// Submit code for a problem
router.post('/', auth, async (req, res) => {
  try {
    const { problemId, code, language } = req.body;

    if (!problemId || !code || !language) {
      return res.status(400).json({ error: 'Problem ID, code, and language are required' });
    }

    // Validate code
    try {
      codeExecutor.validateCode(code, language);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    // Get problem
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    // Execute code against test cases
    let executionResult;
    try {
      executionResult = await codeExecutor.executeCode(
        code,
        language,
        problem.testCases,
        10000 // 10 second timeout
      );
    } catch (error) {
      return res.status(400).json({ 
        error: 'Code execution failed',
        details: error.message 
      });
    }

    // Create submission record
    const submission = new Submission({
      user: req.user._id,
      problem: problemId,
      code,
      language,
      status: executionResult.status,
      testResults: executionResult.testResults,
      totalExecutionTime: executionResult.totalExecutionTime,
      passedTestCases: executionResult.passedTestCases,
      totalTestCases: executionResult.totalTestCases,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    await submission.save();

    // Update problem statistics
    problem.updateStats(
      executionResult.status === 'accepted',
      executionResult.totalExecutionTime
    );
    await problem.save();

    // Update user statistics if accepted
    if (executionResult.status === 'accepted') {
      const user = await User.findById(req.user._id);
      
      // Check if this is the first time solving this problem
      const existingSubmission = await Submission.findOne({
        user: req.user._id,
        problem: problemId,
        status: 'accepted',
        _id: { $ne: submission._id }
      });

      if (!existingSubmission) {
        user.updateStats(problem.difficulty, executionResult.totalExecutionTime);
        user.solvedProblems.push({
          problemId: problemId,
          difficulty: problem.difficulty,
          bestTime: executionResult.totalExecutionTime,
          language: language
        });
        await user.save();
      }
    }

    // Format response like LeetCode
    const formattedResult = codeExecutor.formatLeetCodeResult(executionResult);
    
    res.status(201).json({
      message: 'Code submitted successfully',
      submission: {
        _id: submission._id,
        status: submission.status,
        testResults: submission.testResults,
        totalExecutionTime: submission.totalExecutionTime,
        passedTestCases: submission.passedTestCases,
        totalTestCases: submission.totalTestCases,
        submittedAt: submission.submittedAt
      },
      result: formattedResult
    });

  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's submissions for a problem
router.get('/problem/:problemId', auth, async (req, res) => {
  try {
    const { problemId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const submissions = await Submission.find({
      user: req.user._id,
      problem: problemId
    })
    .sort({ submittedAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .select('-code -testResults -ipAddress -userAgent');

    const total = await Submission.countDocuments({
      user: req.user._id,
      problem: problemId
    });

    res.json({
      submissions,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page)
    });

  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get submission details
router.get('/:submissionId', auth, async (req, res) => {
  try {
    const submission = await Submission.findOne({
      _id: req.params.submissionId,
      user: req.user._id
    }).populate('problem', 'slug content difficulty');

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    res.json({ submission });

  } catch (error) {
    console.error('Get submission error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get recent submissions for user
router.get('/user/recent', auth, async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const submissions = await Submission.getRecentSubmissions(req.user._id, parseInt(limit));

    res.json({ submissions });

  } catch (error) {
    console.error('Get recent submissions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get problem leaderboard
router.get('/leaderboard/:problemId', optionalAuth, async (req, res) => {
  try {
    const { problemId } = req.params;
    const { limit = 10 } = req.query;

    const leaderboard = await Submission.getProblemLeaderboard(problemId, parseInt(limit));

    res.json({ leaderboard });

  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Make submission public/private
router.put('/:submissionId/visibility', auth, async (req, res) => {
  try {
    const { isPublic } = req.body;
    
    const submission = await Submission.findOne({
      _id: req.params.submissionId,
      user: req.user._id
    });

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    submission.isPublic = isPublic;
    await submission.save();

    res.json({ 
      message: 'Submission visibility updated',
      isPublic: submission.isPublic 
    });

  } catch (error) {
    console.error('Update visibility error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get public submissions for a problem (for learning)
router.get('/public/:problemId', optionalAuth, async (req, res) => {
  try {
    const { problemId } = req.params;
    const { page = 1, limit = 10, language, sortBy = 'likes' } = req.query;

    const query = {
      problem: problemId,
      status: 'accepted',
      isPublic: true
    };

    if (language) query.language = language;

    const sortOptions = {};
    if (sortBy === 'likes') {
      sortOptions.likes = -1;
    } else if (sortBy === 'speed') {
      sortOptions.totalExecutionTime = 1;
    } else {
      sortOptions.submittedAt = -1;
    }

    const submissions = await Submission.find(query)
      .populate('user', 'username')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('code language totalExecutionTime likes submittedAt user');

    const total = await Submission.countDocuments(query);

    res.json({
      submissions,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page)
    });

  } catch (error) {
    console.error('Get public submissions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Run code without submitting (for testing)
router.post('/run', optionalAuth, async (req, res) => {
  try {
    const { code, language, testCases } = req.body;

    if (!code || !language || !testCases) {
      return res.status(400).json({ error: 'Code, language, and test cases are required' });
    }

    // Validate code
    try {
      codeExecutor.validateCode(code, language);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    // Execute code against test cases
    let executionResult;
    try {
      executionResult = await codeExecutor.executeCode(
        code,
        language,
        testCases,
        5000 // 5 second timeout for testing
      );
    } catch (error) {
      return res.status(400).json({ 
        error: 'Code execution failed',
        details: error.message 
      });
    }

    // Format response like LeetCode
    const formattedResult = codeExecutor.formatLeetCodeResult(executionResult);
    
    res.json({
      results: executionResult.testResults,
      status: executionResult.status,
      totalExecutionTime: executionResult.totalExecutionTime,
      passedTestCases: executionResult.passedTestCases,
      totalTestCases: executionResult.totalTestCases,
      leetcode: formattedResult
    });

  } catch (error) {
    console.error('Run code error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;