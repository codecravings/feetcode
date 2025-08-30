const mongoose = require('mongoose');

const discussionSchema = new mongoose.Schema({
  problem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Discussion content
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    maxlength: 10000
  },
  
  // Discussion type
  type: {
    type: String,
    enum: ['question', 'solution', 'hint', 'general'],
    default: 'general'
  },
  
  // Tags for categorizing discussions
  tags: [{
    type: String,
    enum: [
      'algorithm', 'optimization', 'explanation', 'bug', 'alternative-solution',
      'time-complexity', 'space-complexity', 'edge-case', 'clarification'
    ]
  }],
  
  // Code snippet (optional)
  codeSnippet: {
    code: { type: String, maxlength: 5000 },
    language: {
      type: String,
      enum: ['javascript', 'python', 'java', 'cpp', 'go', 'rust']
    }
  },
  
  // Social metrics
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  
  // User interactions
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  dislikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  // Replies
  replies: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: 5000
    },
    codeSnippet: {
      code: { type: String, maxlength: 2000 },
      language: {
        type: String,
        enum: ['javascript', 'python', 'java', 'cpp', 'go', 'rust']
      }
    },
    likes: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now },
    isAcceptedAnswer: { type: Boolean, default: false }
  }],
  
  // Status
  isLocked: { type: Boolean, default: false },
  isPinned: { type: Boolean, default: false },
  isSolved: { type: Boolean, default: false },
  
  // Moderation
  isReported: { type: Boolean, default: false },
  reportCount: { type: Number, default: 0 },
  
  // Last activity for sorting
  lastActivityAt: { type: Date, default: Date.now }
  
}, {
  timestamps: true
});

// Indexes for performance
discussionSchema.index({ problem: 1, createdAt: -1 });
discussionSchema.index({ problem: 1, type: 1 });
discussionSchema.index({ problem: 1, isPinned: -1, lastActivityAt: -1 });
discussionSchema.index({ author: 1, createdAt: -1 });
discussionSchema.index({ likes: -1, createdAt: -1 });

// Virtual for reply count
discussionSchema.virtual('replyCount').get(function() {
  return this.replies ? this.replies.length : 0;
});

// Virtual for score (likes - dislikes)
discussionSchema.virtual('score').get(function() {
  return this.likes - this.dislikes;
});

// Method to increment views
discussionSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Method to toggle like
discussionSchema.methods.toggleLike = function(userId) {
  const userIdStr = userId.toString();
  const likedIndex = this.likedBy.findIndex(id => id.toString() === userIdStr);
  const dislikedIndex = this.dislikedBy.findIndex(id => id.toString() === userIdStr);
  
  // Remove from dislikes if present
  if (dislikedIndex > -1) {
    this.dislikedBy.splice(dislikedIndex, 1);
    this.dislikes = Math.max(0, this.dislikes - 1);
  }
  
  // Toggle like
  if (likedIndex > -1) {
    // Remove like
    this.likedBy.splice(likedIndex, 1);
    this.likes = Math.max(0, this.likes - 1);
    return 'unliked';
  } else {
    // Add like
    this.likedBy.push(userId);
    this.likes += 1;
    return 'liked';
  }
};

// Method to toggle dislike
discussionSchema.methods.toggleDislike = function(userId) {
  const userIdStr = userId.toString();
  const likedIndex = this.likedBy.findIndex(id => id.toString() === userIdStr);
  const dislikedIndex = this.dislikedBy.findIndex(id => id.toString() === userIdStr);
  
  // Remove from likes if present
  if (likedIndex > -1) {
    this.likedBy.splice(likedIndex, 1);
    this.likes = Math.max(0, this.likes - 1);
  }
  
  // Toggle dislike
  if (dislikedIndex > -1) {
    // Remove dislike
    this.dislikedBy.splice(dislikedIndex, 1);
    this.dislikes = Math.max(0, this.dislikes - 1);
    return 'undisliked';
  } else {
    // Add dislike
    this.dislikedBy.push(userId);
    this.dislikes += 1;
    return 'disliked';
  }
};

// Method to add reply
discussionSchema.methods.addReply = function(authorId, content, codeSnippet = null) {
  const reply = {
    author: authorId,
    content: content,
    codeSnippet: codeSnippet
  };
  
  this.replies.push(reply);
  this.lastActivityAt = new Date();
  
  return this.save();
};

// Method to get discussions with user interaction status
discussionSchema.statics.getDiscussionsWithUserStatus = function(problemId, userId, options = {}) {
  const {
    type,
    sortBy = 'lastActivityAt',
    sortOrder = -1,
    page = 1,
    limit = 10
  } = options;
  
  const query = { problem: problemId };
  if (type) query.type = type;
  
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder;
  
  return this.aggregate([
    { $match: query },
    {
      $lookup: {
        from: 'users',
        localField: 'author',
        foreignField: '_id',
        as: 'authorInfo'
      }
    },
    {
      $unwind: '$authorInfo'
    },
    {
      $addFields: {
        isLikedByUser: userId ? { $in: [new mongoose.Types.ObjectId(userId), '$likedBy'] } : false,
        isDislikedByUser: userId ? { $in: [new mongoose.Types.ObjectId(userId), '$dislikedBy'] } : false,
        replyCount: { $size: '$replies' },
        score: { $subtract: ['$likes', '$dislikes'] }
      }
    },
    {
      $project: {
        likedBy: 0,
        dislikedBy: 0,
        'authorInfo.password': 0,
        'authorInfo.email': 0
      }
    },
    { $sort: sortOptions },
    { $skip: (page - 1) * limit },
    { $limit: limit }
  ]);
};

// Pre-save middleware
discussionSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('replies')) {
    this.lastActivityAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Discussion', discussionSchema);