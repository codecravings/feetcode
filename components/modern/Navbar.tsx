'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from '../../hooks/useTheme'
import { useVibe } from '../../hooks/useVibe'
import AuthModal from '../auth/AuthModal'
import { 
  Code2, 
  Sun, 
  Moon, 
  Monitor, 
  User, 
  Settings, 
  LogOut, 
  Trophy,
  BookOpen,
  BarChart3,
  Sparkles,
  Menu,
  X
} from 'lucide-react'

export default function ModernNavbar() {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const { vibe, setVibe } = useVibe()
  const [user, setUser] = useState<{username?: string; email?: string; problems_solved?: number} | null>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('feetcode_token')
    if (!token) return

    try {
      const response = await fetch('/api/server/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('feetcode_token')
    setUser(null)
    setShowUserMenu(false)
  }

  const handleAuthSuccess = (userData: any) => {
    setUser(userData)
    setShowAuthModal(false)
  }

  const vibeConfig = {
    professional: { 
      label: 'Professional', 
      icon: '💼', 
      color: 'from-blue-500 to-indigo-500' 
    },
    humorous: { 
      label: 'Humorous', 
      icon: '😄', 
      color: 'from-orange-500 to-red-500' 
    },
    genz: { 
      label: 'Gen Z', 
      icon: '💅', 
      color: 'from-purple-500 to-pink-500' 
    }
  }

  const themeIcons = {
    light: Sun,
    dark: Moon,
    system: Monitor
  }

  if (!mounted) {
    return (
      <nav className="sticky top-0 z-50 glass border-b backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Code2 className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">FeetCode</span>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="sticky top-0 z-50 glass border-b backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Code2 className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
              <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              FeetCode
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/problems" className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors">
              <BookOpen className="h-4 w-4" />
              <span>Problems</span>
            </Link>
            <Link href="/features" className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors">
              <Sparkles className="h-4 w-4" />
              <span>Features</span>
            </Link>
            <Link href="/leaderboard" className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors">
              <Trophy className="h-4 w-4" />
              <span>Leaderboard</span>
            </Link>
            <Link href="/dashboard" className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors">
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </div>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Vibe Switcher */}
            <div className="flex items-center space-x-1 p-1 bg-muted rounded-lg">
              {Object.entries(vibeConfig).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setVibe(key as 'professional' | 'humorous' | 'genz')}
                  className={`relative px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                    vibe === key
                      ? 'bg-white dark:bg-gray-800 shadow-sm text-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-gray-800/50'
                  }`}
                  title={config.label}
                >
                  <span className="flex items-center space-x-1">
                    <span>{config.icon}</span>
                    <span className="hidden lg:inline">{config.label}</span>
                  </span>
                  {vibe === key && (
                    <div className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r ${config.color} rounded-full`} />
                  )}
                </button>
              ))}
            </div>

            {/* Theme Switcher */}
            <div className="relative">
              <button
                onClick={() => {
                  const themes = ['light', 'dark', 'system']
                  const currentIndex = themes.indexOf(theme)
                  const nextIndex = (currentIndex + 1) % themes.length
                  setTheme(themes[nextIndex])
                }}
                className="p-2 rounded-lg bg-muted hover:bg-accent transition-colors"
                title={`Current: ${theme} (${resolvedTheme})`}
              >
                {React.createElement(themeIcons[theme as keyof typeof themeIcons], { className: "h-5 w-5" })}
              </button>
            </div>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-500 rounded-full flex items-center justify-center text-primary-foreground text-sm font-semibold">
                    {user.username?.[0]?.toUpperCase() || '?'}
                  </div>
                  <span className="hidden lg:inline font-medium">{user.username}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 card p-2 shadow-lg border">
                    <div className="px-3 py-2 border-b border-border mb-2">
                      <p className="font-semibold">{user.username}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.problems_solved || 0} problems solved
                      </p>
                    </div>
                    
                    <div className="space-y-1">
                      <Link href="/profile" className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-accent transition-colors">
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                      <Link href="/settings" className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-accent transition-colors">
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth" className="btn-secondary">
                  Sign In
                </Link>
                <Link href="/auth" className="btn-primary flex items-center space-x-1">
                  <Sparkles className="h-4 w-4" />
                  <span>Get Started</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
          >
            {showMobileMenu ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-border py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Link href="/problems" className="block px-3 py-2 rounded-lg hover:bg-accent transition-colors">
                  Problems
                </Link>
                <Link href="/features" className="block px-3 py-2 rounded-lg hover:bg-accent transition-colors">
                  Features
                </Link>
                <Link href="/leaderboard" className="block px-3 py-2 rounded-lg hover:bg-accent transition-colors">
                  Leaderboard
                </Link>
                <Link href="/dashboard" className="block px-3 py-2 rounded-lg hover:bg-accent transition-colors">
                  Dashboard
                </Link>
              </div>

              {/* Mobile Vibe Switcher */}
              <div className="px-3">
                <p className="text-sm font-medium text-muted-foreground mb-2">Vibe</p>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(vibeConfig).map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => setVibe(key as 'professional' | 'humorous' | 'genz')}
                      className={`p-2 rounded-lg text-sm font-medium transition-all ${
                        vibe === key
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <span className="flex flex-col items-center space-y-1">
                        <span>{config.icon}</span>
                        <span>{config.label}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {user && (
                <div className="px-3 pt-4 border-t border-border">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </nav>
  )
}