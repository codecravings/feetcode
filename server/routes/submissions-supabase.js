const express = require('express');
const supabase = require('../config/supabase');
const CodeExecutor = require('../services/codeExecutor');
const router = express.Router();

const codeExecutor = new CodeExecutor();

// Mock submission endpoint (simplified for demo)
router.post('/', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const { problemId, code, language } = req.body;

    if (!problemId || !code || !language) {
      return res.status(400).json({ error: 'Problem ID, code, and language are required' });
    }

    // Load problem to get test cases
    const fs = require('fs').promises;
    const path = require('path');
    
    let problemTestCases = [];
    try {
      const problemsPath = path.join(__dirname, '../../data/problems.json');
      const problemsData = await fs.readFile(problemsPath, 'utf-8');
      const problems = JSON.parse(problemsData);
      const problem = problems.find(p => p.id === problemId);
      
      if (problem && problem.testCases) {
        problemTestCases = problem.testCases.map(tc => ({
          input: tc.input,
          expectedOutput: tc.expected
        }));
      }
    } catch (error) {
      console.error('Error loading problem test cases:', error);
    }

    // If no test cases found, use mock results
    if (problemTestCases.length === 0) {
      problemTestCases = [
        { input: '[2,7,11,15], 9', expectedOutput: '[0,1]' },
        { input: '[3,2,4], 6', expectedOutput: '[1,2]' },
        { input: '[3,3], 6', expectedOutput: '[0,1]' }
      ];
    }

    // Execute code using the real CodeExecutor service
    let executionResult;
    try {
      // Validate code first
      codeExecutor.validateCode(code, language);
      
      executionResult = await codeExecutor.executeCode(
        code,
        language,
        problemTestCases,
        10000 // 10 second timeout for full submission
      );
    } catch (error) {
      console.error('Code execution error:', error);
      return res.status(400).json({ 
        error: 'Code execution failed', 
        details: error.message 
      });
    }

    const allPassed = executionResult.status === 'accepted';
    const status = executionResult.status;

    // Update streak if submission was accepted
    if (allPassed) {
      try {
        const updateStreakResponse = await fetch(`http://localhost:${process.env.PORT || 5001}/api/streaks/demo123/update`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ problemSolved: true })
        });
        
        if (updateStreakResponse.ok) {
          const streakData = await updateStreakResponse.json();
          response.streakUpdate = streakData;
        }
      } catch (error) {
        console.error('Failed to update streak:', error);
      }
    }

    // Format results for response
    const formattedResults = executionResult.testResults.map(result => ({
      passed: result.passed,
      input: result.input || problemTestCases[result.testCaseIndex]?.input,
      expectedOutput: result.expectedOutput,
      actualOutput: result.actualOutput,
      executionTime: result.executionTime,
      error: result.error
    }));

    const response = {
      message: allPassed ? 'Accepted! Great job! 🎉' : 'Some test cases failed. Keep trying!',
      accepted: allPassed,
      submission: {
        _id: 'mock-submission-id',
        status: status,
        testResults: formattedResults,
        totalExecutionTime: executionResult.totalExecutionTime,
        passedTestCases: executionResult.passedTestCases,
        totalTestCases: executionResult.totalTestCases,
        submittedAt: new Date().toISOString()
      }
    };

    if (allPassed) {
      res.status(201).json(response);
    } else {
      // Return results for failed submissions
      response.results = formattedResults;
      res.status(200).json(response);
    }

  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's recent submissions (mock for demo)
router.get('/user/recent', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    // Mock recent submissions
    const mockSubmissions = [
      {
        _id: 'mock-1',
        problem: {
          slug: 'two-sum',
          content: {
            professional: { title: 'Two Sum' },
            humorous: { title: 'Two Sum (The Dating App Algorithm)' },
            genz: { title: 'Two Sum (Find Your Math Bestie)' }
          },
          difficulty: 'easy'
        },
        status: 'accepted',
        language: 'javascript',
        submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        executionTime: 125
      }
    ];

    res.json({ submissions: mockSubmissions });

  } catch (error) {
    console.error('Get recent submissions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Run code endpoint (for testing without submitting)
router.post('/run', async (req, res) => {
  try {
    const { code, language, testCases } = req.body;

    if (!code || !language || !testCases) {
      return res.status(400).json({ error: 'Code, language, and test cases are required' });
    }

    // Validate code before execution
    try {
      codeExecutor.validateCode(code, language);
    } catch (error) {
      return res.status(400).json({ error: 'Code validation failed: ' + error.message });
    }

    // Execute code using the real CodeExecutor service
    let executionResult;
    try {
      // Only run first 2-3 test cases for quick feedback
      const limitedTestCases = testCases.slice(0, 3).map(tc => ({
        input: tc.input,
        expectedOutput: tc.expected || tc.expectedOutput
      }));

      executionResult = await codeExecutor.executeCode(
        code,
        language,
        limitedTestCases,
        5000 // 5 second timeout for testing
      );
    } catch (error) {
      console.error('Code execution error:', error);
      return res.status(500).json({ 
        error: 'Code execution failed', 
        details: error.message 
      });
    }

    // Format results for frontend
    const results = executionResult.testResults.map(result => ({
      passed: result.passed,
      input: result.input || testCases[result.testCaseIndex]?.input,
      expected: result.expectedOutput,
      actual: result.actualOutput,
      runtime: result.executionTime,
      error: result.error
    }));

    res.json({
      results,
      status: executionResult.status,
      totalExecutionTime: executionResult.totalExecutionTime,
      passedTestCases: executionResult.passedTestCases,
      totalTestCases: executionResult.totalTestCases
    });

  } catch (error) {
    console.error('Run code error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;