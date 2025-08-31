'use client'

import React, { useState, useEffect } from 'react'
import { useVibe } from '../hooks/useVibe'
import { 
  Crown,
  Trophy,
  Medal,
  Flame,
  Target,
  TrendingUp,
  Users,
  Star,
  Zap,
  Award
} from 'lucide-react'

interface LeaderboardUser {
  id: string
  username: string
  avatar?: string
  currentStreak: number
  longestStreak: number
  totalProblems: number
  rank: number
  isCurrentUser?: boolean
  country?: string
  level: 'Starter' | 'Rising' | 'Pro' | 'Expert' | 'Master' | 'Legend'
}

interface StreakLeaderboardProps {
  variant?: 'current' | 'longest' | 'global'
  limit?: number
  showCountry?: boolean
}

export default function StreakLeaderboard({ 
  variant = 'current', 
  limit = 10,
  showCountry = false 
}: StreakLeaderboardProps) {
  const { vibe } = useVibe()
  const [users, setUsers] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'all-time'>('all-time')

  useEffect(() => {
    fetchLeaderboardData()
  }, [variant, timeframe])

  const fetchLeaderboardData = async () => {
    setLoading(true)
    
    try {
      const response = await fetch(`/api/server/streaks/leaderboard/${variant}?limit=50`)
      
      if (response.ok) {
        const data = await response.json()
        setUsers(data.leaderboard.map((user: any) => ({
          id: user.id,
          username: user.username,
          currentStreak: user.current_streak,
          longestStreak: user.max_streak,
          totalProblems: user.problems_solved,
          rank: user.rank,
          level: user.level,
          isCurrentUser: user.username === 'demo_user'
        })))
        setLoading(false)
        return
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error)
    }

    // Fallback to mock data
    const mockUsers: LeaderboardUser[] = [
      {
        id: '1',
        username: 'CodeNinja23',
        currentStreak: 156,
        longestStreak: 200,
        totalProblems: 847,
        rank: 1,
        level: 'Legend',
        country: '🇺🇸'
      },
      {
        id: '2', 
        username: 'AlgoMaster',
        currentStreak: 134,
        longestStreak: 180,
        totalProblems: 623,
        rank: 2,
        level: 'Master',
        country: '🇨🇦'
      },
      {
        id: '3',
        username: 'ByteSlayer',
        currentStreak: 89,
        longestStreak: 145,
        totalProblems: 456,
        rank: 3,
        level: 'Expert',
        country: '🇬🇧'
      },
      {
        id: '4',
        username: 'current_user',
        currentStreak: 23,
        longestStreak: 47,
        totalProblems: 156,
        rank: 47,
        level: 'Pro',
        isCurrentUser: true,
        country: '🇺🇸'
      }
    ]

    // Sort by the selected variant
    const sortedUsers = mockUsers.sort((a, b) => {
      switch (variant) {
        case 'longest':
          return b.longestStreak - a.longestStreak
        case 'global':
          return b.totalProblems - a.totalProblems
        default:
          return b.currentStreak - a.currentStreak
      }
    }).slice(0, limit)

    setUsers(sortedUsers)
    setLoading(false)
  }

  const getVibeContent = () => {
    switch (vibe) {
      case 'genz':
        return {
          title: {
            current: '🔥 Current Streak Icons',
            longest: '👑 All-Time Streak Legends', 
            global: '✨ Global Coding Queens & Kings'
          },
          subtitle: 'These coders are serving LOOKS with their consistency! 💅',
          emptyMessage: 'Be the first to slay this leaderboard bestie! ✨'
        }
      case 'humorous':
        return {
          title: {
            current: '🔥 Streak Hall of Fame',
            longest: '🏆 The Streak Legends',
            global: '🌍 Global Coding Champions'
          },
          subtitle: 'These coding legends never miss leg day... or code day! 💪',
          emptyMessage: 'This leaderboard is lonelier than a developer on Friday night! 😢'
        }
      default:
        return {
          title: {
            current: '🏆 Current Streak Leaderboard',
            longest: '📈 Longest Streak Records',
            global: '🌟 Global Rankings'
          },
          subtitle: 'Top performers maintaining consistent coding practice',
          emptyMessage: 'No data available. Start building your streak!'
        }
    }
  }

  const content = getVibeContent()

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />
      case 2:
        return <Trophy className="h-6 w-6 text-gray-400" />
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Legend':
        return 'text-purple-500 bg-purple-500/10'
      case 'Master':
        return 'text-yellow-500 bg-yellow-500/10'
      case 'Expert':
        return 'text-orange-500 bg-orange-500/10'
      case 'Pro':
        return 'text-red-500 bg-red-500/10'
      case 'Rising':
        return 'text-green-500 bg-green-500/10'
      default:
        return 'text-blue-500 bg-blue-500/10'
    }
  }

  const getStreakValue = (user: LeaderboardUser) => {
    switch (variant) {
      case 'longest':
        return user.longestStreak
      case 'global':
        return user.totalProblems
      default:
        return user.currentStreak
    }
  }

  const getStreakLabel = () => {
    switch (variant) {
      case 'longest':
        return 'Best'
      case 'global':
        return 'Total'
      default:
        return 'Current'
    }
  }

  if (loading) {
    return (
      <div className="card p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/3" />
          <div className="h-4 bg-muted rounded w-2/3" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-10 h-10 bg-muted rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-1/4" />
                <div className="h-3 bg-muted rounded w-1/6" />
              </div>
              <div className="h-6 bg-muted rounded w-12" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold mb-1">
            {content.title[variant]}
          </h3>
          <p className="text-sm text-muted-foreground">
            {content.subtitle}
          </p>
        </div>
        
        <div className="flex gap-2">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
            className="text-xs bg-muted border border-border rounded px-2 py-1"
          >
            <option value="weekly">This Week</option>
            <option value="monthly">This Month</option>
            <option value="all-time">All Time</option>
          </select>
        </div>
      </div>

      {/* Toggle Buttons */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'current', label: 'Current', icon: Flame },
          { key: 'longest', label: 'Longest', icon: Trophy }, 
          { key: 'global', label: 'Global', icon: Users }
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setUsers([])}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              variant === key 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted/30 hover:bg-muted/50'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Leaderboard List */}
      <div className="space-y-3">
        {users.length > 0 ? users.map((user, index) => (
          <div
            key={user.id}
            className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-200 hover:bg-muted/30 ${
              user.isCurrentUser ? 'bg-primary/10 border border-primary/20' : 'bg-muted/10'
            }`}
          >
            {/* Rank */}
            <div className="flex-shrink-0 w-12 flex justify-center">
              {getRankIcon(user.rank)}
            </div>

            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
              {user.username[0].toUpperCase()}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`font-semibold ${user.isCurrentUser ? 'text-primary' : ''}`}>
                  {user.username}
                  {user.isCurrentUser && ' (You)'}
                </span>
                {showCountry && user.country && (
                  <span className="text-sm">{user.country}</span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getLevelColor(user.level)}`}>
                  {user.level}
                </span>
                <span>{user.totalProblems} problems</span>
              </div>
            </div>

            {/* Streak Value */}
            <div className="text-right">
              <div className="flex items-center gap-1">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="text-xl font-bold">{getStreakValue(user)}</span>
              </div>
              <div className="text-xs text-muted-foreground">{getStreakLabel()}</div>
            </div>
          </div>
        )) : (
          <div className="text-center py-12 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{content.emptyMessage}</p>
          </div>
        )}
      </div>

      {/* Current User Position (if not in top list) */}
      {users.length > 0 && !users.find(u => u.isCurrentUser) && (
        <div className="mt-6 pt-4 border-t border-border">
          <div className="text-sm text-muted-foreground mb-2">Your Position:</div>
          <div className="flex items-center gap-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="w-8 text-center">
              <span className="text-sm font-bold text-muted-foreground">#47</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
              U
            </div>
            <div className="flex-1">
              <div className="font-semibold text-primary">You</div>
              <div className="text-xs text-muted-foreground">Pro Level • 156 problems</div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="font-bold">23</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}