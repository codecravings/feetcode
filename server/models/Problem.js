const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  expectedOutput: { type: String, required: true },
  isPublic: { type: Boolean, default: true }, // Hidden test cases for validation
  explanation: { type: String }
});

const vibeContentSchema = new mongoose.Schema({
  professional: {
    title: { type: String, required: true },
    description: { type: String, required: true },
    hints: [{ type: String }],
    constraints: [{ type: String }]
  },
  humorous: {
    title: { type: String, required: true },
    description: { type: String, required: true },
    hints: [{ type: String }],
    constraints: [{ type: String }]
  },
  genz: {
    title: { type: String, required: true },
    description: { type: String, required: true },
    hints: [{ type: String }],
    constraints: [{ type: String }]
  }
});

const problemSchema = new mongoose.Schema({
  // Core problem data
  slug: { 
    type: String, 
    required: true, 
    unique: true,
    match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens']
  },
  
  // Multi-vibe content
  content: { type: vibeContentSchema, required: true },
  
  // Problem metadata
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  
  tags: [{
    type: String,
    enum: [
      'array', 'string', 'hash-table', 'dynamic-programming', 'math', 'sorting',
      'greedy', 'depth-first-search', 'binary-search', 'breadth-first-search',
      'tree', 'matrix', 'two-pointers', 'bit-manipulation', 'heap', 'stack',
      'queue', 'graph', 'design', 'sliding-window', 'backtracking', 'union-find',
      'linked-list', 'binary-tree', 'recursion', 'divide-and-conquer', 'trie'
    ]
  }],
  
  // Companies that ask this question
  companies: [{
    type: String,
    enum: [
      'google', 'amazon', 'microsoft', 'apple', 'facebook', 'netflix', 'uber',
      'airbnb', 'twitter', 'linkedin', 'adobe', 'salesforce', 'yahoo', 'dropbox',
      'spotify', 'stripe', 'coinbase', 'robinhood', 'doordash', 'lyft'
    ]
  }],
  
  // Test cases
  testCases: [testCaseSchema],
  
  // Code templates for different languages
  codeTemplates: {
    javascript: { type: String, default: '' },
    python: { type: String, default: '' },
    java: { type: String, default: '' },
    cpp: { type: String, default: '' },
    go: { type: String, default: '' },
    rust: { type: String, default: '' }
  },
  
  // Problem statistics
  stats: {
    totalSubmissions: { type: Number, default: 0 },
    acceptedSubmissions: { type: Number, default: 0 },
    acceptanceRate: { type: Number, default: 0 },
    averageTimeTaken: { type: Number, default: 0 }, // in milliseconds
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 }
  },
  
  // Premium features
  isPremium: { type: Boolean, default: false },
  
  // Discussion
  discussionCount: { type: Number, default: 0 },
  
  // Admin fields
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
}, {
  timestamps: true
});

// Indexes for performance
problemSchema.index({ difficulty: 1 });
problemSchema.index({ tags: 1 });
problemSchema.index({ companies: 1 });
problemSchema.index({ 'stats.acceptanceRate': -1 });
problemSchema.index({ slug: 1 });
problemSchema.index({ isActive: 1 });

// Virtual for acceptance rate calculation
problemSchema.virtual('calculatedAcceptanceRate').get(function() {
  if (this.stats.totalSubmissions === 0) return 0;
  return Math.round((this.stats.acceptedSubmissions / this.stats.totalSubmissions) * 100);
});

// Method to get content for specific vibe
problemSchema.methods.getVibeContent = function(vibe = 'professional') {
  const vibes = ['professional', 'humorous', 'genz'];
  const selectedVibe = vibes.includes(vibe) ? vibe : 'professional';
  return this.content[selectedVibe];
};

// Method to get public test cases only
problemSchema.methods.getPublicTestCases = function() {
  return this.testCases.filter(testCase => testCase.isPublic);
};

// Method to update stats after submission
problemSchema.methods.updateStats = function(isAccepted, timeTaken) {
  this.stats.totalSubmissions += 1;
  if (isAccepted) {
    this.stats.acceptedSubmissions += 1;
  }
  
  this.stats.acceptanceRate = this.calculatedAcceptanceRate;
  
  if (timeTaken) {
    const currentAvg = this.stats.averageTimeTaken;
    const totalAccepted = this.stats.acceptedSubmissions;
    this.stats.averageTimeTaken = Math.round(
      ((currentAvg * (totalAccepted - 1)) + timeTaken) / totalAccepted
    );
  }
};

// Static method to get problems with filters
problemSchema.statics.getFilteredProblems = function(filters = {}) {
  const {
    difficulty,
    tags,
    companies,
    isPremium,
    search,
    sortBy = 'createdAt',
    sortOrder = -1,
    page = 1,
    limit = 20
  } = filters;

  const query = { isActive: true };
  
  if (difficulty) query.difficulty = difficulty;
  if (tags && tags.length > 0) query.tags = { $in: tags };
  if (companies && companies.length > 0) query.companies = { $in: companies };
  if (typeof isPremium === 'boolean') query.isPremium = isPremium;
  
  if (search) {
    query.$or = [
      { 'content.professional.title': { $regex: search, $options: 'i' } },
      { 'content.humorous.title': { $regex: search, $options: 'i' } },
      { 'content.genz.title': { $regex: search, $options: 'i' } },
      { slug: { $regex: search, $options: 'i' } }
    ];
  }

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder;

  return this.find(query)
    .sort(sortOptions)
    .limit(limit * 1)
    .skip((page - 1) * limit);
};

module.exports = mongoose.model('Problem', problemSchema);