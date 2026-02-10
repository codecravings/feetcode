'use client'

import React, { useState, useEffect } from 'react'
import { useVibe } from '../../hooks/useVibe'
import ModernNavbar from '../../components/modern/Navbar'
import Link from 'next/link'
import DailyChallengeCard from '../../components/DailyChallengeCard'
import ViralStats from '../../components/ViralStats'
import CompetitiveLeaderboard from '../../components/CompetitiveLeaderboard'
import AchievementSystem from '../../components/AchievementSystem'
import StreakSystem from '../../components/StreakSystem'
import DarkAestheticTheme from '../../components/DarkAestheticTheme'
import ShareableCodeCard from '../../components/ShareableCodeCard'
import QuickLogin from '../../components/QuickLogin'
import { 
  Trophy,
  Target,
  TrendingUp,
  Clock,
  Zap,
  Award,
  CheckCircle,
  Calendar,
  Flame,
  Code,
  BarChart3,
  Star,
  Crown
} from 'lucide-react'

interface UserStats {
  problemsSolved: number
  totalSubmissions: number
  acceptedSubmissions: number
  currentStreak: number
  maxStreak: number
  lastSolved: string
  easyProblems: number
  mediumProblems: number
  hardProblems: number
}

interface RecentSubmission {
  id: string
  problemTitle: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded'
  language: string
  submittedAt: string
  executionTime: number
}

