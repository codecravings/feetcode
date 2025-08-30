'use client'

import { useState, useEffect } from 'react'
import { Crown, Flame, Zap, Target, Trophy, Sword, Star, TrendingUp } from 'lucide-react'
import { useVibe } from '../hooks/useVibe'

interface Player {
  rank: number
  username: string
  solvedToday: number
  streak: number
  totalSolved: number
  avgTime: string
  country: string
  isYou?: boolean
  trend: 'up' | 'down' | 'same'
}

export default function CompetitiveLeaderboard() {
  const { vibe } = useVibe()
  const [timeFrame, setTimeFrame] = useState<'daily' | 'weekly' | 'alltime'>('daily')
  const [players, setPlayers] = useState<Player[]>([
    { rank: 1, username: 'CodeNinja_2024', solvedToday: 47, streak: 23, totalSolved: 892, avgTime: '1m 23s', country: '🇺🇸', trend: 'up' },
    { rank: 2, username: 'QuantumSolver', solvedToday: 45, streak: 19, totalSolved: 756, avgTime: '1m 45s', country: '🇯🇵', trend: 'same' },
    { rank: 3, username: 'AlgoMaster3000', solvedToday: 43, streak: 31, totalSolved: 1023, avgTime: '2m 12s', country: '🇮🇳', trend: 'down' },
    { rank: 4, username: 'SpeedDemon_X', solvedToday: 41, streak: 15, totalSolved: 634, avgTime: '58s', country: '🇰🇷', trend: 'up' },
    { rank: 5, username: 'ByteWarrior', solvedToday: 39, streak: 12, totalSolved: 567, avgTime: '2m 34s', country: '🇨🇦', trend: 'up' },
    { rank: 2847, username: 'You', solvedToday: 3, streak: 7, totalSolved: 23, avgTime: '5m 12s', country: '🌍', isYou: true, trend: 'up' },
  ])

  const getVibeContent = () => {
    switch(vibe) {
      case 'genz':
        return {
          title: "Who's The Main Character Today? 👑✨",
          subtitle: "Daily rankings for the most iconic coders",
          youRank: `You're currently serving #${players.find(p => p.isYou)?.rank} energy bestie! Time to climb! 💅`,
          labels: {
            solved: 'Problems Slayed',
            streak: 'Iconic Days',
            avgTime: 'Speed Queen/King'
          }
        }
      case 'humorous':
        return {
          title: "The Hunger Games of Coding 🏹💻",
          subtitle: "May the algorithms be ever in your favor",
          youRank: `You're #${players.find(p => p.isYou)?.rank} - not bad, but those top coders are laughing! 😏`,
          labels: {
            solved: 'Problems Destroyed',
            streak: 'Addiction Level',
            avgTime: 'Speed Demon'
          }
        }
      default:
        return {
          title: "Global Leaderboard",
          subtitle: "Top performers worldwide",
          youRank: `Your current rank: #${players.find(p => p.isYou)?.rank}`,
          labels: {
            solved: 'Problems Solved',
            streak: 'Day Streak',
            avgTime: 'Avg Time'
          }
        }
    }
  }

  const content = getVibeContent()

  const getRankStyle = (rank: number) => {
    if (rank === 1) return 'from-yellow-400 to-yellow-600 text-yellow-900'
    if (rank === 2) return 'from-gray-300 to-gray-500 text-gray-900'
    if (rank === 3) return 'from-orange-400 to-orange-600 text-orange-900'
    return 'from-blue-500 to-purple-600 text-white'
  }

  const getTrendIcon = (trend: string) => {
    switch(trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'down': return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />
      default: return <div className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with trash talk */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          {content.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">{content.subtitle}</p>
        
        {/* Your rank callout */}
        <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-4 rounded-lg">
          <p className="font-bold">{content.youRank}</p>
          <p className="text-sm opacity-90">
            {vibe === 'genz' ? 'Time to show them who runs this! 💪✨' :
             vibe === 'humorous' ? 'Those top spots aren\'t gonna take themselves! 🚀' :
             'Keep practicing to climb higher!'}
          </p>
        </div>
      </div>

      {/* Time frame selector */}
      <div className="flex justify-center gap-2">
        {(['daily', 'weekly', 'alltime'] as const).map(frame => (
          <button
            key={frame}
            onClick={() => setTimeFrame(frame)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              timeFrame === frame
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            {frame === 'alltime' ? 'All Time' : frame.charAt(0).toUpperCase() + frame.slice(1)}
          </button>
        ))}
      </div>

      {/* Leaderboard */}
      <div className="space-y-2">
        {players.slice(0, 5).map((player) => (
          <div
            key={player.rank}
            className={`p-4 rounded-xl border-2 transition-all hover:scale-102 ${
              player.isYou 
                ? 'bg-gradient-to-r from-purple-100 to-pink-100 border-purple-300 dark:from-purple-900 dark:to-pink-900'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Rank badge */}
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getRankStyle(player.rank)} flex items-center justify-center font-bold text-lg`}>
                  {player.rank <= 3 ? <Crown className="w-6 h-6" /> : player.rank}
                </div>

                {/* Player info */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg text-gray-900 dark:text-white">
                      {player.username}
                    </span>
                    <span>{player.country}</span>
                    {getTrendIcon(player.trend)}
                    {player.isYou && (
                      <span className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                        YOU
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                    <span className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      {player.solvedToday} {content.labels.solved}
                    </span>
                    <span className="flex items-center gap-1">
                      <Flame className="w-4 h-4" />
                      {player.streak} {content.labels.streak}
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap className="w-4 h-4" />
                      {player.avgTime} {content.labels.avgTime}
                    </span>
                  </div>
                </div>
              </div>

              {/* Challenge button */}
              <button className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-lg font-bold hover:opacity-90 transition-opacity">
                {vibe === 'genz' ? 'Humble Them! 💅' :
                 vibe === 'humorous' ? 'Battle! ⚔️' :
                 'Challenge'}
              </button>
            </div>
          </div>
        ))}

        {/* Your position if not in top 5 */}
        {players.find(p => p.isYou && p.rank > 5) && (
          <>
            <div className="text-center py-2">
              <span className="text-gray-500">...</span>
            </div>
            <div className="p-4 rounded-xl border-2 bg-gradient-to-r from-purple-100 to-pink-100 border-purple-300 dark:from-purple-900 dark:to-pink-900">
              {/* Same structure as above for your rank */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold text-lg">
                    {players.find(p => p.isYou)?.rank}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg text-gray-900 dark:text-white">You</span>
                      <span>🌍</span>
                      <span className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                        CLIMB TIME! 🚀
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {vibe === 'genz' ? 'Time to serve some excellence bestie! ✨' :
                       vibe === 'humorous' ? 'Those spots above aren\'t gonna take themselves! 💪' :
                       'Keep solving to move up the ranks!'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Motivational CTA */}
      <div className="text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-xl">
        <h3 className="text-xl font-bold mb-2">
          {vibe === 'genz' ? 'Ready to show them who\'s iconic? ✨👑' :
           vibe === 'humorous' ? 'Think you can dethrone the kings? 👑💀' :
           'Ready to climb the leaderboard?'}
        </h3>
        <p className="mb-4 opacity-90">
          {vibe === 'genz' ? 'These rankings update every hour bestie - time to secure your spot! 💅' :
           vibe === 'humorous' ? 'Rankings update hourly. Time to make some enemies! 😈' :
           'Rankings update hourly. Start solving now!'}
        </p>
        <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
          {vibe === 'genz' ? 'Let\'s Get This Bread! 🍞✨' :
           vibe === 'humorous' ? 'Time To Destroy! 💥' :
           'Start Solving'}
        </button>
      </div>
    </div>
  )
}