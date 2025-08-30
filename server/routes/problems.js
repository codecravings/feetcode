const express = require('express');
const Problem = require('../models/Problem');
const { auth, optionalAuth } = require('../middleware/auth');
const router = express.Router();

// Get all problems with filtering and pagination
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      difficulty,
      tags,
      companies,
      isPremium,
      search,
      sortBy = 'createdAt',
      sortOrder = -1
    } = req.query;

    const filters = {
      difficulty: difficulty ? difficulty.split(',') : undefined,
      tags: tags ? tags.split(',') : undefined,
      companies: companies ? companies.split(',') : undefined,
      isPremium: isPremium === 'true' ? true : isPremium === 'false' ? false : undefined,
      search,
      sortBy,
      sortOrder: parseInt(sortOrder),
      page: parseInt(page),
      limit: parseInt(limit)
    };

    const problems = await Problem.getFilteredProblems(filters);
    const total = await Problem.countDocuments({ 
      isActive: true,
      ...(filters.difficulty && { difficulty: { $in: filters.difficulty } }),
      ...(filters.tags && { tags: { $in: filters.tags } }),
      ...(filters.companies && { companies: { $in: filters.companies } }),
      ...(typeof filters.isPremium === 'boolean' && { isPremium: filters.isPremium }),
      ...(filters.search && {
        $or: [
          { 'content.professional.title': { $regex: filters.search, $options: 'i' } },
          { 'content.humorous.title': { $regex: filters.search, $options: 'i' } },
          { 'content.genz.title': { $regex: filters.search, $options: 'i' } },
          { slug: { $regex: filters.search, $options: 'i' } }
        ]
      })
    });

    // Add user's status for each problem if authenticated
    let problemsWithStatus = problems;
    if (req.user) {
      const Submission = require('../models/Submission');
      const User = require('../models/User');
      
      const user = await User.findById(req.user._id);
      const solvedProblemIds = user.solvedProblems.map(sp => sp.problemId.toString());
      
      const attemptedProblems = await Submission.find({
        user: req.user._id,
        problem: { $in: problems.map(p => p._id) }
      }).distinct('problem');
      
      problemsWithStatus = problems.map(problem => {
        let status = undefined;
        const problemId = problem._id.toString();
        
        if (solvedProblemIds.includes(problemId)) {
          status = 'solved';
        } else if (attemptedProblems.map(p => p.toString()).includes(problemId)) {
          status = 'attempted';
        } else if (problem.isPremium && !user.isPremium) {
          status = 'locked';
        }
        
        return {
          ...problem.toObject(),
          status
        };
      });
    }

    res.json({
      problems: problemsWithStatus,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: problems.length,
        totalProblems: total
      }
    });

  } catch (error) {
    console.error('Get problems error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get problem by slug
router.get('/:slug', optionalAuth, async (req, res) => {
  try {
    const problem = await Problem.findOne({ 
      slug: req.params.slug, 
      isActive: true 
    });

    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    let problemData = problem.toObject();

    // Add user's status and attempts if authenticated
    if (req.user) {
      const Submission = require('../models/Submission');
      const User = require('../models/User');

      const user = await User.findById(req.user._id);
      const isSolved = user.solvedProblems.some(
        sp => sp.problemId.toString() === problem._id.toString()
      );

      if (isSolved) {
        problemData.status = 'solved';
      } else {
        const hasAttempts = await Submission.findOne({
          user: req.user._id,
          problem: problem._id
        });
        
        if (hasAttempts) {
          problemData.status = 'attempted';
        }
      }

      // Get user's best submission
      const bestSubmission = await Submission.getBestSubmission(req.user._id, problem._id);
      if (bestSubmission) {
        problemData.userBestSubmission = {
          language: bestSubmission.language,
          executionTime: bestSubmission.totalExecutionTime,
          submittedAt: bestSubmission.submittedAt
        };
      }
    }

    // Check premium access
    if (problem.isPremium && (!req.user || !req.user.isPremium)) {
      problemData.status = 'locked';
      // Hide some content for non-premium users
      delete problemData.testCases;
      delete problemData.codeTemplates;
    }

    res.json({ problem: problemData });

  } catch (error) {
    console.error('Get problem error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get problem statistics
router.get('/:slug/stats', async (req, res) => {
  try {
    const problem = await Problem.findOne({ 
      slug: req.params.slug, 
      isActive: true 
    }).select('stats slug difficulty');

    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    // Additional stats could be calculated here
    const Submission = require('../models/Submission');
    
    // Language distribution
    const languageStats = await Submission.aggregate([
      { $match: { problem: problem._id, status: 'accepted' } },
      { $group: { _id: '$language', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      basicStats: problem.stats,
      languageDistribution: languageStats,
      difficulty: problem.difficulty
    });

  } catch (error) {
    console.error('Get problem stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all available tags
router.get('/meta/tags', async (req, res) => {
  try {
    const tags = await Problem.distinct('tags', { isActive: true });
    res.json({ tags: tags.sort() });
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all available companies
router.get('/meta/companies', async (req, res) => {
  try {
    const companies = await Problem.distinct('companies', { isActive: true });
    res.json({ companies: companies.sort() });
  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Like/unlike a problem
router.post('/:slug/like', auth, async (req, res) => {
  try {
    const problem = await Problem.findOne({ slug: req.params.slug, isActive: true });
    
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    // Check if user already liked this problem
    // This would typically be stored in a separate collection for scalability
    // For now, we'll just increment/decrement the likes count

    // In a real implementation, you'd want to:
    // 1. Create a ProblemLike model to track user likes
    // 2. Implement proper like/unlike logic
    // 3. Prevent multiple likes from same user

    problem.stats.likes += 1;
    await problem.save();

    res.json({ 
      message: 'Problem liked successfully',
      likes: problem.stats.likes 
    });

  } catch (error) {
    console.error('Like problem error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get random problem
router.get('/random/pick', optionalAuth, async (req, res) => {
  try {
    const { difficulty } = req.query;
    
    const matchStage = { isActive: true };
    if (difficulty) matchStage.difficulty = difficulty;
    
    // If user is not premium, exclude premium problems
    if (!req.user || !req.user.isPremium) {
      matchStage.isPremium = false;
    }

    const randomProblems = await Problem.aggregate([
      { $match: matchStage },
      { $sample: { size: 1 } }
    ]);

    if (randomProblems.length === 0) {
      return res.status(404).json({ error: 'No problems found matching criteria' });
    }

    const problem = randomProblems[0];
    res.json({ problem });

  } catch (error) {
    console.error('Get random problem error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;