export default function DashboardPage() {
  const { vibe } = useVibe() 
  const [user, setUser] = useState<any>(null) 
  const [userStats, setUserStats] = useState<UserStats | null>(null) 
  const [recentSubmissions, setRecentSubmissions] = useState<RecentSubmission[]>([]) 
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    checkAuth()
    fetchDashboardData()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('feetcode_token')
    if (!token) {
      // Demo mode - set a mock user for testing
      setUser({ 
        username: 'demo_user',
        email: 'demo@feetcode.com',
        id: 'demo123'
      })
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/server/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        // Fallback to demo user if auth fails
        setUser({ 
          username: 'demo_user',
          email: 'demo@feetcode.com',
          id: 'demo123'
        })
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      // Fallback to demo user if auth fails
      setUser({ 
        username: 'demo_user',
        email: 'demo@feetcode.com',
        id: 'demo123'
      })
    }
  }

  const fetchDashboardData = async () => {
    try {
      // Mock data for demo - replace with real API calls
      setUserStats({
        problemsSolved: 47,
        totalSubmissions: 89,
        acceptedSubmissions: 47,
        currentStreak: 5,
        maxStreak: 12,
        lastSolved: '2 hours ago',
        easyProblems: 23,
        mediumProblems: 18,
        hardProblems: 6
      })

      setRecentSubmissions([
        {
          id: '1',
          problemTitle: 'Two Sum',
          difficulty: 'Easy',
          status: 'Accepted',
          language: 'JavaScript',
          submittedAt: '2 hours ago',
          executionTime: 68
        },
        {
          id: '2',
          problemTitle: 'Valid Parentheses',
          difficulty: 'Easy',
          status: 'Accepted',
          language: 'Python',
          submittedAt: '1 day ago',
          executionTime: 52
        },
        {
          id: '3',
          problemTitle: 'Longest Substring',
          difficulty: 'Medium',
          status: 'Wrong Answer',
          language: 'JavaScript',
          submittedAt: '2 days ago',
          executionTime: 0
        }
      ])
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getVibeContent = () => {
    const content = {
      professional: {
        title: "Dashboard",
        welcomeMessage: "Track your progress and improve your coding skills",
        statsTitle: "Your Statistics",
        recentTitle: "Recent Submissions"
      },
      humorous: {
        title: "Your Coding Comedy Club Dashboard",
        welcomeMessage: "Let's see how your coding adventure is going! 🎭",
        statsTitle: "The Numbers Game (Don't Worry, It's Not Boring)",
        recentTitle: "Your Recent Coding Shenanigans"
      },
      genz: {
        title: "Your Main Character Dashboard",
        welcomeMessage: "Bestie, let's check those coding stats - you're doing amazing! ✨",
        statsTitle: "The Tea on Your Progress ☕",
        recentTitle: "Recent Coding Moments"
      }
    }
    return content[vibe as keyof typeof content] || content.professional
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-success'
      case 'Medium': return 'text-warning'  
      case 'Hard': return 'text-destructive'
      default: return 'text-muted-foreground'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted': return 'text-success'
      case 'Wrong Answer': return 'text-destructive'
      case 'Time Limit Exceeded': return 'text-warning'
      default: return 'text-muted-foreground'
    }
  }

  const currentContent = getVibeContent()

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg">
        <ModernNavbar />
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-shimmer h-32 bg-muted/20 rounded-xl" />
            ))}
          </div>
          <div className="animate-shimmer h-64 bg-muted/20 rounded-xl" />
        </div>
      </div>
    )
  }

  if (!user) {
    return <QuickLogin onLogin={setUser} />
  }

  return (
    <div className="min-h-screen gradient-bg">
      <ModernNavbar />
      
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {currentContent.title}
          </h1>
          <p className="text-xl text-muted-foreground">
            Welcome back, {user.username}! {currentContent.welcomeMessage}
          </p>
        </div>

        {/* Daily Challenge - First thing users see */}
        <DailyChallengeCard onStart={() => window.location.href = '/problems'} />

        {/* Viral Stats for Social Media */}
        <ViralStats />

        {/* Streak System */}
        <StreakSystem />

        {/* Stats Cards */}
        {userStats && (
          <>
            <h2 className="text-2xl font-semibold mb-6">{currentContent.statsTitle}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="card p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{userStats.problemsSolved}</div>
                    <div className="text-sm text-muted-foreground">Problems Solved</div>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <Flame className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{userStats.currentStreak}</div>
                    <div className="text-sm text-muted-foreground">Current Streak</div>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {Math.round((userStats.acceptedSubmissions / userStats.totalSubmissions) * 100)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Acceptance Rate</div>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{userStats.maxStreak}</div>
                    <div className="text-sm text-muted-foreground">Max Streak</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Difficulty Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <div className="card p-6">
                <h3 className="font-semibold mb-4 flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Problems by Difficulty</span>
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-success font-medium">Easy</span>
                    <span className="font-bold">{userStats.easyProblems}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-success h-2 rounded-full" style={{ width: `${(userStats.easyProblems / userStats.problemsSolved) * 100}%` }} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-warning font-medium">Medium</span>
                    <span className="font-bold">{userStats.mediumProblems}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-warning h-2 rounded-full" style={{ width: `${(userStats.mediumProblems / userStats.problemsSolved) * 100}%` }} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-destructive font-medium">Hard</span>
                    <span className="font-bold">{userStats.hardProblems}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-destructive h-2 rounded-full" style={{ width: `${(userStats.hardProblems / userStats.problemsSolved) * 100}%` }} />
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h3 className="font-semibold mb-4 flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Quick Stats</span>
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Submissions</span>
                    <span className="font-semibold">{userStats.totalSubmissions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Accepted</span>
                    <span className="font-semibold text-success">{userStats.acceptedSubmissions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Last Solved</span>
                    <span className="font-semibold">{userStats.lastSolved}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Recent Submissions */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">{currentContent.recentTitle}</h2>
          <div className="card overflow-hidden">
            <div className="divide-y divide-border">
              {recentSubmissions.map((submission) => (
                <div key={submission.id} className="p-6 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <CheckCircle className={`h-6 w-6 ${getStatusColor(submission.status)}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold">{submission.problemTitle}</h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className={getDifficultyColor(submission.difficulty)}>
                            {submission.difficulty}
                          </span>
                          <span>{submission.language}</span>
                          <span>{submission.submittedAt}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${getStatusColor(submission.status)}`}>
                        {submission.status}
                      </div>
                      {submission.executionTime > 0 && (
                        <div className="text-sm text-muted-foreground">
                          {submission.executionTime}ms
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements System */}
        <AchievementSystem />

        {/* Competitive Leaderboard */}
        <CompetitiveLeaderboard />

        {/* Shareable Code Card for last submission */}
        {recentSubmissions.length > 0 && recentSubmissions[0].status === 'Accepted' && (
          <ShareableCodeCard
            code="function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n}"
            problemTitle={recentSubmissions[0].problemTitle}
            difficulty={recentSubmissions[0].difficulty}
            language={recentSubmissions[0].language}
            runtime={`${recentSubmissions[0].executionTime}ms`}
            vibe={vibe}
          />
        )}

        {/* Dark Aesthetic Themes for Social Media */}
        <DarkAestheticTheme />

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-xl">
          <h3 className="text-2xl font-bold mb-4">
            {vibe === 'genz' ? 'Ready to serve more excellence bestie? ✨' :
             vibe === 'humorous' ? 'Time to show these problems who\'s boss! 💪' :
             'Ready for your next challenge?'}
          </h3>
          <Link href="/problems" className="bg-white text-purple-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors inline-block">
            {vibe === 'genz' ? 'Let\'s Get It! 💅' :
             vibe === 'humorous' ? 'Bring on the Problems! 🚀' :
             'Continue Practicing'}
          </Link>
        </div>
      </div>
    </div>
  )
}
