'use client'

import React, { useState } from 'react'
import { useVibe } from '../hooks/useVibe'
import { User, Mail, Lock, Zap } from 'lucide-react'

interface QuickLoginProps {
  onLogin: (user: any) => void
}

export default function QuickLogin({ onLogin }: QuickLoginProps) {
  const { vibe } = useVibe()
  const [username, setUsername] = useState('')
  const [isLogging, setIsLogging] = useState(false)

  const getVibeContent = () => {
    switch (vibe) {
      case 'genz':
        return {
          title: '✨ Enter Your Main Character Era',
          subtitle: 'Sign in to start serving coding excellence bestie!',
          button: 'Start My Glow Up! 💅',
          placeholder: 'Your iconic username...'
        }
      case 'humorous':
        return {
          title: '🚀 Welcome to the Coding Comedy Club!',
          subtitle: 'Ready to debug your way to greatness?',
          button: 'Let\'s Code! 🎪',
          placeholder: 'Your coding superhero name...'
        }
      default:
        return {
          title: '🏆 Welcome to FeetCode',
          subtitle: 'Track your progress and master coding challenges',
          button: 'Start Coding',
          placeholder: 'Enter username...'
        }
    }
  }

  const content = getVibeContent()

  const handleQuickLogin = async () => {
    if (!username.trim()) return

    setIsLogging(true)
    
    // Simulate login with demo user
    const demoUser = {
      id: 'demo123',
      username: username.trim(),
      email: `${username.trim()}@feetcode.com`,
      created_at: new Date().toISOString()
    }

    // Store demo token and user data
    localStorage.setItem('feetcode_token', 'demo_token_123')
    localStorage.setItem('feetcode_user_id', 'demo123')
    localStorage.setItem('feetcode_user', JSON.stringify(demoUser))

    setTimeout(() => {
      onLogin(demoUser)
      setIsLogging(false)
    }, 1000)
  }

  const handleDemoLogin = () => {
    setUsername('demo_user')
    setTimeout(handleQuickLogin, 100)
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {content.title}
            </h1>
            <p className="text-muted-foreground">
              {content.subtitle}
            </p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={content.placeholder}
                className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                onKeyPress={(e) => e.key === 'Enter' && handleQuickLogin()}
              />
            </div>

            <button
              onClick={handleQuickLogin}
              disabled={!username.trim() || isLogging}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLogging ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                content.button
              )}
            </button>

            <div className="text-sm text-muted-foreground">
              or
            </div>

            <button
              onClick={handleDemoLogin}
              className="w-full bg-muted text-muted-foreground py-2 rounded-lg font-medium hover:bg-muted/80 transition-colors"
            >
              Quick Demo (demo_user)
            </button>
          </div>

          <div className="mt-6 text-xs text-muted-foreground">
            {vibe === 'genz' ? 'No cap, this is about to be iconic! ✨' :
             vibe === 'humorous' ? 'Warning: May cause extreme confidence in coding abilities! 😄' :
             'Start your coding journey today'}
          </div>
        </div>
      </div>
    </div>
  )
}