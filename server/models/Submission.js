const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  problem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  
  // Code and language
  code: {
    type: String,
    required: true,
    maxlength: 100000 // 100KB limit
  },
  language: {
    type: String,
    required: true,
    enum: ['javascript', 'python', 'java', 'cpp', 'go', 'rust']
  },
  
  // Execution results
  status: {
    type: String,
    required: true,
    enum: [
      'accepted',
      'wrong-answer',
      'time-limit-exceeded',
      'memory-limit-exceeded',
      'runtime-error',
      'compile-error',
      'internal-error'
    ]
  },
  
  // Detailed results
  testResults: [{
    testCaseIndex: { type: Number, required: true },
    passed: { type: Boolean, required: true },
    actualOutput: { type: String },
    expectedOutput: { type: String },
    executionTime: { type: Number }, // in milliseconds
    memoryUsed: { type: Number }, // in bytes
    error: { type: String }
  }],
  
  // Performance metrics
  totalExecutionTime: { type: Number }, // in milliseconds
  totalMemoryUsed: { type: Number }, // in bytes
  
  // Statistics
  passedTestCases: { type: Number, default: 0 },
  totalTestCases: { type: Number, default: 0 },
  
  // Metadata
  submittedAt: { type: Date, default: Date.now },
  ipAddress: { type: String },
  userAgent: { type: String },
  
  // Social features
  isPublic: { type: Boolean, default: false },
  likes: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  
  // Notes from user
  notes: { type: String, maxlength: 1000 }
  
}, {
  timestamps: true
});

// Indexes for performance
submissionSchema.index({ user: 1, problem: 1 });
submissionSchema.index({ problem: 1, status: 1 });
submissionSchema.index({ user: 1, submittedAt: -1 });
submissionSchema.index({ status: 1, submittedAt: -1 });
submissionSchema.index({ isPublic: 1, likes: -1 });

// Virtual for success rate
submissionSchema.virtual('successRate').get(function() {
  if (this.totalTestCases === 0) return 0;
  return Math.round((this.passedTestCases / this.totalTestCases) * 100);
});

// Method to determine if submission is accepted
submissionSchema.methods.isAccepted = function() {
  return this.status === 'accepted';
};

// Method to get public submission data
submissionSchema.methods.toPublicJSON = function() {
  const submission = this.toObject();
  
  if (!this.isPublic) {
    delete submission.code;
    delete submission.testResults;
    delete submission.ipAddress;
    delete submission.userAgent;
  }
  
  return submission;
};

// Static method to get user's best submission for a problem
submissionSchema.statics.getBestSubmission = function(userId, problemId) {
  return this.findOne({
    user: userId,
    problem: problemId,
    status: 'accepted'
  })
  .sort({ totalExecutionTime: 1, submittedAt: -1 }) // Fastest first, then most recent
  .populate('problem', 'slug content difficulty');
};

// Static method to get recent submissions for a user
submissionSchema.statics.getRecentSubmissions = function(userId, limit = 10) {
  return this.find({ user: userId })
    .sort({ submittedAt: -1 })
    .limit(limit)
    .populate('problem', 'slug content difficulty')
    .select('-code -testResults -ipAddress -userAgent');
};

// Static method to get leaderboard for a problem
submissionSchema.statics.getProblemLeaderboard = function(problemId, limit = 10) {
  return this.aggregate([
    {
      $match: {
        problem: new mongoose.Types.ObjectId(problemId),
        status: 'accepted'
      }
    },
    {
      $sort: {
        totalExecutionTime: 1,
        submittedAt: 1 // Earlier submission wins in case of tie
      }
    },
    {
      $group: {
        _id: '$user',
        bestSubmission: { $first: '$$ROOT' }
      }
    },
    {
      $replaceRoot: { newRoot: '$bestSubmission' }
    },
    {
      $limit: limit
    },
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'userInfo'
      }
    },
    {
      $unwind: '$userInfo'
    },
    {
      $project: {
        user: '$userInfo.username',
        language: 1,
        totalExecutionTime: 1,
        totalMemoryUsed: 1,
        submittedAt: 1,
        code: { $cond: { if: '$isPublic', then: '$code', else: null } }
      }
    }
  ]);
};

// Pre-save middleware to calculate statistics
submissionSchema.pre('save', function(next) {
  if (this.testResults && this.testResults.length > 0) {
    this.totalTestCases = this.testResults.length;
    this.passedTestCases = this.testResults.filter(result => result.passed).length;
    
    // Calculate total execution time and memory
    this.totalExecutionTime = this.testResults.reduce((sum, result) => 
      sum + (result.executionTime || 0), 0);
    this.totalMemoryUsed = Math.max(...this.testResults.map(result => 
      result.memoryUsed || 0));
  }
  
  next();
});

module.exports = mongoose.model('Submission', submissionSchema);