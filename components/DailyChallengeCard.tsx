'use client'

import { useState, useEffect } from 'react'
import { Calendar, Flame, Trophy, Clock, Star } from 'lucide-react'
import { useVibe } from '../hooks/useVibe'

interface DailyChallengeCardProps {
  onStart: () => void
}

export default function DailyChallengeCard({ onStart }: DailyChallengeCardProps) {
  const { vibe } = useVibe()
  const [streak, setStreak] = useState(7)
  const [timeLeft, setTimeLeft] = useState('23:45:12')
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    // Update countdown timer
    const timer = setInterval(() => {
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)
      
      const diff = tomorrow.getTime() - now.getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      
      setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const getVibeContent = () => {
    switch(vibe) {
      case 'humorous':
        return {
          title: "Today's Brain Teaser! 🧠",
          subtitle: "Don't let your brain get rusty!",
          streakText: "Days of not giving up!",
          buttonText: "Let's Go Solve This! 🚀"
        }
      case 'genz':
        return {
          title: "Daily Main Character Moment ✨",
          subtitle: "Time to serve some coding excellence bestie!",
          streakText: "Days of being iconic fr fr",
          buttonText: "It's Giving Solution Energy 💅"
        }
      default:
        return {
          title: "Daily Coding Challenge",
          subtitle: "Maintain your problem-solving momentum",
          streakText: "Day streak maintained",
          buttonText: "Start Challenge"
        }
    }
  }

  const content = getVibeContent()

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 rounded-xl p-6 text-white shadow-2xl">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full translate-x-20 translate-y-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">{content.title}</h2>
            <p className="text-orange-100">{content.subtitle}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-xl font-bold">
              <Flame className="w-6 h-6 text-orange-300" />
              {streak}
            </div>
            <p className="text-sm text-orange-100">{content.streakText}</p>
          </div>
        </div>

        {/* Today's Challenge Preview */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-300" />
              <span className="font-medium">Two Sum - Array Edition</span>
            </div>
            <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full font-bold">
              EASY
            </span>
          </div>
          
          <p className="text-sm text-white/90 mb-3">
            {vibe === 'genz' ? 
              "Find two numbers that are perfect for each other bestie! It's giving math romance energy ✨" :
              vibe === 'humorous' ?
              "Play matchmaker for lonely numbers looking for their perfect sum companion! 💕" :
              "Find two numbers in an array that sum to a target value."
            }
          </p>

          {/* Quick stats */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Trophy className="w-4 h-4" />
                +50 XP
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                ~15 min
              </span>
            </div>
            <div className="text-white/70">
              Resets in {timeLeft}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              setIsCompleted(true)
              onStart()
            }}
            disabled={isCompleted}
            className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all ${
              isCompleted 
                ? 'bg-green-500 text-white cursor-not-allowed'
                : 'bg-white text-purple-600 hover:bg-gray-100 hover:scale-105'
            }`}
          >
            {isCompleted ? '✅ Completed Today!' : content.buttonText}
          </button>
          
          <button className="p-3 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors">
            <Calendar className="w-5 h-5" />
          </button>
        </div>

        {/* Streak visualization */}
        <div className="mt-4 flex justify-center gap-1">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className={`w-8 h-2 rounded-full ${
                i < streak ? 'bg-orange-300' : 'bg-white/20'
              }`}
            />
          ))}
        </div>
        <p className="text-center text-xs text-white/70 mt-2">
          7-day streak progress
        </p>
      </div>
    </div>
  )
}