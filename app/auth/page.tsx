'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useVibe } from '../../hooks/useVibe'
import { 
  User, 
  Mail, 
  Lock, 
  Zap, 
  Code, 
  Trophy, 
  Flame,
  Star,
  Crown,
  Users,
  UserPlus,
  LogIn,
  Sparkles
} from 'lucide-react'

export default function AuthPage() {
  const { vibe } = useVibe()
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showFeatures, setShowFeatures] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowFeatures(true), 800)
    return () => clearTimeout(timer)
  }, [])

  const getVibeContent = () => {
    switch (vibe) {
      case 'genz':
        return {
          loginTitle: '✨ Welcome Back Bestie!',
          signupTitle: '💅 Ready to Serve Excellence?',
          loginSubtitle: 'Time to continue your iconic coding journey!',
          signupSubtitle: 'Join the main character coding community!',
          loginButton: 'Enter My Era! ✨',
          signupButton: 'Start My Glow Up! 💫',
          guestButton: 'Browse as Guest Bestie 👀',
          switchLogin: 'Already serving looks? Sign in!',
          switchSignup: 'New here bestie? Join the squad!',
          features: [
            '🔥 Streak tracking that hits different',
            '💅 Personality-based vibes (obvs)',
            '🏆 Achievement system for icons',
            '📱 Share your wins on social media',
            '👑 Leaderboards to flex your skills'
          ]
        }
      case 'humorous':
        return {
          loginTitle: '🚀 Welcome Back, Code Warrior!',
          signupTitle: '🎪 Join the Coding Circus!',
          loginSubtitle: 'Ready to debug your way to greatness again?',
          signupSubtitle: 'Where coding meets comedy and bugs meet their doom!',
          loginButton: 'Let\'s Code! 🎯',
          signupButton: 'Join the Fun! 🎊',
          guestButton: 'Sneak Peek Mode 🕵️',
          switchLogin: 'Already a comedy legend? Sign in!',
          switchSignup: 'New to the show? Join us!',
          features: [
            '🔥 Streak tracking (hotter than your laptop)',
            '😄 Funny problem descriptions that actually help',
            '🏆 Achievement system (more addictive than coffee)',
            '📱 Share your wins (humble brag responsibly)',
            '👑 Leaderboards (may cause competitive coding)'
          ]
        }
      default:
        return {
          loginTitle: '🏆 Welcome Back to FeetCode',
          signupTitle: '🚀 Join FeetCode Today',
          loginSubtitle: 'Continue your coding journey and maintain your streak',
          signupSubtitle: 'Start solving problems and building your programming skills',
          loginButton: 'Sign In',
          signupButton: 'Create Account',
          guestButton: 'Continue as Guest',
          switchLogin: 'Already have an account? Sign in',
          switchSignup: 'Need an account? Sign up',
          features: [
            '🔥 Daily streak tracking and rewards',
            '📊 Comprehensive progress analytics',
            '🏆 Achievement and level system',
            '📱 Social sharing capabilities',
            '👑 Global leaderboards and rankings'
          ]
        }
    }
  }

  const content = getVibeContent()

  const handleAuth = async (asGuest = false) => {
    setIsLoading(true)

    if (asGuest) {
      // Guest login
      const guestUser = {
        id: 'guest_' + Date.now(),
        username: 'Guest User',
        email: 'guest@feetcode.com',
        isGuest: true
      }

      localStorage.setItem('feetcode_token', 'guest_token_' + Date.now())
      localStorage.setItem('feetcode_user_id', guestUser.id)
      localStorage.setItem('feetcode_user', JSON.stringify(guestUser))

      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
      return
    }

    // Demo login/signup
    const demoUser = {
      id: 'demo_' + Date.now(),
      username: formData.username || 'demo_user',
      email: formData.email || 'demo@feetcode.com',
      created_at: new Date().toISOString()
    }

    localStorage.setItem('feetcode_token', 'demo_token_' + Date.now())
    localStorage.setItem('feetcode_user_id', demoUser.id)
    localStorage.setItem('feetcode_user', JSON.stringify(demoUser))

    setTimeout(() => {
      router.push('/dashboard')
    }, 1500)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-10">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className={`absolute animate-float ${
              i % 3 === 0 ? 'text-purple-500' :
              i % 3 === 1 ? 'text-pink-500' : 'text-blue-500'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 10}px`,
              animationDelay: `${Math.random() * 3}s`
            }}
          >
            {['⚡', '🔥', '💎', '🚀', '⭐', '👑'][Math.floor(Math.random() * 6)]}
          </div>
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Features Preview */}
        <div className={`hidden lg:flex lg:w-1/2 flex-col justify-center p-12 transition-all duration-1000 ${
          showFeatures ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
        }`}>
          <div className="max-w-lg">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Code className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  FeetCode
                </h2>
                <p className="text-muted-foreground">The iconic coding platform</p>
              </div>
            </div>

            <h3 className="text-2xl font-bold mb-6">
              {vibe === 'genz' ? 'Why FeetCode Hits Different:' :
               vibe === 'humorous' ? 'What Makes Us Awesome:' :
               'Platform Features:'}
            </h3>

            <div className="space-y-4">
              {content.features.map((feature, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 transition-all duration-500 ${
                    showFeatures ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 100 + 200}ms` }}
                >
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" />
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-card/50 backdrop-blur-sm rounded-xl border">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>1,000+ Users</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  <span>47+ Problems</span>
                </div>
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4" />
                  <span>Daily Streaks</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="flex-1 lg:w-1/2 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="card p-8 backdrop-blur-lg">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-gentle">
                  {isLogin ? <LogIn className="h-10 w-10 text-white" /> : <UserPlus className="h-10 w-10 text-white" />}
                </div>
                <h1 className="text-3xl font-bold mb-2">
                  {isLogin ? content.loginTitle : content.signupTitle}
                </h1>
                <p className="text-muted-foreground">
                  {isLogin ? content.loginSubtitle : content.signupSubtitle}
                </p>
              </div>

              {/* Form */}
              <div className="space-y-4">
                {/* Username */}
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    placeholder={vibe === 'genz' ? 'Your iconic username...' : 
                               vibe === 'humorous' ? 'Your superhero name...' : 
                               'Username'}
                    className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover-glow"
                    onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
                  />
                </div>

                {/* Email (signup only) */}
                {!isLogin && (
                  <div className="relative animate-slide-in-up">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder={vibe === 'genz' ? 'Your email bestie...' : 
                                 vibe === 'humorous' ? 'Where we send the good news...' : 
                                 'Email address'}
                      className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover-glow"
                    />
                  </div>
                )}

                {/* Password */}
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder={vibe === 'genz' ? 'Super secret password...' : 
                               vibe === 'humorous' ? 'Password (not 123456 please)...' : 
                               'Password'}
                    className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover-glow"
                    onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
                  />
                </div>

                {/* Main Auth Button */}
                <button
                  onClick={() => handleAuth()}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] hover-lift"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {vibe === 'genz' ? 'Loading your glow up...' :
                       vibe === 'humorous' ? 'Preparing the magic...' :
                       'Processing...'}
                    </div>
                  ) : (
                    isLogin ? content.loginButton : content.signupButton
                  )}
                </button>

                {/* Guest Option */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">or</span>
                  </div>
                </div>

                <button
                  onClick={() => handleAuth(true)}
                  disabled={isLoading}
                  className="w-full bg-muted/50 text-foreground py-3 rounded-lg font-medium hover:bg-muted/70 transition-all border border-border hover-lift"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    {content.guestButton}
                  </div>
                </button>

                {/* Switch Mode */}
                <div className="text-center text-sm">
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    {isLogin ? content.switchSignup : content.switchLogin}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Demo Users */}
            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground mb-3">Quick Demo Users:</p>
              <div className="flex gap-2 justify-center">
                {['CodeNinja', 'AlgoMaster', 'DevQueen'].map(username => (
                  <button
                    key={username}
                    onClick={() => {
                      setFormData({ username, email: `${username.toLowerCase()}@demo.com`, password: 'demo123' })
                      handleAuth()
                    }}
                    className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
                  >
                    {username}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Animation */}
      {isLoading && (
        <div className="fixed inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <Crown className="h-12 w-12 text-white" />
            </div>
            <div className="text-2xl font-bold text-foreground mb-2">
              {vibe === 'genz' ? 'Preparing Your Main Character Moment...' :
               vibe === 'humorous' ? 'Rolling Out the Red Carpet...' :
               'Setting Up Your Dashboard...'}
            </div>
            <div className="flex justify-center gap-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 200}ms` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}