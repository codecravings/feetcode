// Centralized vibe content system for FeetCode
// This handles all the customizable language/tone variations

interface VibeContent {
  professional: any
  humorous: any
  genz: any
}

interface MessageContent {
  title?: string
  message: string
  action?: string
}

export const vibeMessages = {
  // Authentication Messages
  auth: {
    welcome: {
      professional: { message: 'Welcome to FeetCode', action: 'Start Coding' },
      humorous: { message: 'Welcome to the Code Comedy Club!', action: 'Join the Fun' },
      genz: { message: 'Yo, welcome to the coding fam!', action: "Let's Get It" }
    },
    loginSuccess: {
      professional: { message: 'Login successful' },
      humorous: { message: 'You\'re back! The code missed you!' },
      genz: { message: 'We\'re back in business, no cap!' }
    },
    loginFailed: {
      professional: { message: 'Invalid credentials' },
      humorous: { message: 'Wrong password! Even your computer is disappointed.' },
      genz: { message: 'That ain\'t it chief, try again fr' }
    }
  },

  // Code Execution Messages
  execution: {
    running: {
      professional: { message: 'Executing code...' },
      humorous: { message: 'Teaching your code some manners... 🎭' },
      genz: { message: 'Code is cooking, please hold...' }
    },
    success: {
      professional: { message: 'All test cases passed successfully!' },
      humorous: { message: 'Your code is smoother than my pickup lines! 🎉' },
      genz: { message: 'That code absolutely slaps! No cap! 🔥' }
    },
    partialSuccess: {
      professional: { message: 'Some test cases failed. Please review your solution.' },
      humorous: { message: 'Close, but no cigar! Your code is having commitment issues.' },
      genz: { message: 'Almost there bestie, but this ain\'t it yet' }
    },
    failure: {
      professional: { message: 'Code execution failed. Please check your implementation.' },
      humorous: { message: 'Houston, we have a problem... and it\'s not rocket science! 🚀' },
      genz: { message: 'Code said "nah fam" and crashed 💀' }
    },
    timeout: {
      professional: { message: 'Time limit exceeded. Optimize your algorithm.' },
      humorous: { message: 'Your code is slower than my WiFi! Speed it up!' },
      genz: { message: 'Code taking forever... this ain\'t loading screen simulator' }
    },
    error: {
      professional: { message: 'Runtime error occurred during execution.' },
      humorous: { message: 'Your code threw a tantrum and stormed off! 😤' },
      genz: { message: 'Error said "I\'m out" and left the chat' }
    }
  },

  // Problem Difficulty Labels
  difficulty: {
    easy: {
      professional: { message: 'Easy', color: 'text-green-600' },
      humorous: { message: 'Piece of Cake 🍰', color: 'text-green-600' },
      genz: { message: 'Ez Clap', color: 'text-green-600' }
    },
    medium: {
      professional: { message: 'Medium', color: 'text-yellow-600' },
      humorous: { message: 'Spicy Challenge 🌶️', color: 'text-yellow-600' },
      genz: { message: 'Mid Difficulty', color: 'text-yellow-600' }
    },
    hard: {
      professional: { message: 'Hard', color: 'text-red-600' },
      humorous: { message: 'Brain Buster 🤯', color: 'text-red-600' },
      genz: { message: 'Absolutely Brutal', color: 'text-red-600' }
    }
  },

  // Problem Status Messages
  problemStatus: {
    solved: {
      professional: { message: 'Solved', icon: '✓' },
      humorous: { message: 'Conquered!', icon: '🏆' },
      genz: { message: 'Cleared', icon: '💯' }
    },
    attempted: {
      professional: { message: 'Attempted', icon: '○' },
      humorous: { message: 'Tried (bless your heart)', icon: '😅' },
      genz: { message: 'Had a Go', icon: '👀' }
    },
    locked: {
      professional: { message: 'Premium Only', icon: '🔒' },
      humorous: { message: 'Pay to Play!', icon: '💰' },
      genz: { message: 'Members Only', icon: '💎' }
    }
  },

  // Achievement Messages
  achievements: {
    firstSolve: {
      professional: { title: 'First Solution', message: 'Congratulations on solving your first problem!' },
      humorous: { title: 'Code Newbie', message: 'You popped your coding cherry! 🍒' },
      genz: { title: 'First W', message: 'Got your first dub! We love to see it! 🎉' }
    },
    streak: {
      professional: { title: 'Problem Solving Streak', message: 'You\'ve solved problems for {days} consecutive days!' },
      humorous: { title: 'Code Addiction', message: '{days} days straight? Someone needs an intervention! 😂' },
      genz: { title: 'Streak Gang', message: '{days} days straight? You\'re absolutely cracked! 💪' }
    },
    speedDemon: {
      professional: { title: 'Efficient Solution', message: 'Your solution was in the top 10% for speed!' },
      humorous: { title: 'Speed Racer', message: 'Your code is faster than my excuses! ⚡' },
      genz: { title: 'Speed Run', message: 'That was absolutely zooming! Built different! 🏃‍♀️' }
    }
  },

  // Navigation and UI
  navigation: {
    problems: {
      professional: { message: 'Problems' },
      humorous: { message: 'Brain Teasers' },
      genz: { message: 'Challenges' }
    },
    leaderboard: {
      professional: { message: 'Leaderboard' },
      humorous: { message: 'Wall of Fame' },
      genz: { message: 'Top Players' }
    },
    profile: {
      professional: { message: 'Profile' },
      humorous: { message: 'Your Stats' },
      genz: { message: 'Your Vibe' }
    },
    discuss: {
      professional: { message: 'Discussions' },
      humorous: { message: 'Code Therapy' },
      genz: { message: 'The Chat' }
    }
  },

  // Error Messages
  errors: {
    networkError: {
      professional: { message: 'Network error occurred. Please try again.' },
      humorous: { message: 'The internet is having a moment. Please try again!' },
      genz: { message: 'WiFi said no. Try again bestie.' }
    },
    notFound: {
      professional: { message: 'The requested resource was not found.' },
      humorous: { message: 'This page is playing hide and seek... and winning!' },
      genz: { message: 'This page said "bye" and left us hanging 👻' }
    },
    unauthorized: {
      professional: { message: 'Authentication required to access this feature.' },
      humorous: { message: 'Whoa there! You need a ticket to this show!' },
      genz: { message: 'You\'re not on the list. Sign in first!' }
    }
  },

  // Submission Feedback
  submission: {
    compiling: {
      professional: { message: 'Compiling code...' },
      humorous: { message: 'Teaching the computer your language... 🤖' },
      genz: { message: 'Code getting ready to perform...' }
    },
    judging: {
      professional: { message: 'Running test cases...' },
      humorous: { message: 'Putting your code on trial! ⚖️' },
      genz: { message: 'Testing if it hits different...' }
    },
    accepted: {
      professional: { message: 'Accepted! Well done.' },
      humorous: { message: 'Accepted! You\'re officially a coding rockstar! 🌟' },
      genz: { message: 'ACCEPTED! That\'s a whole vibe! 🔥' }
    }
  },

  // Social Features
  social: {
    following: {
      professional: { message: 'Following' },
      humorous: { message: 'Stalking (legally)' },
      genz: { message: 'Following' }
    },
    followers: {
      professional: { message: 'Followers' },
      humorous: { message: 'Your Fans' },
      genz: { message: 'Your Crew' }
    },
    likes: {
      professional: { message: 'Helpful' },
      humorous: { message: 'Comedy Gold' },
      genz: { message: 'This Hits' }
    }
  }
}

