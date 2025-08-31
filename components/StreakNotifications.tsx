'use client'

import React, { useState, useEffect } from 'react'
import { useVibe } from '../hooks/useVibe'
import { 
  Bell,
  BellRing,
  X,
  Flame,
  Target,
  Calendar,
  Clock,
  Award,
  Zap
} from 'lucide-react'

interface NotificationProps {
  type: 'streak-reminder' | 'milestone' | 'freeze-warning' | 'celebration'
  title: string
  message: string
  onDismiss: () => void
  actionText?: string
  onAction?: () => void
}

function StreakNotification({ 
  type, 
  title, 
  message, 
  onDismiss, 
  actionText, 
  onAction 
}: NotificationProps) {
  const { vibe } = useVibe()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(onDismiss, 300)
  }

  const getTypeIcon = () => {
    switch (type) {
      case 'streak-reminder':
        return <Bell className="h-5 w-5 text-blue-500" />
      case 'milestone':
        return <Award className="h-5 w-5 text-yellow-500" />
      case 'freeze-warning':
        return <Clock className="h-5 w-5 text-orange-500" />
      case 'celebration':
        return <Flame className="h-5 w-5 text-red-500" />
    }
  }

  const getTypeColors = () => {
    switch (type) {
      case 'streak-reminder':
        return 'border-blue-500/20 bg-blue-500/5'
      case 'milestone':
        return 'border-yellow-500/20 bg-yellow-500/5'
      case 'freeze-warning':
        return 'border-orange-500/20 bg-orange-500/5'
      case 'celebration':
        return 'border-red-500/20 bg-red-500/5'
    }
  }

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className={`card p-4 border-l-4 ${getTypeColors()} max-w-sm shadow-lg`}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {getTypeIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm mb-1">{title}</h4>
            <p className="text-sm text-muted-foreground">{message}</p>
            {actionText && onAction && (
              <button
                onClick={onAction}
                className="mt-2 text-xs bg-primary text-primary-foreground px-3 py-1 rounded-md hover:bg-primary/90 transition-colors"
              >
                {actionText}
              </button>
            )}
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function StreakNotifications() {
  const { vibe } = useVibe()
  const [notifications, setNotifications] = useState<Array<{
    id: string
    type: 'streak-reminder' | 'milestone' | 'freeze-warning' | 'celebration'
    title: string
    message: string
    actionText?: string
    onAction?: () => void
  }>>([])

  const [streakData, setStreakData] = useState({
    currentStreak: 23,
    lastProblemTime: new Date().getTime() - (6 * 60 * 60 * 1000), // 6 hours ago
    hasStreakFreeze: true,
    freezeCount: 2
  })

  useEffect(() => {
    checkForNotifications()
    
    // Check every hour for new notifications
    const interval = setInterval(checkForNotifications, 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const checkForNotifications = () => {
    const now = new Date().getTime()
    const timeSinceLastProblem = now - streakData.lastProblemTime
    const hoursAgo = Math.floor(timeSinceLastProblem / (60 * 60 * 1000))

    // Daily reminder (after 20 hours)
    if (hoursAgo >= 20 && hoursAgo < 24) {
      addNotification({
        id: 'daily-reminder',
        type: 'streak-reminder',
        title: getVibeTitle('reminder'),
        message: getVibeMessage('reminder'),
        actionText: 'Solve Now',
        onAction: () => window.location.href = '/problems'
      })
    }

    // Streak freeze warning (after 22 hours)
    if (hoursAgo >= 22 && hoursAgo < 24 && streakData.hasStreakFreeze) {
      addNotification({
        id: 'freeze-warning',
        type: 'freeze-warning',
        title: getVibeTitle('freeze'),
        message: getVibeMessage('freeze'),
        actionText: 'Use Freeze',
        onAction: () => console.log('Streak freeze activated')
      })
    }

    // Milestone celebrations
    if (streakData.currentStreak > 0 && [7, 14, 30, 50, 100].includes(streakData.currentStreak)) {
      addNotification({
        id: `milestone-${streakData.currentStreak}`,
        type: 'celebration',
        title: getVibeTitle('milestone'),
        message: getVibeMessage('milestone'),
        actionText: 'Share Achievement',
        onAction: () => shareStreakMilestone()
      })
    }
  }

  const getVibeTitle = (type: string) => {
    switch (vibe) {
      case 'genz':
        return {
          reminder: '⏰ Bestie, your streak needs you!',
          freeze: '🧊 Freeze time bestie?',
          milestone: '🎉 You just served excellence!'
        }[type] || 'Notification'
      case 'humorous':
        return {
          reminder: '🚨 Your streak is feeling lonely!',
          freeze: '❄️ Emergency freeze protocol?',
          milestone: '🎊 Achievement unlocked!'
        }[type] || 'Hey there!'
      default:
        return {
          reminder: '🔔 Daily coding reminder',
          freeze: '🛡️ Streak freeze available',
          milestone: '🏆 Milestone reached'
        }[type] || 'Notification'
    }
  }

  const getVibeMessage = (type: string) => {
    switch (vibe) {
      case 'genz':
        return {
          reminder: `Don't let that ${streakData.currentStreak}-day streak end! You're too iconic for that 💅`,
          freeze: `Use your streak freeze to protect that ${streakData.currentStreak}-day run. You've got ${streakData.freezeCount} left!`,
          milestone: `${streakData.currentStreak} days straight! You're literally the main character of coding! ✨`
        }[type] || 'Something happened!'
      case 'humorous':
        return {
          reminder: `Your ${streakData.currentStreak}-day streak is waiting! Don't leave it hanging like bad WiFi!`,
          freeze: `Save your streak! You have ${streakData.freezeCount} freeze powers left. Use them wisely!`,
          milestone: `${streakData.currentStreak} days of coding! Even my calculator is impressed! 🧮`
        }[type] || 'Something cool happened!'
      default:
        return {
          reminder: `Maintain your ${streakData.currentStreak}-day streak with today's coding practice.`,
          freeze: `Protect your streak with a freeze. ${streakData.freezeCount} freezes remaining.`,
          milestone: `Congratulations on reaching ${streakData.currentStreak} consecutive days!`
        }[type] || 'Notification message'
    }
  }

  const addNotification = (notification: any) => {
    // Don't add duplicate notifications
    if (notifications.find(n => n.id === notification.id)) return

    setNotifications(prev => [...prev, notification])
    
    // Auto-dismiss after 10 seconds
    setTimeout(() => {
      dismissNotification(notification.id)
    }, 10000)
  }

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const shareStreakMilestone = async () => {
    const shareText = `🔥 Just hit ${streakData.currentStreak} days of coding on FeetCode! Building skills one problem at a time. #CodingStreak #FeetCode`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'FeetCode Streak Milestone',
          text: shareText,
          url: window.location.origin
        })
      } catch (err) {
        console.log('Sharing cancelled')
      }
    } else {
      navigator.clipboard.writeText(shareText)
      addNotification({
        id: 'share-copied',
        type: 'celebration',
        title: '📋 Copied to Clipboard!',
        message: 'Share your achievement on social media'
      })
    }
  }

  return (
    <div className="fixed top-0 right-0 z-50 p-4 space-y-3 max-w-sm">
      {notifications.map(notification => (
        <StreakNotification
          key={notification.id}
          type={notification.type}
          title={notification.title}
          message={notification.message}
          actionText={notification.actionText}
          onAction={notification.onAction}
          onDismiss={() => dismissNotification(notification.id)}
        />
      ))}
    </div>
  )
}

export function useStreakNotifications() {
  const addDailyReminder = () => {
    // This would be called by a service worker or background task
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('FeetCode Daily Reminder', {
        body: 'Keep your coding streak alive! Solve a problem today.',
        icon: '/favicon.ico',
        badge: '/favicon.ico'
      })
    }
  }

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }
    return false
  }

  return {
    addDailyReminder,
    requestNotificationPermission
  }
}