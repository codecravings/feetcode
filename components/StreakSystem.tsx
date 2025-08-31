'use client'

import React, { useState, useEffect } from 'react'
import { useVibe } from '../hooks/useVibe'
import { 
  Flame, 
  Calendar, 
  Trophy, 
  Share2, 
  Shield, 
  Target,
  Award,
  TrendingUp,
  Zap
} from 'lucide-react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastProblemDate: string
  streakFreeze: boolean
  freezeCount: number
  totalProblems: number
  weeklyStreak: number[]
}

export default function StreakSystem() {
  const { vibe } = useVibe()
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastProblemDate: new Date().toISOString(),
    streakFreeze: false,
    freezeCount: 2,
    totalProblems: 0,
    weeklyStreak: [0, 0, 0, 0, 0, 0, 0]
  })
  const [loading, setLoading] = useState(true)

  const [showShareModal, setShowShareModal] = useState(false)
  const [celebrationEffect, setCelebrationEffect] = useState(false)

  useEffect(() => {
    fetchStreakData()
  }, [])

  const fetchStreakData = async () => {
    try {
      const token = localStorage.getItem('feetcode_token')
      const userId = localStorage.getItem('feetcode_user_id') || 'demo123'
      
      const response = await fetch(`/api/server/streaks/${userId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })

      if (response.ok) {
        const data = await response.json()
        setStreakData({
          currentStreak: data.currentStreak,
          longestStreak: data.longestStreak,
          lastProblemDate: data.lastProblemDate,
          streakFreeze: data.streakFreeze,
          freezeCount: data.freezeCount,
          totalProblems: data.totalProblems,
          weeklyStreak: data.weeklyStreak
        })
      } else {
        // Fallback to demo data
        setStreakData({
          currentStreak: 23,
          longestStreak: 47,
          lastProblemDate: new Date().toISOString(),
          streakFreeze: false,
          freezeCount: 2,
          totalProblems: 156,
          weeklyStreak: [1, 1, 1, 1, 1, 0, 1]
        })
      }
    } catch (error) {
      console.error('Failed to fetch streak data:', error)
      // Fallback to demo data
      setStreakData({
        currentStreak: 23,
        longestStreak: 47,
        lastProblemDate: new Date().toISOString(),
        streakFreeze: false,
        freezeCount: 2,
        totalProblems: 156,
        weeklyStreak: [1, 1, 1, 1, 1, 0, 1]
      })
    } finally {
      setLoading(false)
    }
  }

  const getVibeContent = () => {
    switch(vibe) {
      case 'genz':
        return {
          title: "Streak Status: Main Character Energy 🔥",
          subtitle: "Consistency is serving looks bestie!",
          shareText: `Day ${streakData.currentStreak} of coding and I'm literally unstoppable! 💅✨ #FeetCodeStreak #CodingLife`,
          motivationText: [
            "You're literally iconic bestie!",
            "This streak is giving main character vibes!",
            "Periodt! Keep serving that consistency!",
            "Your future self is thanking you rn!"
          ]
        }
      case 'humorous':
        return {
          title: "🔥 Your Streak is on Fire! (Literally)",
          subtitle: "Warning: This streak may cause extreme confidence!",
          shareText: `${streakData.currentStreak} days of coding straight! My keyboard is probably tired but I'm not! 🔥 #CodingStreak #NeverGiveUp`,
          motivationText: [
            "Your commitment is stronger than my coffee!",
            "Even Netflix is jealous of this consistency!",
            "You're more reliable than my internet connection!",
            "This streak deserves its own trophy case!"
          ]
        }
      default:
        return {
          title: "📈 Coding Streak Analytics",
          subtitle: "Consistent practice builds expertise",
          shareText: `Maintaining a ${streakData.currentStreak}-day coding streak. Building skills through consistent daily practice. #CodingJourney #Growth`,
          motivationText: [
            "Consistency compounds into mastery",
            "Each day builds upon the last",
            "Progress through persistence",
            "Excellence through repetition"
          ]
        }
    }
  }

  const content = getVibeContent()

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'from-red-500 to-orange-500'
    if (streak >= 14) return 'from-orange-500 to-yellow-500'
    if (streak >= 7) return 'from-yellow-500 to-green-500'
    return 'from-green-500 to-blue-500'
  }

  const getRewardLevel = (streak: number) => {
    if (streak >= 100) return { level: 'Legend', icon: '👑', color: 'text-purple-500' }
    if (streak >= 50) return { level: 'Master', icon: '🏆', color: 'text-yellow-500' }
    if (streak >= 30) return { level: 'Expert', icon: '⭐', color: 'text-orange-500' }
    if (streak >= 14) return { level: 'Pro', icon: '🔥', color: 'text-red-500' }
    if (streak >= 7) return { level: 'Rising', icon: '📈', color: 'text-green-500' }
    return { level: 'Starter', icon: '🌱', color: 'text-blue-500' }
  }

  const shareStreak = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'FeetCode Streak',
          text: content.shareText,
          url: window.location.origin
        })
      } catch (err) {
        console.log('Sharing cancelled')
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(content.shareText)
      setShowShareModal(true)
      setTimeout(() => setShowShareModal(false), 3000)
    }
  }

  const useStreakFreeze = async () => {
    if (streakData.freezeCount > 0) {
      try {
        const token = localStorage.getItem('feetcode_token')
        const userId = localStorage.getItem('feetcode_user_id') || 'demo123'
        
        const response = await fetch(`/api/server/streaks/${userId}/freeze`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        })

        if (response.ok) {
          const data = await response.json()
          setStreakData(prev => ({
            ...prev,
            streakFreeze: true,
            freezeCount: data.remainingFreezes
          }))
        }
      } catch (error) {
        console.error('Failed to use streak freeze:', error)
        // Fallback to local update
        setStreakData(prev => ({
          ...prev,
          streakFreeze: true,
          freezeCount: prev.freezeCount - 1
        }))
      }
    }
  }

  const triggerCelebration = () => {
    setCelebrationEffect(true)
    setTimeout(() => setCelebrationEffect(false), 2000)
  }

  const reward = getRewardLevel(streakData.currentStreak)

  if (loading) {
    return (
      <div className="bg-card rounded-xl p-6 border shadow-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/2" />
          <div className="h-4 bg-muted rounded w-2/3" />
          <div className="flex justify-center">
            <div className="w-32 h-32 bg-muted rounded-full" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-xl p-6 border shadow-lg relative overflow-hidden">
      {/* Celebration Effect */}
      {celebrationEffect && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 animate-pulse"></div>
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 200}ms`
              }}
            >
              ⭐
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold mb-1">{content.title}</h3>
          <p className="text-muted-foreground">{content.subtitle}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={shareStreak}
            className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
            title="Share Streak"
          >
            <Share2 className="h-5 w-5" />
          </button>
          {streakData.freezeCount > 0 && (
            <button
              onClick={useStreakFreeze}
              className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition-colors"
              title="Use Streak Freeze"
            >
              <Shield className="h-5 w-5 text-blue-500" />
            </button>
          )}
        </div>
      </div>

      {/* Main Streak Display */}
      <div className="text-center mb-6">
        <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-r ${getStreakColor(streakData.currentStreak)} mb-4 relative`}>
          <div className="bg-card rounded-full w-28 h-28 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold">{streakData.currentStreak}</div>
              <div className="text-sm text-muted-foreground">days</div>
            </div>
          </div>
          <Flame className="absolute -top-1 -right-1 h-8 w-8 text-orange-500 animate-bounce" />
        </div>
        
        <div className={`text-lg font-semibold ${reward.color} mb-2`}>
          {reward.icon} {reward.level} Level
        </div>
        
        <p className="text-muted-foreground">
          {content.motivationText[Math.floor(Math.random() * content.motivationText.length)]}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <Trophy className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
          <div className="text-xl font-bold">{streakData.longestStreak}</div>
          <div className="text-xs text-muted-foreground">Best Streak</div>
        </div>
        
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <Target className="h-6 w-6 mx-auto mb-2 text-green-500" />
          <div className="text-xl font-bold">{streakData.totalProblems}</div>
          <div className="text-xs text-muted-foreground">Total Solved</div>
        </div>
        
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <Shield className="h-6 w-6 mx-auto mb-2 text-blue-500" />
          <div className="text-xl font-bold">{streakData.freezeCount}</div>
          <div className="text-xs text-muted-foreground">Freezes Left</div>
        </div>
        
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <TrendingUp className="h-6 w-6 mx-auto mb-2 text-purple-500" />
          <div className="text-xl font-bold">{Math.round(streakData.totalProblems / streakData.currentStreak)}</div>
          <div className="text-xs text-muted-foreground">Avg/Day</div>
        </div>
      </div>

      {/* Weekly Calendar */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          This Week
        </h4>
        <div className="grid grid-cols-7 gap-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <div key={day} className="text-center">
              <div className="text-xs text-muted-foreground mb-1">{day}</div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                streakData.weeklyStreak[index] 
                  ? 'bg-green-500 text-white' 
                  : 'bg-muted border-2 border-dashed border-muted-foreground/30'
              }`}>
                {streakData.weeklyStreak[index] ? <Zap className="h-4 w-4" /> : ''}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Reward Preview */}
      <div className="bg-muted/30 rounded-lg p-4">
        <h4 className="font-semibold mb-2">Next Milestone</h4>
        <div className="flex items-center gap-3">
          <Award className="h-8 w-8 text-yellow-500" />
          <div className="flex-1">
            <div className="text-sm font-medium">
              {streakData.currentStreak >= 100 ? 'Legend Status Achieved!' : 
               streakData.currentStreak >= 50 ? '100-Day Legend' :
               streakData.currentStreak >= 30 ? '50-Day Master' :
               streakData.currentStreak >= 14 ? '30-Day Expert' :
               streakData.currentStreak >= 7 ? '14-Day Pro' : '7-Day Rising'}
            </div>
            <div className="text-xs text-muted-foreground">
              {streakData.currentStreak >= 100 ? 'You are unstoppable!' :
               `${(streakData.currentStreak >= 50 ? 100 : 
                   streakData.currentStreak >= 30 ? 50 :
                   streakData.currentStreak >= 14 ? 30 :
                   streakData.currentStreak >= 7 ? 14 : 7) - streakData.currentStreak} days to go`}
            </div>
          </div>
          <button
            onClick={triggerCelebration}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors"
          >
            Celebrate 🎉
          </button>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
          <div className="bg-card p-6 rounded-lg border shadow-lg text-center">
            <div className="text-2xl mb-2">📋</div>
            <h4 className="font-semibold mb-2">Copied to Clipboard!</h4>
            <p className="text-sm text-muted-foreground">Share your streak on social media</p>
          </div>
        </div>
      )}
    </div>
  )
}