// Helper function to get content for current vibe
export const getVibeContent = (category: string, key: string, vibe: string = 'professional') => {
  try {
    const content = vibeMessages[category as keyof typeof vibeMessages]
    if (!content) return { message: 'Content not found' }
    
    const specificContent = content[key as keyof typeof content]
    if (!specificContent) return { message: 'Content not found' }
    
    const vibeSpecific = specificContent[vibe as keyof typeof specificContent]
    return vibeSpecific || (specificContent as any).professional || { message: 'Content not found' }
  } catch (error) {
    return { message: 'Content not found' }
  }
}

// Helper function to interpolate variables in messages
export const interpolateMessage = (content: any, variables: Record<string, any> = {}) => {
  if (typeof content.message !== 'string') return content
  
  let message = content.message
  Object.keys(variables).forEach(key => {
    message = message.replace(new RegExp(`{${key}}`, 'g'), variables[key])
  })
  
  return { ...content, message }
}

// Problem-specific vibe content generator
export const generateProblemContent = (baseProblem: any, vibe: string = 'professional') => {
  const templates = {
    professional: {
      titlePrefix: '',
      descriptionStyle: 'formal',
      hintStyle: 'technical',
      constraintStyle: 'precise'
    },
    humorous: {
      titlePrefix: '',
      descriptionStyle: 'funny',
      hintStyle: 'witty',
      constraintStyle: 'playful'
    },
    genz: {
      titlePrefix: '',
      descriptionStyle: 'casual',
      hintStyle: 'friendly',
      constraintStyle: 'relatable'
    }
  }

  // This would be used to dynamically generate problem content
  // based on the vibe and base problem data
  return baseProblem
}

// Export default vibes list
export const VIBES = ['professional', 'humorous', 'genz'] as const
export type Vibe = typeof VIBES[number]

export default vibeMessages