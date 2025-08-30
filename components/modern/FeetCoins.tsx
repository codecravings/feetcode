'use client'

import React, { useState, useEffect } from 'react'
import { useVibe } from '../../hooks/useVibe.tsx'
import { 
  Coins, 
  Trophy, 
  Flame, 
  Zap, 
  Gift,
  ShoppingBag,
  Star,
  TrendingUp,
  Award,
  Sparkles
} from 'lucide-react'

interface FeetCoinsData {
  balance: number
  totalEarned: number
  earnEvents: EarnEvent[]
  spendEvents: SpendEvent[]
  achievements: Achievement[]
}

interface EarnEvent {
  id: string
  amount: number
  reason: string
  timestamp: Date
  icon: 'trophy' | 'flame' | 'zap' | 'star' | 'award'
}

interface SpendEvent {
  id: string
  amount: number
  item: string
  description: string
  timestamp: Date
  icon: 'gift' | 'shopping-bag' | 'sparkles'
}

interface Achievement {
  id: string
  title: string
  message: {
    professional: string
    humorous: string
    genz: string
  }
  coinsEarned: number
  timestamp: Date
  unlocked: boolean
}

const mockEarnEvents: EarnEvent[] = [
  {
    id: '1',
    amount: 50,
    reason: "Solved problem without Googling!",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    icon: 'trophy'
  },
  {
    id: '2', 
    amount: 100,
    reason: "7-day coding streak!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    icon: 'flame'
  },
  {
    id: '3',
    amount: 75,
    reason: "Fixed bug on first try!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    icon: 'zap'
  }
]

const mockSpendEvents: SpendEvent[] = [
  {
    id: '1',
    amount: 150,
    item: "Motivational Meme Pack",
    description: "Babu Bhaiya wisdom collection",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    icon: 'gift'
  },
  {
    id: '2',
    amount: 100,
    item: "Dark Mode Premium",
    description: "Your eyes say thank you",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
    icon: 'sparkles'
  }
]

const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: "First Blood",
    message: {
      professional: "Completed first problem successfully. Excellent start!",
      humorous: "You solved your first problem! Take these coins and flex on your friends 💪",
      genz: "FIRST BLOOD! You're literally built different bestie ✨"
    },
    coinsEarned: 100,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    unlocked: true
  },
  {
    id: '2',
    title: "Debugging Legend",
    message: {
      professional: "Found 5 bugs in a single session. Outstanding debugging skills.",
      humorous: "Found 5 bugs today! You're literally a bug detective 🐛",
      genz: "DEBUGGING LEGEND! The dedication is giving main character energy 🔥"
    },
    coinsEarned: 250,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    unlocked: true
  }
]

