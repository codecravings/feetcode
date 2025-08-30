'use client'

import React, { useState, useEffect } from 'react'
import { useVibe } from '../../hooks/useVibe'
import { Heart, X, RotateCcw, Code, Trophy } from 'lucide-react'

interface CodeSnippet {
  id: string
  code: string
  language: string
  swipeLeft: {
    professional: string
    humorous: string
    genz: string
  }
  swipeRight: {
    professional: string
    humorous: string
    genz: string
  }
}

const codeSnippets: CodeSnippet[] = [
  {
    id: '1',
    code: `if (user.isLoggedIn) {
  if (user.hasPermission) {
    if (user.isActive) {
      if (data.isValid) {
        doSomething();
      }
    }
  }
}`,
    language: 'javascript',
    swipeLeft: {
      professional: "Deeply nested conditions reduce code readability",
      humorous: "Nested deeper than my trust issues 💀",
      genz: "This code said 'sike' and chose violence fr fr 🤡"
    },
    swipeRight: {
      professional: "Could be refactored with early returns for clarity",
      humorous: "At least it's honest about its complexity",
      genz: "Messy but we stan the effort bestie ✨"
    }
  },
  {
    id: '2',
    code: `const result = data?.filter(x => x.active)?.map(x => x.name)?.join(', ') || 'No data'`,
    language: 'javascript',
    swipeLeft: {
      professional: "Chain could be broken down for better debugging",
      humorous: "One-liner trying too hard to be fancy",
      genz: "This is giving 'I learned JavaScript yesterday' energy 💅"
    },
    swipeRight: {
      professional: "Efficient use of optional chaining and array methods",
      humorous: "Clean one-liner that gets the job done ✨",
      genz: "Short, sweet, and hits different - that's my type 💯"
    }
  },
  {
    id: '3',
    code: `function calculateTotalWithTaxAndDiscountAndShippingAndHandlingFeesAndOtherCharges(price, tax, discount, shipping, handling, other) {
  return price + tax - discount + shipping + handling + other;
}`,
    language: 'javascript',
    swipeLeft: {
      professional: "Function name violates naming conventions",
      humorous: "Someone really said 'let me write War and Peace in JavaScript' 📚",
      genz: "Bro really named this function like a light novel title 💀"
    },
    swipeRight: {
      professional: "At least the logic is straightforward",
      humorous: "Verbose but honest about what it does",
      genz: "The name is sending me but the math checks out 🧮"
    }
  },
  {
    id: '4',
    code: `let a = 1;
let b = a + 1;
let c = b + 1;
let d = c + 1;
let e = d + 1;
return e;`,
    language: 'javascript',
    swipeLeft: {
      professional: "Could be simplified to a single expression",
      humorous: "This gives me 'learning to count' vibes 🤯",
      genz: "Bestie really took the scenic route to get to 5 💀"
    },
    swipeRight: {
      professional: "Each step is clear and debuggable",
      humorous: "Baby steps approach - we've all been there",
      genz: "Not the most efficient but the vibes are immaculate ✨"
    }
  },
  {
    id: '5',
    code: `// TODO: Fix this later (written 3 years ago)
function mysteryCubes() {
  const x = Math.random() * 42;
  return x > 21 ? 'yes' : 'no';
}`,
    language: 'javascript',
    swipeLeft: {
      professional: "Legacy code requires proper documentation and refactoring",
      humorous: "3-year-old TODO and mysterious logic? Iconic 💀",
      genz: "The TODO from 2021 is sending me to another dimension 🚀"
    },
    swipeRight: {
      professional: "At least it has a TODO comment for future work",
      humorous: "Mystery function with commitment issues - relatable",
      genz: "Chaotic energy but sometimes chaos sparks joy ✨"
    }
  }
]

