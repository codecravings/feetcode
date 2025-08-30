'use client'

import { useState, useEffect } from 'react'
import { Trophy, Star, Flame, Zap, Target, Crown, Award, Medal } from 'lucide-react'
import { useVibe } from '../hooks/useVibe'

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  unlocked: boolean
  progress: number
  total: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  unlockedAt?: Date
}

export default function AchievementSystem() {
  const { vibe } = useVibe()
  const [showUnlocked, setShowUnlocked] = useState<string | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first_solve',
      title: vibe === 'genz' ? 'Main Character Moment ✨' : vibe === 'humorous' ? 'Breaking the Ice 🧊' : 'First Steps',
      description: vibe === 'genz' ? 'Solved your first problem like the icon you are!' : vibe === 'humorous' ? 'You solved your first problem! The crowd goes wild! 🎉' : 'Solve your first coding problem',
      icon: <Star className="w-6 h-6" />,
      unlocked: true,
      progress: 1,
      total: 1,
      rarity: 'common',
      unlockedAt: new Date()
    },
    {
      id: 'speed_demon',
      title: vibe === 'genz' ? 'Speed Queen/King 👑' : vibe === 'humorous' ? 'The Flash of Code ⚡' : 'Speed Demon',
      description: vibe === 'genz' ? 'Solved a problem in under 30 seconds - period!' : vibe === 'humorous' ? 'Faster than ordering pizza! Solved in under 30 seconds!' : 'Solve a problem in under 30 seconds',
      icon: <Zap className="w-6 h-6" />,
      unlocked: false,
      progress: 0,
      total: 1,
      rarity: 'rare'
    },
    {
      id: 'week_streak',
      title: vibe === 'genz' ? 'Consistency Queen/King 🔥' : vibe === 'humorous' ? 'Addiction Level: Expert 📈' : 'Week Warrior',
      description: vibe === 'genz' ? '7 days straight of serving excellence!' : vibe === 'humorous' ? 'Coded for 7 days straight. Should we be concerned? 🤔' : 'Maintain a 7-day solving streak',
      icon: <Flame className="w-6 h-6" />,
      unlocked: true,
      progress: 7,
      total: 7,
      rarity: 'epic',
      unlockedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
    },
    {
      id: 'perfectionist',
      title: vibe === 'genz' ? 'No Skips Energy 💯' : vibe === 'humorous' ? 'The Perfectionist 🎯' : 'Perfectionist',
      description: vibe === 'genz' ? 'First try, no mistakes - chef\'s kiss!' : vibe === 'humorous' ? 'Got it right on the first try. Show off! 😏' : 'Solve a problem on first attempt',
      icon: <Target className="w-6 h-6" />,
      unlocked: false,
      progress: 3,
      total: 5,
      rarity: 'rare'
    },
    {
      id: 'legend',
      title: vibe === 'genz' ? 'Coding Legend 🌟' : vibe === 'humorous' ? 'The Chosen One 👑' : 'Coding Legend',
      description: vibe === 'genz' ? '100 problems solved - absolute legend status!' : vibe === 'humorous' ? '100 problems solved! Time to update your LinkedIn! 💼' : 'Solve 100 coding problems',
      icon: <Crown className="w-6 h-6" />,
      unlocked: false,
      progress: 23,
      total: 100,
      rarity: 'legendary'
    }
  ])

  const getRarityStyle = (rarity: string) => {
    switch(rarity) {
      case 'common': return 'from-gray-400 to-gray-600'
      case 'rare': return 'from-blue-400 to-blue-600'
      case 'epic': return 'from-purple-400 to-purple-600'
      case 'legendary': return 'from-yellow-400 to-orange-500'
      default: return 'from-gray-400 to-gray-600'
    }
  }

  const getRarityBorder = (rarity: string) => {
    switch(rarity) {
      case 'common': return 'border-gray-300'
      case 'rare': return 'border-blue-300 shadow-blue-200'
      case 'epic': return 'border-purple-300 shadow-purple-200'
      case 'legendary': return 'border-yellow-300 shadow-yellow-200'
      default: return 'border-gray-300'
    }
  }

  const shareAchievement = (achievement: Achievement) => {
    const text = `🏆 Just unlocked "${achievement.title}" on FeetCode!\n\n${achievement.description}\n\nJoin me in coding with personality! 🚀\n\n#FeetCode #CodingAchievement #Programming`
    
    if (navigator.share) {
      navigator.share({
        title: `Achievement Unlocked: ${achievement.title}`,
        text,
        url: 'https://feetcode.dev'
      })
    } else {
      navigator.clipboard.writeText(text + '\nhttps://feetcode.dev')
      // Could also open Instagram/Twitter with pre-filled text
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {vibe === 'genz' ? 'Your Iconic Moments ✨' : vibe === 'humorous' ? 'Wall of Fame 🏆' : 'Achievements'}
        </h2>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {achievements.filter(a => a.unlocked).length} / {achievements.length} unlocked
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`relative p-6 rounded-xl border-2 transition-all hover:scale-105 cursor-pointer ${
              achievement.unlocked 
                ? `${getRarityBorder(achievement.rarity)} bg-white dark:bg-gray-800 shadow-lg`
                : 'border-gray-200 bg-gray-50 dark:bg-gray-900 opacity-60'
            }`}
            onClick={() => achievement.unlocked && setShowUnlocked(achievement.id)}
          >
            {/* Rarity glow effect */}
            {achievement.unlocked && achievement.rarity !== 'common' && (
              <div className={`absolute inset-0 bg-gradient-to-br ${getRarityStyle(achievement.rarity)} opacity-20 rounded-xl`} />
            )}

            <div className="relative z-10">
              {/* Icon */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                achievement.unlocked 
                  ? `bg-gradient-to-br ${getRarityStyle(achievement.rarity)} text-white`
                  : 'bg-gray-200 text-gray-400'
              }`}>
                {achievement.icon}
              </div>

              {/* Title and Description */}
              <h3 className={`font-bold mb-2 ${
                achievement.unlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500'
              }`}>
                {achievement.title}
              </h3>
              
              <p className={`text-sm mb-4 ${
                achievement.unlocked ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400'
              }`}>
                {achievement.description}
              </p>

              {/* Progress bar */}
              {!achievement.unlocked && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Progress</span>
                    <span>{achievement.progress}/{achievement.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Unlocked indicator */}
              {achievement.unlocked && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-green-600 font-medium">
                    ✅ Unlocked
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      shareAchievement(achievement)
                    }}
                    className="text-xs bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-full hover:opacity-80 transition-opacity"
                  >
                    Share 📱
                  </button>
                </div>
              )}

              {/* Rarity badge */}
              <div className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded-full text-white bg-gradient-to-r ${getRarityStyle(achievement.rarity)}`}>
                {achievement.rarity.toUpperCase()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Achievement unlock modal */}
      {showUnlocked && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full text-center">
            <div className="animate-bounce mb-4">
              <Trophy className="w-16 h-16 mx-auto text-yellow-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
              Achievement Unlocked! 🎉
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {vibe === 'genz' ? 'You absolutely slayed that bestie! ✨' : 
               vibe === 'humorous' ? 'Look at you being all accomplished and stuff! 🏆' :
               'Congratulations on your achievement!'}
            </p>
            <button
              onClick={() => setShowUnlocked(null)}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-bold hover:opacity-90 transition-opacity"
            >
              Awesome! 🚀
            </button>
          </div>
        </div>
      )}
    </div>
  )
}