export default function FeetCoins() {
  const { vibe } = useVibe()
  const [coinsData, setCoinsData] = useState<FeetCoinsData>({
    balance: 1250,
    totalEarned: 2000,
    earnEvents: mockEarnEvents,
    spendEvents: mockSpendEvents,
    achievements: mockAchievements
  })
  const [showEarnAnimation, setShowEarnAnimation] = useState(false)
  const [activeTab, setActiveTab] = useState<'earn' | 'spend' | 'achievements'>('earn')

  const getVibeContent = () => {
    const content = {
      professional: {
        title: "FeetCoins Wallet",
        subtitle: "Track your coding achievements and rewards",
        earnTab: "Recent Earnings",
        spendTab: "Purchases", 
        achievementsTab: "Achievements"
      },
      humorous: {
        title: "FeetCoins Bank 🏦",
        subtitle: "Your coding hustle is paying off literally!",
        earnTab: "Money Makers",
        spendTab: "Splurges",
        achievementsTab: "Hall of Fame"
      },
      genz: {
        title: "FeetCoins Wallet ✨",
        subtitle: "Bestie, you're getting that bag! 💰",
        earnTab: "Coin Flexes",
        spendTab: "Shopping Spree", 
        achievementsTab: "Iconic Moments"
      }
    }
    return content[vibe as keyof typeof content]
  }

  const simulateEarnCoins = (amount: number, reason: string) => {
    setCoinsData(prev => ({
      ...prev,
      balance: prev.balance + amount,
      totalEarned: prev.totalEarned + amount,
      earnEvents: [{
        id: Date.now().toString(),
        amount,
        reason,
        timestamp: new Date(),
        icon: 'star'
      }, ...prev.earnEvents]
    }))
    setShowEarnAnimation(true)
    setTimeout(() => setShowEarnAnimation(false), 2000)
  }

  const getIconComponent = (iconName: string) => {
    const icons = {
      trophy: Trophy,
      flame: Flame, 
      zap: Zap,
      star: Star,
      award: Award,
      gift: Gift,
      'shopping-bag': ShoppingBag,
      sparkles: Sparkles
    }
    const Icon = icons[iconName as keyof typeof icons] || Star
    return <Icon className="h-5 w-5" />
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  const currentContent = getVibeContent()

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="relative inline-block">
          <h2 className="text-3xl font-bold mb-2">{currentContent.title}</h2>
          {showEarnAnimation && (
            <div className="absolute -top-2 -right-2 animate-bounce">
              <Sparkles className="h-6 w-6 text-yellow-500" />
            </div>
          )}
        </div>
        <p className="text-muted-foreground">{currentContent.subtitle}</p>
      </div>

      {/* Balance Card */}
      <div className="card p-6 mb-8 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Coins className="h-8 w-8 text-yellow-500" />
            <span className="text-4xl font-bold text-yellow-600">{coinsData.balance}</span>
          </div>
          <p className="text-lg font-semibold text-yellow-700">FeetCoins</p>
          <p className="text-sm text-muted-foreground mt-1">
            Total earned: {coinsData.totalEarned} coins
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => simulateEarnCoins(25, "Daily login bonus!")}
          className="btn-primary flex items-center justify-center space-x-2"
        >
          <Gift className="h-5 w-5" />
          <span>Daily Bonus</span>
        </button>
        <button
          onClick={() => simulateEarnCoins(50, "Code review completed!")}
          className="btn-secondary flex items-center justify-center space-x-2"
        >
          <TrendingUp className="h-5 w-5" />
          <span>Quick Earn</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg mb-6">
        {(['earn', 'spend', 'achievements'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === tab 
                ? 'bg-white dark:bg-gray-800 text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab === 'earn' && currentContent.earnTab}
            {tab === 'spend' && currentContent.spendTab}
            {tab === 'achievements' && currentContent.achievementsTab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {/* Earn Events */}
        {activeTab === 'earn' && (
          <>
            {coinsData.earnEvents.map((event) => (
              <div key={event.id} className="card p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center text-success">
                    {getIconComponent(event.icon)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{event.reason}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatTimeAgo(event.timestamp)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-success">+{event.amount}</p>
                    <p className="text-xs text-muted-foreground">FeetCoins</p>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* Spend Events */}
        {activeTab === 'spend' && (
          <>
            {coinsData.spendEvents.map((event) => (
              <div key={event.id} className="card p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                    {getIconComponent(event.icon)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{event.item}</p>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTimeAgo(event.timestamp)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-destructive">-{event.amount}</p>
                    <p className="text-xs text-muted-foreground">FeetCoins</p>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Store Items */}
            <div className="border-t pt-4 mt-6">
              <h3 className="font-semibold mb-4">Available Items</h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="card p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Sparkles className="h-8 w-8 text-purple-500" />
                      <div>
                        <p className="font-medium">Rainbow Theme</p>
                        <p className="text-sm text-muted-foreground">Disco mode activated</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-yellow-600">200</p>
                      <p className="text-xs text-muted-foreground">FeetCoins</p>
                    </div>
                  </div>
                </div>
                
                <div className="card p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Gift className="h-8 w-8 text-red-500" />
                      <div>
                        <p className="font-medium">Hint for Hard Problem</p>
                        <p className="text-sm text-muted-foreground">When you're stuck bestie</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-yellow-600">75</p>
                      <p className="text-xs text-muted-foreground">FeetCoins</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Achievements */}
        {activeTab === 'achievements' && (
          <>
            {coinsData.achievements.map((achievement) => (
              <div key={achievement.id} className="card p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{achievement.title}</h3>
                    <p className="text-muted-foreground mb-2">
                      {achievement.message[vibe as keyof typeof achievement.message]}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        {formatTimeAgo(achievement.timestamp)}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Coins className="h-4 w-4 text-yellow-500" />
                        <span className="font-bold text-yellow-600">
                          +{achievement.coinsEarned}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}