export default function CodeTinder() {
  const { vibe } = useVibe()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [stats, setStats] = useState({ likes: 0, dislikes: 0 })
  const [isAnimating, setIsAnimating] = useState(false)

  const currentSnippet = codeSnippets[currentIndex]

  const handleSwipe = (direction: 'left' | 'right') => {
    if (isAnimating) return

    setIsAnimating(true)
    setSwipeDirection(direction)
    setShowResult(true)

    // Update stats
    setStats(prev => ({
      ...prev,
      [direction === 'left' ? 'dislikes' : 'likes']: prev[direction === 'left' ? 'dislikes' : 'likes'] + 1
    }))

    // Show result for 2 seconds then move to next
    setTimeout(() => {
      if (currentIndex < codeSnippets.length - 1) {
        setCurrentIndex(prev => prev + 1)
        setSwipeDirection(null)
        setShowResult(false)
        setIsAnimating(false)
      } else {
        // Game over - could reset or show final stats
        setTimeout(() => {
          setCurrentIndex(0)
          setStats({ likes: 0, dislikes: 0 })
          setSwipeDirection(null)
          setShowResult(false)
          setIsAnimating(false)
        }, 1000)
      }
    }, 2000)
  }

  const getResultMessage = () => {
    if (!showResult || !swipeDirection) return ''
    
    const messages = swipeDirection === 'left' 
      ? currentSnippet.swipeLeft 
      : currentSnippet.swipeRight
    
    return messages[vibe as keyof typeof messages]
  }

  const getVibeContent = () => {
    const content = {
      professional: {
        title: "Code Review Tinder",
        subtitle: "Swipe through code snippets and provide feedback",
        leftAction: "Needs Improvement",
        rightAction: "Approve"
      },
      humorous: {
        title: "Code Tinder 💕",
        subtitle: "Find your perfect code match (or roast some bugs)",
        leftAction: "Swipe Left (Nope)",
        rightAction: "Swipe Right (Cute)"
      },
      genz: {
        title: "Code Dating App bestie",
        subtitle: "These code snippets are looking for love (and reviews)",
        leftAction: "Not the vibe",
        rightAction: "It's giving"
      }
    }
    return content[vibe as keyof typeof content]
  }

  const currentContent = getVibeContent()

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">{currentContent.title}</h2>
        <p className="text-muted-foreground">{currentContent.subtitle}</p>
        
        {/* Stats */}
        <div className="flex justify-center space-x-4 mt-4">
          <div className="flex items-center space-x-1 text-destructive">
            <X className="h-4 w-4" />
            <span className="font-semibold">{stats.dislikes}</span>
          </div>
          <div className="flex items-center space-x-1 text-success">
            <Heart className="h-4 w-4" />
            <span className="font-semibold">{stats.likes}</span>
          </div>
        </div>
      </div>

      {/* Card */}
      <div className="relative">
        <div className={`card p-6 transition-all duration-500 ${
          swipeDirection === 'left' ? 'transform -rotate-12 -translate-x-96 opacity-0' :
          swipeDirection === 'right' ? 'transform rotate-12 translate-x-96 opacity-0' :
          'transform rotate-0 translate-x-0 opacity-100'
        }`}>
          
          {/* Language Badge */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Code className="h-4 w-4" />
              <span className="text-sm font-medium capitalize">{currentSnippet?.language}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {currentIndex + 1} / {codeSnippets.length}
            </div>
          </div>

          {/* Code Block */}
          <div className="bg-muted/30 p-4 rounded-lg mb-6 font-mono text-sm overflow-x-auto">
            <pre className="whitespace-pre-wrap">{currentSnippet?.code}</pre>
          </div>

          {/* Result Message */}
          {showResult && (
            <div className={`p-4 rounded-lg mb-4 text-center font-medium ${
              swipeDirection === 'left' ? 'bg-destructive/10 text-destructive' : 'bg-success/10 text-success'
            }`}>
              {getResultMessage()}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={() => handleSwipe('left')}
              disabled={isAnimating}
              className="flex-1 btn-secondary flex items-center justify-center space-x-2 text-destructive border-destructive/20 hover:bg-destructive/10"
            >
              <X className="h-5 w-5" />
              <span>{currentContent.leftAction}</span>
            </button>
            
            <button
              onClick={() => handleSwipe('right')}
              disabled={isAnimating}
              className="flex-1 btn-secondary flex items-center justify-center space-x-2 text-success border-success/20 hover:bg-success/10"
            >
              <Heart className="h-5 w-5" />
              <span>{currentContent.rightAction}</span>
            </button>
          </div>
        </div>

        {/* Next Card Preview */}
        {currentIndex < codeSnippets.length - 1 && (
          <div className="absolute inset-0 -z-10 transform scale-95 opacity-50">
            <div className="card p-6 h-full bg-muted/50">
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <Code className="h-8 w-8" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reset Button */}
      <div className="text-center mt-6">
        <button
          onClick={() => {
            setCurrentIndex(0)
            setStats({ likes: 0, dislikes: 0 })
            setSwipeDirection(null)
            setShowResult(false)
            setIsAnimating(false)
          }}
          className="btn-secondary flex items-center space-x-2 mx-auto"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Start Over</span>
        </button>
      </div>
    </div>
  )
}