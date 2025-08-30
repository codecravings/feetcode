const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  preferredVibe: {
    type: String,
    enum: ['professional', 'humorous', 'genz'],
    default: 'professional'
  },
  stats: {
    problemsSolved: { type: Number, default: 0 },
    totalSubmissions: { type: Number, default: 0 },
    acceptedSubmissions: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    maxStreak: { type: Number, default: 0 },
    lastSolved: { type: Date }
  },
  solvedProblems: [{
    problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem' },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'] },
    solvedAt: { type: Date, default: Date.now },
    bestTime: { type: Number }, // in milliseconds
    language: { type: String }
  }],
  badges: [{
    name: String,
    earnedAt: { type: Date, default: Date.now },
    description: String
  }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isVerified: { type: Boolean, default: false },
  isPremium: { type: Boolean, default: false },
  joinedAt: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Update stats method
userSchema.methods.updateStats = function(problemDifficulty, timeTaken) {
  this.stats.problemsSolved += 1;
  this.stats.acceptedSubmissions += 1;
  this.stats.lastSolved = new Date();
  
  // Update streak
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (this.stats.lastSolved && this.stats.lastSolved.toDateString() === yesterday.toDateString()) {
    this.stats.currentStreak += 1;
  } else if (!this.stats.lastSolved || this.stats.lastSolved.toDateString() !== today.toDateString()) {
    this.stats.currentStreak = 1;
  }
  
  this.stats.maxStreak = Math.max(this.stats.maxStreak, this.stats.currentStreak);
  this.lastActive = new Date();
};

// Get user profile without sensitive data
userSchema.methods.toPublicJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.email;
  return user;
};

module.exports = mongoose.model('User', userSchema);