'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Code, User, LogOut, Settings, Trophy, Home, BookOpen, BarChart3 } from 'lucide-react'

interface NavbarProps {
  vibe: string
  onVibeChange: (vibe: string) => void
  onAuthClick: () => void
}

export default function Navbar({ vibe, onVibeChange, onAuthClick }: NavbarProps) {
  const [user, setUser] = useState<any>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('feetcode_token')
    if (!token) return

    try {
      const response = await fetch('/api/server/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        if (data.user?.preferredVibe) {
          onVibeChange(data.user.preferredVibe)
        }
      } else {
        localStorage.removeItem('feetcode_token')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('feetcode_token')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('feetcode_token')
    setUser(null)
    setShowUserMenu(false)
  }

  const handleVibeChange = async (newVibe: string) => {
    onVibeChange(newVibe)
    
    if (user) {
      try {
        const token = localStorage.getItem('feetcode_token')
        await fetch('/api/server/auth/preferences', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ preferredVibe: newVibe })
        })
      } catch (error) {
        console.error('Failed to update preferences:', error)
      }
    }
  }

  const vibeLabels = {
    professional: 'Professional',
    humorous: 'Humorous',
    genz: 'Gen Z'
  }

  return (
    <nav className="bg-white shadow-sm border-b p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Code className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-800">FeetCode</span>
        </div>

        <div className="flex items-center space-x-4">
          {/* Vibe Switcher */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {Object.entries(vibeLabels).map(([vibeKey, label]) => (
              <button
                key={vibeKey}
                onClick={() => handleVibeChange(vibeKey)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  vibe === vibeKey
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-white hover:text-gray-800'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-2 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {user.username[0].toUpperCase()}
                </div>
                <span className="font-medium text-gray-700">{user.username}</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border py-2 z-50">
                  <div className="px-4 py-2 border-b">
                    <p className="font-semibold text-gray-800">{user.username}</p>
                    <p className="text-sm text-gray-500">
                      {user.stats.problemsSolved} problems solved
                    </p>
                  </div>
                  
                  <div className="py-2">
                    <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </button>
                    <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                      <Trophy className="h-4 w-4" />
                      <span>Achievements</span>
                    </button>
                    <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </button>
                  </div>
                  
                  <div className="border-t pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onAuthClick}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}