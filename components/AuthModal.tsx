'use client'

import { useState } from 'react'
import { X, User, Mail, Lock, Eye, EyeOff } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onAuth: (user: any) => void
  vibe: string
}

export default function AuthModal({ isOpen, onClose, onAuth, vibe }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    preferredVibe: vibe
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const vibeContent = {
    professional: {
      title: isLogin ? 'Sign In' : 'Create Account',
      subtitle: isLogin ? 'Access your coding progress' : 'Start your coding journey',
      loginBtn: 'Sign In',
      registerBtn: 'Create Account',
      switchText: isLogin ? "Don't have an account?" : "Already have an account?",
      switchLink: isLogin ? 'Create one' : 'Sign in'
    },
    humorous: {
      title: isLogin ? 'Welcome Back, Code Warrior!' : 'Join the Code Comedy Club!',
      subtitle: isLogin ? "Time to debug some more of life's problems" : "Ready to laugh while you learn?",
      loginBtn: 'Let Me In!',
      registerBtn: 'Join the Fun',
      switchText: isLogin ? "New to the circus?" : "Already part of our comedy show?",
      switchLink: isLogin ? 'Get your ticket' : 'Take the stage'
    },
    genz: {
      title: isLogin ? 'Yooo, Welcome Back!' : 'Time to Join the Coding Fam!',
      subtitle: isLogin ? "Let's get back to that grind fr" : "About to be coding different, no cap",
      loginBtn: "Let's Gooo",
      registerBtn: "I'm Ready",
      switchText: isLogin ? "First time here?" : "Already one of us?",
      switchLink: isLogin ? "Let's get you started" : "Come on in"
    }
  }

  const content = vibeContent[vibe as keyof typeof vibeContent]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const endpoint = isLogin ? '/api/server/auth/login' : '/api/server/auth/register'
      const payload = isLogin 
        ? { emailOrUsername: formData.email || formData.username, password: formData.password }
        : formData

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      localStorage.setItem('feetcode_token', data.token)
      onAuth(data.user)
      onClose()
      
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{content.title}</h2>
          <p className="text-gray-600">{content.subtitle}</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your username"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isLogin ? 'Email or Username' : 'Email'}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type={isLogin ? "text" : "email"}
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={isLogin ? "Email or username" : "your.email@example.com"}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your password"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Vibe
              </label>
              <select
                name="preferredVibe"
                value={formData.preferredVibe}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="professional">Professional</option>
                <option value="humorous">Humorous</option>
                <option value="genz">Gen Z</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Loading...' : (isLogin ? content.loginBtn : content.registerBtn)}
          </button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-gray-600">{content.switchText} </span>
          <button
            onClick={() => {
              setIsLogin(!isLogin)
              setError('')
              setFormData(prev => ({ ...prev, username: '', email: '', password: '' }))
            }}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            {content.switchLink}
          </button>
        </div>
      </div>
    </div>
  )
}