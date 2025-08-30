'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Clock, Zap, Target, Users, Crown, Flame, Share2 } from 'lucide-react'
import { useVibe } from '../hooks/useVibe'

export default function ViralStats() {
  const { vibe } = useVibe()
  const [stats, setStats] = useState({
    solvesInARow: 12,
    fastestSolve: '23s',
    codeLines: 1337,
    rank: '#2,847',
    beaten: '127,543',
    efficiency: 94,
    streakDays: 15,
    nightOwlHours: '2:47 AM'
  })

  const getViralPhrases = () => {
    switch(vibe) {
      case 'genz':
        return {
          title: "Your Coding Flex Stats 💅✨",
          phrases: [
            `Currently serving ${stats.solvesInARow} problems in a row - PERIODT! 💯`,
            `Solved a problem in ${stats.fastestSolve} - that's main character energy! ⚡`,
            `Written ${stats.solvesInARow * 47} lines of pure iconic code 📝`,
            `Ranked ${stats.rank} globally - we love a competitive queen/king! 👑`,
            `Beat ${stats.beaten} other coders - respectfully humble them bestie! 🏆`,
            `${stats.efficiency}% efficiency - no cap, you're built different! 🔥`,
            `${stats.streakDays} day streak - consistency is giving excellence! ✨`,
            `Last solved at ${stats.nightOwlHours} - night owl coded hits different! 🌙`
          ]
        }
      case 'humorous':
        return {
          title: "Your Coding Bragging Rights 😎🏆",
          phrases: [
            `${stats.solvesInARow} problems solved in a row - you're basically unstoppable! 🚀`,
            `Fastest solve: ${stats.fastestSolve} - Flash would be jealous! ⚡`,
            `${stats.solvesInARow * 47} lines of code written - that's a small novel! 📚`,
            `Global rank ${stats.rank} - almost famous! 🌟`,
            `You've defeated ${stats.beaten} other coders in combat! ⚔️`,
            `${stats.efficiency}% efficiency - you're like a coding machine! 🤖`,
            `${stats.streakDays} day streak - someone's addicted to success! 📈`,
            `Coding at ${stats.nightOwlHours} - sleep is for the weak! 😴`
          ]
        }
      default:
        return {
          title: "Your Coding Statistics",
          phrases: [
            `Current solving streak: ${stats.solvesInARow} problems`,
            `Personal best time: ${stats.fastestSolve}`,
            `Total lines of code: ${stats.solvesInARow * 47}`,
            `Current global ranking: ${stats.rank}`,
            `Outperformed ${stats.beaten} developers`,
            `Code efficiency rating: ${stats.efficiency}%`,
            `Consecutive active days: ${stats.streakDays}`,
            `Most recent activity: ${stats.nightOwlHours}`
          ]
        }
    }
  }

  const content = getViralPhrases()

  const shareStats = () => {
    const flexText = vibe === 'genz' ? 
      `Just hit ${stats.solvesInARow} problems in a row on FeetCode! 💅✨\n\nCurrently ranked ${stats.rank} globally and I'm not stopping! Who's ready to get humbled? 👑\n\n#FeetCode #CodingQueen #TechTok #ProgrammingLife` :
      vibe === 'humorous' ?
      `LOL just solved ${stats.solvesInARow} coding problems in a row! 😂🔥\n\nI'm basically a coding machine now. Ranked ${stats.rank} globally and my efficiency is at ${stats.efficiency}%!\n\nCome get destroyed on FeetCode! 💪\n\n#FeetCode #CodingLife #TechHumor` :
      `Achieved ${stats.solvesInARow} consecutive solutions on FeetCode!\n\nGlobal rank: ${stats.rank}\nEfficiency: ${stats.efficiency}%\n\nJoin the coding challenge!\n\n#FeetCode #Programming #CodingChallenge`

    if (navigator.share) {
      navigator.share({
        title: 'My FeetCode Stats Are Insane!',
        text: flexText,
        url: 'https://feetcode.dev'
      })
    } else {
      navigator.clipboard.writeText(flexText + '\n\nhttps://feetcode.dev')
    }
  }

  return (
    <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-xl p-6 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full translate-x-32 -translate-y-32 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-400 rounded-full -translate-x-24 translate-y-24 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{content.title}</h2>
          <button
            onClick={shareStats}
            className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            <Share2 className="w-4 h-4" />
            Flex It! 💪
          </button>
        </div>

        {/* Clickbait stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-4 text-center transform hover:scale-105 transition-transform">
            <div className="text-2xl font-bold">{stats.solvesInARow}</div>
            <div className="text-sm opacity-90">In A Row! 🔥</div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg p-4 text-center transform hover:scale-105 transition-transform">
            <div className="text-2xl font-bold">{stats.fastestSolve}</div>
            <div className="text-sm opacity-90">Fastest! ⚡</div>
          </div>
          
          <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg p-4 text-center transform hover:scale-105 transition-transform">
            <div className="text-2xl font-bold">{stats.rank}</div>
            <div className="text-sm opacity-90">Global Rank! 🌍</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg p-4 text-center transform hover:scale-105 transition-transform">
            <div className="text-2xl font-bold">{stats.efficiency}%</div>
            <div className="text-sm opacity-90">Efficiency! 💯</div>
          </div>
        </div>

        {/* Viral phrases that update */}
        <div className="space-y-3">
          {content.phrases.map((phrase, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 hover:bg-white/20 transition-colors cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(phrase + '\n\nCheck out FeetCode: https://feetcode.dev')
              }}
            >
              <p className="text-sm">{phrase}</p>
              <span className="text-xs opacity-70">Click to copy! 📋</span>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="mt-6 text-center">
          <p className="text-lg font-bold mb-2">
            {vibe === 'genz' ? 'Ready to serve more excellence? ✨' :
             vibe === 'humorous' ? 'Think you can beat these stats? 😏' :
             'Ready for your next challenge?'}
          </p>
          <button className="bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity">
            {vibe === 'genz' ? 'Let\'s Get It Bestie! 💅' :
             vibe === 'humorous' ? 'Challenge Accepted! 🚀' :
             'Continue Coding'}
          </button>
        </div>
      </div>
    </div>
  )
}