const express = require('express');
const supabase = require('../config/supabase');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();

// Fallback function to load problems from JSON file
async function loadProblemsFromJSON() {
  try {
    const problemsPath = path.join(__dirname, '../../data/problems.json');
    const problemsData = await fs.readFile(problemsPath, 'utf-8');
    const problems = JSON.parse(problemsData);
    
    return problems.map(problem => ({
      id: problem.id,
      title: problem.title,
      difficulty: problem.difficulty,
      category: problem.category,
      solved: false,
      acceptance_rate: problem.acceptance_rate,
      description_professional: problem.description?.professional,
      description_humorous: problem.description?.humorous,
      description_genz: problem.description?.genz,
      tags: problem.tags,
      examples: problem.examples,
      constraints: problem.constraints,
      startingCode: problem.startingCode,
      testCases: problem.testCases
    }));
  } catch (error) {
    console.error('Error loading problems from JSON:', error);
    return [];
  }
}

// Get all problems with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      difficulty,
      search
    } = req.query;

    let query = supabase
      .from('problems')
      .select('*')
      .eq('is_active', true);

    // Apply filters
    if (difficulty) {
      query = query.eq('difficulty', difficulty);
    }

    if (search) {
      query = query.or(`professional_title.ilike.%${search}%,humorous_title.ilike.%${search}%,genz_title.ilike.%${search}%,slug.ilike.%${search}%`);
    }

    // Apply pagination
    const from = (parseInt(page) - 1) * parseInt(limit);
    const to = from + parseInt(limit) - 1;
    
    query = query.range(from, to);

    const { data: problems, error, count } = await query;

    // Always try to use JSON file first (has more problems)
    const jsonProblems = await loadProblemsFromJSON();
    if (jsonProblems && jsonProblems.length > 0) {
      console.log(`Serving ${jsonProblems.length} problems from JSON file`);
      return res.json({ problems: jsonProblems });
    }

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Database error' });
    }

    // If no problems in JSON, use database
    if (!problems || problems.length === 0) {
      return res.json({ problems: [] });
    }

    // Transform the data to match expected format
    const transformedProblems = problems.map(problem => ({
      _id: problem.id,
      slug: problem.slug,
      content: {
        professional: {
          title: problem.professional_title,
          description: problem.professional_description,
          hints: problem.professional_hints,
          constraints: problem.professional_constraints
        },
        humorous: {
          title: problem.humorous_title,
          description: problem.humorous_description,
          hints: problem.humorous_hints,
          constraints: problem.humorous_constraints
        },
        genz: {
          title: problem.genz_title,
          description: problem.genz_description,
          hints: problem.genz_hints,
          constraints: problem.genz_constraints
        }
      },
      difficulty: problem.difficulty,
      tags: problem.tags,
      companies: problem.companies,
      testCases: problem.test_cases,
      codeTemplates: problem.code_templates,
      stats: {
        totalSubmissions: problem.total_submissions,
        acceptedSubmissions: problem.accepted_submissions,
        acceptanceRate: problem.acceptance_rate,
        likes: problem.likes,
        dislikes: problem.dislikes
      },
      isPremium: problem.is_premium,
      discussionCount: problem.discussion_count,
      createdAt: problem.created_at
    }));

    res.json({
      problems: transformedProblems,
      pagination: {
        current: parseInt(page),
        total: Math.ceil((count || problems.length) / parseInt(limit)),
        count: problems.length,
        totalProblems: count || problems.length
      }
    });

  } catch (error) {
    console.error('Get problems error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get problem by slug
router.get('/:slug', async (req, res) => {
  try {
    // Try JSON file first
    const jsonProblems = await loadProblemsFromJSON();
    const jsonProblem = jsonProblems.find(p => p.id === req.params.slug);
    
    if (jsonProblem) {
      console.log(`Serving problem ${req.params.slug} from JSON file`);
      return res.json({ 
        problem: {
          id: jsonProblem.id,
          title: jsonProblem.title,
          difficulty: jsonProblem.difficulty,
          description: jsonProblem.description_professional,
          examples: jsonProblem.examples,
          constraints: jsonProblem.constraints,
          startingCode: jsonProblem.startingCode,
          testCases: jsonProblem.testCases,
          category: jsonProblem.category,
          tags: jsonProblem.tags
        }
      });
    }

    // Fallback to database
    const { data: problem, error } = await supabase
      .from('problems')
      .select('*')
      .eq('slug', req.params.slug)
      .eq('is_active', true)
      .single();

    if (error || !problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    // Transform the data
    const transformedProblem = {
      _id: problem.id,
      slug: problem.slug,
      content: {
        professional: {
          title: problem.professional_title,
          description: problem.professional_description,
          hints: problem.professional_hints,
          constraints: problem.professional_constraints
        },
        humorous: {
          title: problem.humorous_title,
          description: problem.humorous_description,
          hints: problem.humorous_hints,
          constraints: problem.humorous_constraints
        },
        genz: {
          title: problem.genz_title,
          description: problem.genz_description,
          hints: problem.genz_hints,
          constraints: problem.genz_constraints
        }
      },
      difficulty: problem.difficulty,
      tags: problem.tags,
      companies: problem.companies,
      testCases: problem.test_cases,
      codeTemplates: problem.code_templates,
      stats: {
        totalSubmissions: problem.total_submissions,
        acceptedSubmissions: problem.accepted_submissions,
        acceptanceRate: problem.acceptance_rate,
        likes: problem.likes,
        dislikes: problem.dislikes
      },
      isPremium: problem.is_premium,
      discussionCount: problem.discussion_count,
      createdAt: problem.created_at
    };

    res.json({ problem: transformedProblem });

  } catch (error) {
    console.error('Get problem error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all available tags
router.get('/meta/tags', async (req, res) => {
  try {
    const { data: problems, error } = await supabase
      .from('problems')
      .select('tags')
      .eq('is_active', true);

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Database error' });
    }

    // Extract unique tags
    const allTags = new Set();
    problems.forEach(problem => {
      if (problem.tags && Array.isArray(problem.tags)) {
        problem.tags.forEach(tag => allTags.add(tag));
      }
    });

    res.json({ tags: Array.from(allTags).sort() });
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all available companies
router.get('/meta/companies', async (req, res) => {
  try {
    const { data: problems, error } = await supabase
      .from('problems')
      .select('companies')
      .eq('is_active', true);

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Database error' });
    }

    // Extract unique companies
    const allCompanies = new Set();
    problems.forEach(problem => {
      if (problem.companies && Array.isArray(problem.companies)) {
        problem.companies.forEach(company => allCompanies.add(company));
      }
    });

    res.json({ companies: Array.from(allCompanies).sort() });
  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;